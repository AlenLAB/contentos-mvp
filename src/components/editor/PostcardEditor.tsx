'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Copy, 
  Save, 
  Twitter, 
  Linkedin,
  AlertCircle,
  CheckCircle,
  Globe,
  Hash,
  Type,
  Languages
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostcardEditorProps {
  initialEnglish?: string
  initialSwedish?: string
  onEnglishChange: (content: string) => void
  onSwedishChange: (content: string) => void
  characterLimits: {
    english: number
    swedish: number
  }
  isSaving?: boolean
  lastSaved?: Date | null
  template?: 'story' | 'tool'
  onTemplateChange?: (template: 'story' | 'tool') => void
  onCopyEnglish?: () => void
  onCopySwedish?: () => void
  saveStatus?: string
}

export function PostcardEditor({
  initialEnglish = '',
  initialSwedish = '',
  onEnglishChange,
  onSwedishChange,
  characterLimits,
  isSaving = false,
  lastSaved,
  template = 'story',
  onTemplateChange,
  onCopyEnglish,
  onCopySwedish,
  saveStatus
}: PostcardEditorProps) {
  const [englishContent, setEnglishContent] = useState(initialEnglish)
  const [swedishContent, setSwedishContent] = useState(initialSwedish)
  const [selectedTemplate, setSelectedTemplate] = useState(template)

  // Update local state when props change
  useEffect(() => {
    setEnglishContent(initialEnglish)
  }, [initialEnglish])

  useEffect(() => {
    setSwedishContent(initialSwedish)
  }, [initialSwedish])

  const handleEnglishChange = (value: string) => {
    // Enforce character limit
    if (value.length <= characterLimits.english) {
      setEnglishContent(value)
      onEnglishChange(value)
    }
  }

  const handleSwedishChange = (value: string) => {
    // Enforce character limit
    if (value.length <= characterLimits.swedish) {
      setSwedishContent(value)
      onSwedishChange(value)
    }
  }

  const handleTemplateChange = (newTemplate: 'story' | 'tool') => {
    setSelectedTemplate(newTemplate)
    if (onTemplateChange) {
      onTemplateChange(newTemplate)
    }
  }

  // Calculate character usage percentages
  const englishPercentage = (englishContent.length / characterLimits.english) * 100
  const swedishPercentage = (swedishContent.length / characterLimits.swedish) * 100

  // Get character count color
  const getCharacterCountColor = (percentage: number) => {
    if (percentage > 95) return 'text-red-500'
    if (percentage > 80) return 'text-orange-500'
    return 'text-gray-500'
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {/* English Content Editor */}
      <Card className="h-fit order-1 lg:order-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              English (X/Twitter)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Twitter className="h-3 w-3" />
                X
              </Badge>
              {onCopyEnglish && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onCopyEnglish}
                  className="gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4" />
                Content
              </label>
              <span className={cn(
                "text-sm",
                getCharacterCountColor(englishPercentage)
              )}>
                {englishContent.length} / {characterLimits.english}
              </span>
            </div>
            <Textarea
              value={englishContent}
              onChange={(e) => handleEnglishChange(e.target.value)}
              placeholder="Write your Twitter/X post here..."
              className="min-h-[150px] resize-none font-mono"
              maxLength={characterLimits.english}
            />
            <Progress value={englishPercentage} className="h-1" />
            {englishPercentage > 80 && (
              <p className="text-xs text-orange-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {characterLimits.english - englishContent.length} characters remaining
              </p>
            )}
          </div>

          {/* Template Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Template Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedTemplate === 'story' ? 'default' : 'outline'}
                onClick={() => handleTemplateChange('story')}
                className="justify-start"
              >
                📖 Story
              </Button>
              <Button
                variant={selectedTemplate === 'tool' ? 'default' : 'outline'}
                onClick={() => handleTemplateChange('tool')}
                className="justify-start"
              >
                🔧 Tool
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swedish Content Editor */}
      <Card className="h-fit order-2 lg:order-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Swedish (LinkedIn)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Linkedin className="h-3 w-3" />
                LinkedIn
              </Badge>
              {onCopySwedish && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onCopySwedish}
                  className="gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4" />
                Innehåll
              </label>
              <span className={cn(
                "text-sm",
                getCharacterCountColor(swedishPercentage)
              )}>
                {swedishContent.length} / {characterLimits.swedish}
              </span>
            </div>
            <Textarea
              value={swedishContent}
              onChange={(e) => handleSwedishChange(e.target.value)}
              placeholder="Skriv ditt LinkedIn-inlägg här..."
              className="min-h-[250px] resize-none"
              maxLength={characterLimits.swedish}
            />
            <Progress value={swedishPercentage} className="h-1" />
            {swedishPercentage > 80 && (
              <p className="text-xs text-orange-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {characterLimits.swedish - swedishContent.length} tecken kvar
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              💡 <strong>Tip:</strong> LinkedIn posts perform best between 500-1000 characters
            </p>
            {swedishContent.length > 0 && swedishContent.length < 500 && (
              <p className="text-xs text-orange-500">
                Consider expanding your content for better LinkedIn engagement
              </p>
            )}
            {swedishContent.length >= 500 && swedishContent.length <= 1000 && (
              <p className="text-xs text-green-500 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Optimal length for LinkedIn engagement
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Status */}
      {saveStatus && (
        <div className="lg:col-span-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 text-green-500" />
                {saveStatus}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}