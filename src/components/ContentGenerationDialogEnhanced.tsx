'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Sparkles,
  Target,
  Layers,
  Clock,
  Hash
} from 'lucide-react'
import { usePostcardStore } from '@/store/postcards'
import { toast } from 'sonner'

interface ContentGenerationDialogEnhancedProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DialogState = 'setup' | 'loading' | 'success' | 'error'
type PhaseType = 'days' | 'weeks' | 'months'

export function ContentGenerationDialogEnhanced({ 
  open, 
  onOpenChange 
}: ContentGenerationDialogEnhancedProps) {
  const [state, setState] = useState<DialogState>('setup')
  const [phaseType, setPhaseType] = useState<PhaseType>('days')
  const [errorMessage, setErrorMessage] = useState('')
  
  const generatePhaseContent = usePostcardStore((state) => state.generatePhaseContent)
  
  const [formData, setFormData] = useState({
    phaseName: 'Introduction Phase',
    phaseDescription: '',
    duration: 30,
    postsPerDay: 1,
    templateStyle: 'mixed',
    targetAudience: '',
    keyTopics: '',
    weeklyThemes: [
      'Personal Story & Background',
      'Expertise & Skills',
      'Vision & Goals',
      'Call to Action & Engagement'
    ]
  })

  const calculateTotalPosts = () => {
    return formData.duration * formData.postsPerDay
  }

  const calculateWeeks = () => {
    return Math.ceil(formData.duration / 7)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.phaseName || !formData.phaseDescription) {
      setErrorMessage('Please fill in all required fields')
      setState('error')
      return
    }

    setState('loading')
    
    try {
      // Generate content for the entire phase
      const phaseContent = `
        Phase: ${formData.phaseName}
        Duration: ${formData.duration} days
        Posts per day: ${formData.postsPerDay}
        Total posts: ${calculateTotalPosts()}
        
        Description: ${formData.phaseDescription}
        
        Weekly Themes:
        ${formData.weeklyThemes.map((theme, i) => `Week ${i + 1}: ${theme}`).join('\n')}
        
        Target Audience: ${formData.targetAudience}
        Key Topics: ${formData.keyTopics}
      `
      
      // Generate posts using the store
      await generatePhaseContent(
        phaseContent,
        calculateTotalPosts(),
        formData.templateStyle === 'story-focused' ? 'story' : 
        formData.templateStyle === 'tool-focused' ? 'tool' : null
      )
      
      setState('success')
      toast.success(`Generated ${calculateTotalPosts()} postcards for ${formData.phaseName}`)
      
      setTimeout(() => {
        onOpenChange(false)
        setState('setup')
      }, 2000)
    } catch (error) {
      setState('error')
      setErrorMessage('Failed to generate content. Please try again.')
      toast.error('Failed to generate content')
    }
  }

  const updateWeeklyTheme = (index: number, value: string) => {
    const newThemes = [...formData.weeklyThemes]
    newThemes[index] = value
    setFormData(prev => ({ ...prev, weeklyThemes: newThemes }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Generate Phase Content
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a comprehensive content campaign with AI assistance
          </DialogDescription>
        </DialogHeader>

        {state === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
              <div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse" />
            </div>
            <p className="text-sm text-zinc-400">
              Generating {calculateTotalPosts()} postcards...
            </p>
            <p className="text-xs text-zinc-500">
              This may take a minute
            </p>
          </div>
        )}

        {state === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
            <p className="text-lg font-medium text-white">Successfully generated!</p>
            <p className="text-sm text-zinc-400">
              {calculateTotalPosts()} postcards created
            </p>
          </div>
        )}

        {state === 'setup' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phase Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phaseName" className="text-white">
                  Phase Name *
                </Label>
                <Input
                  id="phaseName"
                  value={formData.phaseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, phaseName: e.target.value }))}
                  placeholder="e.g., Introduction Phase"
                  className="bg-zinc-900 border-zinc-800 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Duration: {formData.duration} days
                </Label>
                <Slider
                  id="duration"
                  value={[formData.duration]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, duration: value }))}
                  min={7}
                  max={90}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>1 week</span>
                  <span>1 month</span>
                  <span>3 months</span>
                </div>
              </div>
            </div>

            {/* Phase Description */}
            <div className="space-y-2">
              <Label htmlFor="phaseDescription" className="text-white">
                Phase Description *
              </Label>
              <Textarea
                id="phaseDescription"
                value={formData.phaseDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, phaseDescription: e.target.value }))}
                placeholder="Describe your content strategy for this phase. What story do you want to tell? What are your goals?"
                rows={4}
                className="bg-zinc-900 border-zinc-800 text-white"
                required
              />
            </div>

            {/* Posts Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Posts per Day
                </Label>
                <Select
                  value={formData.postsPerDay.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, postsPerDay: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="1">1 post/day</SelectItem>
                    <SelectItem value="2">2 posts/day</SelectItem>
                    <SelectItem value="3">3 posts/day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Template Style</Label>
                <Select
                  value={formData.templateStyle}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, templateStyle: value }))}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="story-focused">Story-focused</SelectItem>
                    <SelectItem value="tool-focused">Tool-focused</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Weekly Themes */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Weekly Themes ({calculateWeeks()} weeks)
              </Label>
              <div className="space-y-2">
                {Array.from({ length: calculateWeeks() }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="border-zinc-700 text-zinc-400 min-w-[80px]"
                    >
                      Week {i + 1}
                    </Badge>
                    <Input
                      value={formData.weeklyThemes[i] || ''}
                      onChange={(e) => updateWeeklyTheme(i, e.target.value)}
                      placeholder={`Theme for week ${i + 1}`}
                      className="bg-zinc-900 border-zinc-800 text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience & Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-white flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Target Audience
                </Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., AI-first founders, Digital nomads"
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyTopics" className="text-white flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Key Topics
                </Label>
                <Input
                  id="keyTopics"
                  value={formData.keyTopics}
                  onChange={(e) => setFormData(prev => ({ ...prev, keyTopics: e.target.value }))}
                  placeholder="AI, Personal Brand, Digital Strategy"
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Total postcards to generate:</p>
                  <p className="text-2xl font-bold text-emerald-500">{calculateTotalPosts()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Campaign duration:</p>
                  <p className="text-lg font-semibold text-white">{formData.duration} days</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={state === 'loading'}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate {calculateTotalPosts()} Posts
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {state === 'error' && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  )
}