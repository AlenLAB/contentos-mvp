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
  Target,
  Hash,
  Settings,
  Clock,
  ChevronDown,
  ChevronRight,
  Save,
  Plus,
  Linkedin,
  Twitter
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

// Enhanced FormData interface
interface EnhancedFormData {
  // Basic
  phaseTitle: string
  phaseDescription: string
  
  // Platform Personas
  platformPersonas: {
    linkedin: string
    x: string
  }
  
  // Duration & Posts
  duration: number
  postsPerDay: number
  
  // Template & Instructions
  templateStyle: 'story' | 'tool' | 'mixed'
  generationInstructions: string
  
  // Weekly Themes
  weeklyThemes: string[]
  weeklyDescriptions: string[]
  hasWeek5: boolean
  
  // Targeting
  targetAudience: string
  keyTopics: string
}

interface SavedTemplate {
  name: string
  config: EnhancedFormData
  savedAt: Date
}

export default function GeneratePage() {
  const router = useRouter()
  const { generatePhaseContent, isLoading } = usePostcardStore()
  
  // Enhanced form state with smart defaults
  const [formData, setFormData] = useState<EnhancedFormData>({
    phaseTitle: '',
    phaseDescription: '',
    platformPersonas: {
      linkedin: '',
      x: ''
    },
    duration: 30,
    postsPerDay: 1,
    templateStyle: 'mixed',
    generationInstructions: '',
    weeklyThemes: [
      'Introduction & Why',
      'Lessons & Insights', 
      'Building & Progress',
      'Results & Next Steps'
    ],
    weeklyDescriptions: ['', '', '', ''],
    hasWeek5: false,
    targetAudience: '',
    keyTopics: ''
  })
  
  // UI state
  const [expandedWeeks, setExpandedWeeks] = useState<boolean[]>([true, false, false, false, false])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [generatedCount, setGeneratedCount] = useState<number | null>(null)
  const [sessionId, setSessionId] = useState('')
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])

  // Load saved templates on mount
  useEffect(() => {
    const saved = localStorage.getItem('contentTemplates')
    if (saved) {
      try {
        setSavedTemplates(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved templates:', error)
      }
    }
  }, [])

  // Calculate totals
  const calculateTotalPosts = () => formData.duration * formData.postsPerDay
  const calculateWeeks = () => Math.ceil(formData.duration / 7)

  // Helper functions
  const updateWeeklyTheme = (index: number, value: string) => {
    const newThemes = [...formData.weeklyThemes]
    newThemes[index] = value
    
    // Ensure descriptions array matches
    const newDescriptions = [...formData.weeklyDescriptions]
    while (newDescriptions.length <= index) {
      newDescriptions.push('')
    }
    
    setFormData(prev => ({ 
      ...prev, 
      weeklyThemes: newThemes,
      weeklyDescriptions: newDescriptions
    }))
  }

  const updateWeeklyDescription = (index: number, value: string) => {
    const newDescriptions = [...formData.weeklyDescriptions]
    while (newDescriptions.length <= index) {
      newDescriptions.push('')
    }
    newDescriptions[index] = value
    setFormData(prev => ({ ...prev, weeklyDescriptions: newDescriptions }))
  }

  const toggleWeekExpansion = (index: number) => {
    const newExpanded = [...expandedWeeks]
    while (newExpanded.length <= index) {
      newExpanded.push(false)
    }
    newExpanded[index] = !newExpanded[index]
    setExpandedWeeks(newExpanded)
  }

  const addWeek5 = () => {
    if (!formData.hasWeek5) {
      setFormData(prev => ({
        ...prev,
        hasWeek5: true,
        weeklyThemes: [...prev.weeklyThemes, ''],
        weeklyDescriptions: [...prev.weeklyDescriptions, '']
      }))
      setExpandedWeeks(prev => [...prev, false])
    }
  }

  // Save configuration functionality
  const saveAsTemplate = () => {
    const templateName = prompt('Enter a name for this template:')
    if (!templateName) return

    const newTemplate: SavedTemplate = {
      name: templateName,
      config: formData,
      savedAt: new Date()
    }

    const updated = [...savedTemplates, newTemplate]
    setSavedTemplates(updated)
    localStorage.setItem('contentTemplates', JSON.stringify(updated))
    toast.success(`Template "${templateName}" saved!`)
  }

  // Form submission with rich context
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.phaseTitle.trim() || !formData.phaseDescription.trim()) {
      toast.error('Please fill in Phase Title and Description')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setProgressMessage('Initializing phase generation...')
    
    const newSessionId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    
    // Progress simulation function
    const simulateProgress = () => {
      const steps = [
        { progress: 5, message: 'Connecting to ContentOS...' },
        { progress: 10, message: 'Preparing your content request...' },
        { progress: 15, message: 'Validating phase details...' },
        { progress: 25, message: `AI is generating ${calculateTotalPosts()} posts...` },
        { progress: 45, message: 'AI working hard on your content...' },
        { progress: 65, message: 'Almost there, finalizing posts...' },
        { progress: 80, message: 'Saving posts to database...' },
        { progress: 90, message: 'Organizing your content...' }
      ]
      
      let stepIndex = 0
      const progressInterval = setInterval(() => {
        if (stepIndex < steps.length) {
          const step = steps[stepIndex]
          setGenerationProgress(step.progress)
          setProgressMessage(step.message)
          stepIndex++
        }
      }, 2000) // Update every 2 seconds
      
      return progressInterval
    }
    
    // Start progress simulation and create abort controller for proper cleanup
    let progressInterval: NodeJS.Timeout | undefined
    const abortController = new AbortController()
    
    try {
      progressInterval = simulateProgress()
      
      // Create enriched description with all context
      const weeklyDetails = formData.weeklyThemes.map((theme, i) => {
        const description = formData.weeklyDescriptions[i] || ''
        return description 
          ? `Week ${i + 1}: ${theme}\n  ${description}`
          : `Week ${i + 1}: ${theme}`
      }).join('\n\n')

      let enrichedDescription = `
        ${formData.phaseDescription}
        
        Platform Personas:
        LinkedIn Voice (Swedish): ${formData.platformPersonas.linkedin || 'Professional tone'}
        X Voice (English): ${formData.platformPersonas.x || 'Personal journey tone'}
        
        Weekly Breakdown:
        ${weeklyDetails}
        
        Target Audience: ${formData.targetAudience}
        Key Topics: ${formData.keyTopics}
      `.trim()

      // Add generation instructions if provided
      if (formData.generationInstructions.trim()) {
        enrichedDescription += `\n\nSpecial Generation Instructions:\n${formData.generationInstructions}`
      }

      await generatePhaseContent({
        phaseTitle: formData.phaseTitle,
        phaseDescription: enrichedDescription,
        postsPerDay: formData.postsPerDay,
        duration: formData.duration,
        template: formData.templateStyle
      })
      
      // Clear progress simulation on success
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setGenerationProgress(100)
      setProgressMessage('Success! All posts generated and saved.')
      
      setGeneratedCount(calculateTotalPosts())
      toast.success(`Generated ${calculateTotalPosts()} postcards for ${formData.phaseTitle}`)
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (error) {
      // IMMEDIATELY abort all operations and clear progress
      abortController.abort()
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = undefined
      }
      setGenerationProgress(0)
      setProgressMessage('❌ Generation failed - checking what went wrong...')
      
      // Capture detailed error information
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content'
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('HTTP')
      const isAPIKeyError = errorMessage.includes('API key') || errorMessage.includes('unauthorized') || errorMessage.includes('401')
      const isDatabaseError = errorMessage.includes('database') || errorMessage.includes('Supabase') || errorMessage.includes('insert')
      const isTimeoutError = errorMessage.includes('timeout') || errorMessage.includes('took too long')
      
      // Determine user-friendly error message and progress message
      let friendlyError = 'Generation failed'
      let errorDetails = errorMessage
      let progressError = 'Generation stopped unexpectedly'
      
      if (isAPIKeyError) {
        friendlyError = 'AI Service Not Available'
        errorDetails = 'The AI service is not properly configured. Please check that your API key is set up correctly.'
        progressError = '❌ AI service connection failed'
      } else if (isDatabaseError) {
        friendlyError = 'Database Connection Failed'
        errorDetails = 'Unable to save generated content to the database. Please try again in a moment.'
        progressError = '❌ Database save failed'
      } else if (isTimeoutError) {
        friendlyError = 'Request Timed Out'
        errorDetails = 'The generation took too long to complete. Try generating fewer posts at once.'
        progressError = '❌ Generation timed out'
      } else if (isNetworkError) {
        friendlyError = 'Network Connection Error'
        errorDetails = 'Unable to connect to ContentOS servers. Please check your internet connection.'
        progressError = '❌ Connection failed'
      } else {
        progressError = `❌ Error: ${errorMessage.substring(0, 50)}...`
      }
      
      setProgressMessage(progressError)
      
      // Safe error logging with error boundary
      try {
        console.error('[Generate Page] Full error details:', {
          originalError: error,
          errorMessage,
          errorType: error?.constructor?.name,
          stack: error instanceof Error ? error.stack : undefined,
          sessionId: newSessionId,
          formData: {
            phaseTitle: formData?.phaseTitle || 'unknown',
            postsCount: calculateTotalPosts(),
            duration: formData?.duration || 0,
            postsPerDay: formData?.postsPerDay || 0
          }
        })
      } catch (logError) {
        // Prevent logging errors from crashing the app
        console.error('[Generate Page] Critical: Logging failed:', logError)
        console.error('[Generate Page] Original error was:', error)
      }
      
      // Show user-friendly error with option to see details
      toast.error(friendlyError, {
        description: (
          <div className="space-y-2">
            <p>{errorDetails}</p>
            <details className="text-xs">
              <summary className="cursor-pointer text-zinc-400 hover:text-white">
                Show technical details
              </summary>
              <code className="block mt-2 p-2 bg-zinc-800 rounded text-xs break-all">
                {`Session: ${newSessionId}
Error: ${errorMessage}
Posts to generate: ${calculateTotalPosts()}`}
              </code>
            </details>
          </div>
        ),
        icon: <AlertCircle className="h-5 w-5" />,
        duration: 10000, // Show longer for complex errors
      })
    } finally {
      // Always clean up progress simulation and abort any ongoing operations
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = undefined
      }
      if (!abortController.signal.aborted) {
        abortController.abort()
      }
      setIsGenerating(false)
    }
  }

  return (
    <AppLayout>
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mb-4 text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Sparkles className="h-6 w-6 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Generate Content Phase
              </h1>
            </div>
            <p className="text-zinc-400">
              Create comprehensive content campaigns with AI-powered dual-platform generation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pb-24">
            {/* Phase Overview Section */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  Phase Overview
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Define your content phase basics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phaseTitle" className="text-white">
                    Phase Title *
                  </Label>
                  <Input
                    id="phaseTitle"
                    value={formData.phaseTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, phaseTitle: e.target.value }))}
                    placeholder="e.g., Building in Public Journey"
                    className="bg-zinc-900 border-zinc-800 text-white mt-2"
                    disabled={isGenerating}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phaseDescription" className="text-white">
                    Phase Description *
                  </Label>
                  <Textarea
                    id="phaseDescription"
                    value={formData.phaseDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, phaseDescription: e.target.value }))}
                    placeholder="Describe your content strategy for this phase. What story do you want to tell? What are your goals?"
                    rows={3}
                    className="bg-zinc-900 border-zinc-800 text-white mt-2 focus:rows-4"
                    disabled={isGenerating}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Platform Personas + Duration Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
              {/* Platform Personas - 60% width */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="flex gap-1">
                      <Linkedin className="h-5 w-5 text-blue-500" />
                      <Twitter className="h-5 w-5 text-blue-400" />
                    </div>
                    Platform Personas
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Define your voice for each platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedinVoice" className="text-white flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-500" />
                        LinkedIn Voice (Swedish)
                      </Label>
                      <Textarea
                        id="linkedinVoice"
                        value={formData.platformPersonas.linkedin}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          platformPersonas: { ...prev.platformPersonas, linkedin: e.target.value }
                        }))}
                        placeholder="Professional AI consultant, ROI-focused, speaking to Swedish e-commerce owners"
                        rows={2}
                        className="bg-zinc-900 border-zinc-800 text-white mt-2 focus:rows-3"
                        disabled={isGenerating}
                      />
                    </div>

                    <div>
                      <Label htmlFor="xVoice" className="text-white flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-400" />
                        X Voice (English)
                      </Label>
                      <Textarea
                        id="xVoice"
                        value={formData.platformPersonas.x}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          platformPersonas: { ...prev.platformPersonas, x: e.target.value }
                        }))}
                        placeholder="Raw builder journey, honest about struggles, teaching while learning"
                        rows={2}
                        className="bg-zinc-900 border-zinc-800 text-white mt-2 focus:rows-3"
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Duration & Frequency - 40% width */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-500" />
                    Duration & Frequency
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Configure your publishing schedule
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Duration: {formData.duration} days
                    </Label>
                    <Slider
                      value={[formData.duration]}
                      onValueChange={([value]) => setFormData(prev => ({ ...prev, duration: value }))}
                      min={7}
                      max={90}
                      step={1}
                      className="py-4 mt-2"
                      disabled={isGenerating}
                    />
                    <div className="flex justify-between text-zinc-500 text-sm">
                      <span>1 week</span>
                      <span>1 month</span>
                      <span>3 months</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Posts per Day
                    </Label>
                    <Select
                      value={formData.postsPerDay.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, postsPerDay: parseInt(value) }))}
                      disabled={isGenerating}
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="1">1 post/day</SelectItem>
                        <SelectItem value="2">2 posts/day</SelectItem>
                        <SelectItem value="3">3 posts/day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Template & Instructions Section */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-500" />
                  Template & Instructions
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Choose your content style and provide AI guidance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Template Style</Label>
                  <Select
                    value={formData.templateStyle}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, templateStyle: value as 'story' | 'tool' | 'mixed' }))}
                    disabled={isGenerating}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="story">Story-focused</SelectItem>
                      <SelectItem value="tool">Tool-focused</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="generationInstructions" className="text-white">
                    Special Instructions for AI
                  </Label>
                  <Textarea
                    id="generationInstructions"
                    value={formData.generationInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, generationInstructions: e.target.value }))}
                    placeholder="e.g., Generate each day's content twice - Swedish for LinkedIn (professional, 500-1500 chars) and English for X (raw journey, max 280 chars)"
                    rows={2}
                    className="bg-zinc-900 border-zinc-800 text-white mt-2 focus:rows-5"
                    disabled={isGenerating}
                  />
                  <p className="text-zinc-500 text-sm mt-1">
                    Provide specific guidance for AI generation, including platform requirements, tone, or format preferences
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Themes Section */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-500" />
                  Weekly Themes ({formData.hasWeek5 ? 5 : 4} weeks)
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Define the progression of your content phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 2x2 Grid for Weeks 1-4 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  {formData.weeklyThemes.slice(0, 4).map((theme, i) => (
                    <Collapsible 
                      key={i} 
                      open={expandedWeeks[i] || false}
                      onOpenChange={() => toggleWeekExpansion(i)}
                      className="bg-zinc-900/30 rounded-lg border border-zinc-800"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between w-full p-3 hover:bg-zinc-800/50 transition-colors cursor-pointer rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className="border-zinc-600 text-zinc-300"
                            >
                              Week {i + 1}
                            </Badge>
                            <span className="text-white font-medium text-sm">
                              {theme || `Theme for week ${i + 1}`}
                            </span>
                          </div>
                          {expandedWeeks[i] ? (
                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-zinc-400" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-3">
                        <div className="space-y-2 pt-2 border-t border-zinc-700/50">
                          <div>
                            <Label htmlFor={`theme-${i}`} className="text-white text-sm">
                              Week Theme {i < 4 ? '*' : ''}
                            </Label>
                            <Input
                              id={`theme-${i}`}
                              value={theme}
                              onChange={(e) => updateWeeklyTheme(i, e.target.value)}
                              placeholder={`Theme for week ${i + 1}`}
                              className="bg-zinc-900 border-zinc-800 text-white mt-1 text-sm"
                              disabled={isGenerating}
                              required={i < 4}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`description-${i}`} className="text-white text-sm">
                              What this week covers
                            </Label>
                            <Textarea
                              id={`description-${i}`}
                              value={formData.weeklyDescriptions[i] || ''}
                              onChange={(e) => updateWeeklyDescription(i, e.target.value)}
                              placeholder="Key topics, progression, and focus areas for this week"
                              rows={2}
                              className="bg-zinc-900 border-zinc-800 text-white mt-1 text-sm focus:rows-3"
                              disabled={isGenerating}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>

                {/* Week 5 (if enabled) */}
                {formData.hasWeek5 && (
                  <div className="mb-4">
                    <Collapsible 
                      open={expandedWeeks[4] || false}
                      onOpenChange={() => toggleWeekExpansion(4)}
                      className="bg-zinc-900/30 rounded-lg border border-zinc-800"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between w-full p-3 hover:bg-zinc-800/50 transition-colors cursor-pointer rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className="border-zinc-600 text-zinc-300"
                            >
                              Week 5
                            </Badge>
                            <span className="text-white font-medium text-sm">
                              {formData.weeklyThemes[4] || 'Theme for week 5'}
                            </span>
                          </div>
                          {expandedWeeks[4] ? (
                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-zinc-400" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-3">
                        <div className="space-y-2 pt-2 border-t border-zinc-700/50">
                          <div>
                            <Label htmlFor="theme-4" className="text-white text-sm">
                              Week Theme
                            </Label>
                            <Input
                              id="theme-4"
                              value={formData.weeklyThemes[4] || ''}
                              onChange={(e) => updateWeeklyTheme(4, e.target.value)}
                              placeholder="Theme for week 5"
                              className="bg-zinc-900 border-zinc-800 text-white mt-1 text-sm"
                              disabled={isGenerating}
                            />
                          </div>
                          <div>
                            <Label htmlFor="description-4" className="text-white text-sm">
                              What this week covers
                            </Label>
                            <Textarea
                              id="description-4"
                              value={formData.weeklyDescriptions[4] || ''}
                              onChange={(e) => updateWeeklyDescription(4, e.target.value)}
                              placeholder="Key topics, progression, and focus areas for this week"
                              rows={2}
                              className="bg-zinc-900 border-zinc-800 text-white mt-1 text-sm focus:rows-3"
                              disabled={isGenerating}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}

                {/* Add Week 5 Button */}
                {!formData.hasWeek5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addWeek5}
                    className="w-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    disabled={isGenerating}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Week 5
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Targeting Section */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-500" />
                  Targeting & Topics
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Define your audience and key content themes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetAudience" className="text-white">
                      Target Audience (Detailed)
                    </Label>
                    <Textarea
                      id="targetAudience"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                      placeholder="Describe your audience for each platform. Who are they? What do they care about?"
                      rows={2}
                      className="bg-zinc-900 border-zinc-800 text-white mt-2 focus:rows-3"
                      disabled={isGenerating}
                    />
                  </div>

                  <div>
                    <Label htmlFor="keyTopics" className="text-white">
                      Content Topics & Themes
                    </Label>
                    <Textarea
                      id="keyTopics"
                      value={formData.keyTopics}
                      onChange={(e) => setFormData(prev => ({ ...prev, keyTopics: e.target.value }))}
                      placeholder="Main topics, technologies, concepts to cover throughout the phase"
                      rows={2}
                      className="bg-zinc-900 border-zinc-800 text-white mt-2 focus:rows-3"
                      disabled={isGenerating}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </form>

          {/* Progress Indicator */}
          {isGenerating && (
            <Card className="mt-8 bg-zinc-900/50 border-zinc-800">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">
                      Generating content with AI...
                    </span>
                    <span className="font-medium text-white">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-zinc-400">
                      {progressMessage || 'Preparing content phase...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {generatedCount !== null && (
            <Card className="mt-8 border-green-800 bg-green-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-200">
                      Success! Generated {generatedCount} postcards
                    </h3>
                    <p className="text-sm text-green-300">
                      Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 shadow-2xl z-50">
            <div className="max-w-6xl mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                {/* Generation Preview - Horizontal Layout */}
                <div className="flex items-center gap-6 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    <span>Generate <span className="font-bold text-emerald-400">{calculateTotalPosts()} postcards</span> over <span className="font-bold text-emerald-400">{formData.duration} days</span></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-3 w-3 text-blue-500" />
                      <span className="text-zinc-300">LinkedIn</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Twitter className="h-3 w-3 text-blue-400" />
                      <span className="text-zinc-300">X</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    disabled={isGenerating}
                    className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={saveAsTemplate}
                    disabled={isGenerating}
                    className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Save className="h-3 w-3 mr-2" />
                    Save
                  </Button>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={isGenerating || isLoading || !formData.phaseTitle.trim() || !formData.phaseDescription.trim()}
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[140px]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        {generationProgress}%
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-2" />
                        Generate {calculateTotalPosts()}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}