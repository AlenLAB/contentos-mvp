'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePostcardStore } from '@/store/postcards'
import { AppLayout } from '@/components/AppLayout'
import { toast } from 'sonner'
import { 
  Loader2, 
  Sparkles, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Wand2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FormData {
  phaseTitle: string
  phaseDescription: string
  duration: number
  postsPerDay: number
  template: 'story' | 'tool' | 'mixed'
}

interface FormErrors {
  phaseTitle?: string
  phaseDescription?: string
  duration?: string
  postsPerDay?: string
}

export default function GeneratePage() {
  const router = useRouter()
  const { generatePhaseContent, isLoading } = usePostcardStore()
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    phaseTitle: '',
    phaseDescription: '',
    duration: 14,
    postsPerDay: 1,
    template: 'mixed'
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedCount, setGeneratedCount] = useState<number | null>(null)
  const [progressMessage, setProgressMessage] = useState<string>('')
  const [sessionId, setSessionId] = useState<string>('')

  // Calculate total posts that will be generated
  const totalPosts = formData.duration * formData.postsPerDay

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.phaseTitle.trim()) {
      newErrors.phaseTitle = 'Phase title is required'
    } else if (formData.phaseTitle.length < 3) {
      newErrors.phaseTitle = 'Phase title must be at least 3 characters'
    } else if (formData.phaseTitle.length > 100) {
      newErrors.phaseTitle = 'Phase title must be less than 100 characters'
    }
    
    if (!formData.phaseDescription.trim()) {
      newErrors.phaseDescription = 'Phase description is required'
    } else if (formData.phaseDescription.length < 10) {
      newErrors.phaseDescription = 'Description must be at least 10 characters'
    } else if (formData.phaseDescription.length > 1000) {
      newErrors.phaseDescription = 'Description must be less than 1000 characters'
    }
    
    if (formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 day'
    } else if (formData.duration > 30) {
      newErrors.duration = 'Duration cannot exceed 30 days'
    }
    
    if (![1, 2, 3].includes(formData.postsPerDay)) {
      newErrors.postsPerDay = 'Posts per day must be 1, 2, or 3'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission with real-time progress
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }
    
    setIsGenerating(true)
    setGenerationProgress(0)
    setProgressMessage('Initializing...')
    
    // Generate unique session ID
    const newSessionId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    
    // Connect to SSE for real-time progress
    const eventSource = new EventSource(`/api/generation-status?sessionId=${newSessionId}`)
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'progress') {
          setGenerationProgress(data.progress)
          setProgressMessage(data.message)
        } else if (data.type === 'complete') {
          setGenerationProgress(100)
          setProgressMessage(data.message)
          eventSource.close()
          
          if (data.status === 'completed') {
            setGeneratedCount(totalPosts)
            toast.success(
              `Successfully generated ${totalPosts} postcards!`,
              {
                description: `${formData.phaseTitle} content phase is ready`,
                icon: <CheckCircle className="h-5 w-5" />,
                duration: 3000
              }
            )
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          }
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err)
      }
    }
    
    eventSource.onerror = () => {
      eventSource.close()
      setIsGenerating(false)
      setGenerationProgress(0)
      toast.error('Lost connection to server')
    }
    
    try {
      // Notify server we're starting
      await fetch('/api/generation-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: newSessionId,
          type: 'start',
          totalPosts
        })
      })
      
      // Call generate function from store
      await generatePhaseContent({
        phaseTitle: formData.phaseTitle,
        phaseDescription: formData.phaseDescription,
        duration: formData.duration,
        postsPerDay: formData.postsPerDay,
        template: formData.template
      })
      
      // Notify server of completion
      await fetch('/api/generation-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: newSessionId,
          type: 'generated',
          count: totalPosts
        })
      })
      
    } catch (error) {
      eventSource.close()
      setIsGenerating(false)
      setGenerationProgress(0)
      
      // Notify server of error
      await fetch('/api/generation-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: newSessionId,
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to generate content'
        })
      })
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content'
      
      toast.error('Generation failed', {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5" />,
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(e)
        }
      })
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  return (
    <AppLayout>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Generate Content Phase
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Create AI-powered content for multiple days at once
            </p>
          </div>

          {/* Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Phase Configuration</CardTitle>
              <CardDescription>
                Define your content phase parameters. This will generate {totalPosts} postcards.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {/* Phase Title */}
                <div className="space-y-2">
                  <Label htmlFor="phaseTitle">
                    Phase Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phaseTitle"
                    type="text"
                    placeholder="e.g., Building in Public Journey"
                    value={formData.phaseTitle}
                    onChange={(e) => handleInputChange('phaseTitle', e.target.value)}
                    disabled={isGenerating}
                    className={errors.phaseTitle ? 'border-red-500' : ''}
                  />
                  {errors.phaseTitle && (
                    <p className="text-sm text-red-500">{errors.phaseTitle}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    A memorable name for this content phase
                  </p>
                </div>

                {/* Phase Description */}
                <div className="space-y-2">
                  <Label htmlFor="phaseDescription">
                    Phase Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="phaseDescription"
                    placeholder="Describe the theme, goals, and key topics for this content phase..."
                    value={formData.phaseDescription}
                    onChange={(e) => handleInputChange('phaseDescription', e.target.value)}
                    disabled={isGenerating}
                    rows={4}
                    className={errors.phaseDescription ? 'border-red-500' : ''}
                  />
                  {errors.phaseDescription && (
                    <p className="text-sm text-red-500">{errors.phaseDescription}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formData.phaseDescription.length}/1000 characters
                  </p>
                </div>

                {/* Duration and Posts per Day */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      Duration (days) <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="30"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                        disabled={isGenerating}
                        className={errors.duration ? 'border-red-500' : ''}
                      />
                    </div>
                    {errors.duration && (
                      <p className="text-sm text-red-500">{errors.duration}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Max 30 days
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postsPerDay">
                      Posts per Day <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <Select
                        value={formData.postsPerDay.toString()}
                        onValueChange={(value) => handleInputChange('postsPerDay', parseInt(value))}
                        disabled={isGenerating}
                      >
                        <SelectTrigger className={errors.postsPerDay ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select posts per day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 post per day</SelectItem>
                          <SelectItem value="2">2 posts per day</SelectItem>
                          <SelectItem value="3">3 posts per day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.postsPerDay && (
                      <p className="text-sm text-red-500">{errors.postsPerDay}</p>
                    )}
                  </div>
                </div>

                {/* Template Preference */}
                <div className="space-y-3">
                  <Label>Template Preference</Label>
                  <RadioGroup
                    value={formData.template}
                    onValueChange={(value) => handleInputChange('template', value as 'story' | 'tool' | 'mixed')}
                    disabled={isGenerating}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="story" id="story" />
                      <Label htmlFor="story" className="flex-1 cursor-pointer">
                        <span className="font-medium">Story Template</span>
                        <p className="text-sm text-gray-500">Personal experiences and learnings</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="tool" id="tool" />
                      <Label htmlFor="tool" className="flex-1 cursor-pointer">
                        <span className="font-medium">Tool Template</span>
                        <p className="text-sm text-gray-500">Practical tools and resources</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="mixed" id="mixed" />
                      <Label htmlFor="mixed" className="flex-1 cursor-pointer">
                        <span className="font-medium">Mixed Templates</span>
                        <p className="text-sm text-gray-500">Combination of stories and tools</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Summary */}
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-purple-900 dark:text-purple-200">
                      Generation Summary
                    </span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    This will generate <span className="font-bold">{totalPosts} postcards</span> over{' '}
                    <span className="font-bold">{formData.duration} days</span> using{' '}
                    <span className="font-bold">{formData.template}</span> template{formData.template === 'mixed' ? 's' : ''}.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={isGenerating || isLoading}
                  className="min-w-[150px]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating... {generationProgress}%
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate {totalPosts} Posts
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Progress Indicator */}
          {isGenerating && (
            <div className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Generating content with AI...
                      </span>
                      <span className="font-medium">{generationProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-500">
                        {progressMessage || 'Preparing content phase...'}
                      </p>
                      {sessionId && (
                        <p className="text-xs text-gray-400">
                          Session: {sessionId}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Success Message */}
          {generatedCount !== null && (
            <div className="mt-6">
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-200">
                        Success! Generated {generatedCount} postcards
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Redirecting to dashboard...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  )
}