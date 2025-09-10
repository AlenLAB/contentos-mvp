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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { semanticTypography } from '@/lib/typography'
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Sparkles,
  Target,
  Layers,
  Clock,
  Hash,
  ChevronDown,
  ChevronRight,
  Settings
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
  const [expandedWeeks, setExpandedWeeks] = useState<boolean[]>([true, false, false, false])
  
  const generatePhaseContent = usePostcardStore((state) => state.generatePhaseContent)
  
  const [formData, setFormData] = useState({
    phaseName: 'Introduction Phase',
    phaseDescription: '',
    duration: 30,
    postsPerDay: 1,
    templateStyle: 'mixed',
    targetAudience: '',
    keyTopics: '',
    generationInstructions: '',
    weeklyThemes: [
      'Personal Story & Background',
      'Expertise & Skills',
      'Vision & Goals',
      'Call to Action & Engagement'
    ],
    weeklyDescriptions: [
      '',
      '',
      '',
      ''
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
      // Create enriched phase description with weekly themes and context
      const weeklyDetails = formData.weeklyThemes.map((theme, i) => {
        const description = formData.weeklyDescriptions[i] || ''
        return description 
          ? `Week ${i + 1}: ${theme}\n  ${description}`
          : `Week ${i + 1}: ${theme}`
      }).join('\n\n')

      let enrichedDescription = `
        ${formData.phaseDescription}
        
        Weekly Breakdown:
        ${weeklyDetails}
        
        Target Audience: ${formData.targetAudience}
        Key Topics: ${formData.keyTopics}
      `.trim()

      // Add generation instructions if provided
      if (formData.generationInstructions.trim()) {
        enrichedDescription += `\n\nSpecial Generation Instructions:\n${formData.generationInstructions}`
      }
      
      // Map template style to the expected format
      let template: 'story' | 'tool' | 'mixed'
      if (formData.templateStyle === 'story-focused') {
        template = 'story'
      } else if (formData.templateStyle === 'tool-focused') {
        template = 'tool'  
      } else {
        template = 'mixed'
      }
      
      // Generate posts using the store with new PhaseData format
      await generatePhaseContent({
        phaseTitle: formData.phaseName,
        phaseDescription: enrichedDescription,
        postsPerDay: formData.postsPerDay,
        duration: formData.duration,
        template: template
      })
      
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
    
    // Ensure weeklyDescriptions array matches the length
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
    
    // Ensure array is long enough
    while (newDescriptions.length <= index) {
      newDescriptions.push('')
    }
    
    newDescriptions[index] = value
    setFormData(prev => ({ ...prev, weeklyDescriptions: newDescriptions }))
  }

  const toggleWeekExpansion = (index: number) => {
    const newExpanded = [...expandedWeeks]
    
    // Ensure array is long enough
    while (newExpanded.length <= index) {
      newExpanded.push(false)
    }
    
    newExpanded[index] = !newExpanded[index]
    setExpandedWeeks(newExpanded)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className={cn("flex items-center space-premium-xs", semanticTypography.sectionTitle)}>
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Generate Phase Content
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a comprehensive content campaign with AI assistance
          </DialogDescription>
        </DialogHeader>

        {state === 'loading' && (
          <div className="flex flex-col items-center justify-center padding-premium-3xl space-y-premium-md">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
              <div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse" />
            </div>
            <p className={cn("text-zinc-400", semanticTypography.description)}>
              Generating {calculateTotalPosts()} postcards...
            </p>
            <p className={cn("text-zinc-500", semanticTypography.hint)}>
              This may take a minute
            </p>
          </div>
        )}

        {state === 'success' && (
          <div className="flex flex-col items-center justify-center padding-premium-3xl space-y-premium-md">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
            <p className={cn("text-white", semanticTypography.success)}>Successfully generated!</p>
            <p className={cn("text-zinc-400", semanticTypography.description)}>
              {calculateTotalPosts()} postcards created
            </p>
          </div>
        )}

        {state === 'setup' && (
          <form onSubmit={handleSubmit} className="space-y-premium-lg">
            {/* Phase Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 space-premium-md">
              <div className="space-y-premium-xs">
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

              <div className="space-y-premium-xs">
                <Label htmlFor="duration" className="text-white flex items-center space-premium-xs">
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
                <div className={cn("flex justify-between text-zinc-500", semanticTypography.hint)}>
                  <span>1 week</span>
                  <span>1 month</span>
                  <span>3 months</span>
                </div>
              </div>
            </div>

            {/* Phase Description */}
            <div className="space-y-premium-xs">
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
            <div className="grid grid-cols-1 md:grid-cols-2 space-premium-md">
              <div className="space-y-premium-xs">
                <Label className="text-white flex items-center space-premium-xs">
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

              <div className="space-y-premium-xs">
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

            {/* Section Divider */}
            <div className="border-t border-zinc-800 my-6"></div>

            {/* Generation Instructions */}
            <div className="space-y-premium-xs">
              <Label htmlFor="generationInstructions" className="text-white flex items-center space-premium-xs">
                <Settings className="h-4 w-4" />
                Special Instructions for AI
              </Label>
              <Textarea
                id="generationInstructions"
                value={formData.generationInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, generationInstructions: e.target.value }))}
                placeholder="e.g., Generate each day's content twice - Swedish for LinkedIn (professional, 500-1500 chars) and English for X (raw journey, max 280 chars)"
                rows={5}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
              <p className={cn("text-zinc-500", semanticTypography.hint)}>
                Provide specific guidance for AI generation, including platform requirements, tone, or format preferences
              </p>
            </div>

            {/* Section Divider */}
            <div className="border-t border-zinc-800 my-6"></div>

            {/* Weekly Themes */}
            <div className="space-y-3">
              <Label className="text-white flex items-center space-premium-xs">
                <Clock className="h-4 w-4" />
                Weekly Themes ({calculateWeeks()} weeks)
              </Label>
              <div className="space-y-premium-xs">
                {Array.from({ length: calculateWeeks() }, (_, i) => (
                  <Collapsible 
                    key={i} 
                    open={expandedWeeks[i] || false}
                    onOpenChange={() => toggleWeekExpansion(i)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between w-full p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900/70 transition-colors cursor-pointer">
                        <div className="flex items-center space-premium-xs">
                          <Badge 
                            variant="outline" 
                            className="border-zinc-700 text-zinc-400"
                          >
                            Week {i + 1}
                          </Badge>
                          <span className="text-white font-medium">
                            {formData.weeklyThemes[i] || `Theme for week ${i + 1}`}
                          </span>
                        </div>
                        {expandedWeeks[i] ? (
                          <ChevronDown className="h-4 w-4 text-zinc-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-zinc-400" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-3 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                        <div className="space-y-premium-xs">
                          <Label htmlFor={`theme-${i}`} className="text-white">
                            Week Theme
                          </Label>
                          <Input
                            id={`theme-${i}`}
                            value={formData.weeklyThemes[i] || ''}
                            onChange={(e) => updateWeeklyTheme(i, e.target.value)}
                            placeholder={`Theme for week ${i + 1}`}
                            className="bg-zinc-900 border-zinc-800 text-white"
                          />
                        </div>
                        <div className="space-y-premium-xs">
                          <Label htmlFor={`description-${i}`} className="text-white">
                            What this week covers
                          </Label>
                          <Textarea
                            id={`description-${i}`}
                            value={formData.weeklyDescriptions[i] || ''}
                            onChange={(e) => updateWeeklyDescription(i, e.target.value)}
                            placeholder="Key topics, progression, and focus areas for this week"
                            rows={3}
                            className="bg-zinc-900 border-zinc-800 text-white"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>

            {/* Section Divider */}
            <div className="border-t border-zinc-800 my-6"></div>

            {/* Target Audience & Topics */}
            <div className="space-y-premium-lg">
              <div className="space-y-premium-xs">
                <Label htmlFor="targetAudience" className="text-white flex items-center space-premium-xs">
                  <Target className="h-4 w-4" />
                  Target Audience (Detailed)
                </Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="Describe your audience for each platform. Who are they? What do they care about?"
                  rows={3}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-premium-xs">
                <Label htmlFor="keyTopics" className="text-white flex items-center space-premium-xs">
                  <Hash className="h-4 w-4" />
                  Content Topics & Themes
                </Label>
                <Textarea
                  id="keyTopics"
                  value={formData.keyTopics}
                  onChange={(e) => setFormData(prev => ({ ...prev, keyTopics: e.target.value }))}
                  placeholder="Main topics, technologies, concepts to cover throughout the phase"
                  rows={3}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
            </div>

            {/* Section Divider */}
            <div className="border-t border-zinc-800 my-6"></div>

            {/* Summary */}
            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-zinc-400", semanticTypography.description)}>Total postcards to generate:</p>
                  <p className={cn("text-emerald-500", "text-heading-2")}>{calculateTotalPosts()}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-zinc-400", semanticTypography.description)}>Campaign duration:</p>
                  <p className={cn("text-white", "text-body-large")}>{formData.duration} days</p>
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