'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Globe, Twitter } from 'lucide-react'
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
  onCopyEnglish?: () => void
  onCopySwedish?: () => void
  template?: 'story' | 'tool'
  isAutoSaving?: boolean
  lastSaved?: Date | null
}

export function PostcardEditor({
  initialEnglish = '',
  initialSwedish = '',
  onEnglishChange,
  onSwedishChange,
  characterLimits,
  onCopyEnglish,
  onCopySwedish,
  template = 'story',
  isAutoSaving = false,
  lastSaved
}: PostcardEditorProps) {
  const [englishContent, setEnglishContent] = React.useState(initialEnglish)
  const [swedishContent, setSwedishContent] = React.useState(initialSwedish)

  const handleEnglishChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    if (newContent.length <= characterLimits.english) {
      setEnglishContent(newContent)
      onEnglishChange(newContent)
    }
  }

  const handleSwedishChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    if (newContent.length <= characterLimits.swedish) {
      setSwedishContent(newContent)
      onSwedishChange(newContent)
    }
  }

  const englishCharCount = englishContent.length
  const swedishCharCount = swedishContent.length
  const englishPercentage = (englishCharCount / characterLimits.english) * 100
  const swedishPercentage = (swedishCharCount / characterLimits.swedish) * 100

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* English/Twitter Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-blue-500" />
              X/Twitter Content
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={template === 'story' ? 'default' : 'secondary'}>
                {template}
              </Badge>
              {onCopyEnglish && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCopyEnglish}
                  className="h-8"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="english-content">
              Content (English)
            </Label>
            <Textarea
              id="english-content"
              value={englishContent}
              onChange={handleEnglishChange}
              placeholder="Write your Twitter/X post here..."
              className="min-h-[150px] mt-2"
              maxLength={characterLimits.english}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Character count</span>
              <span className={cn(
                "font-medium",
                englishPercentage > 90 ? "text-red-500" : 
                englishPercentage > 80 ? "text-orange-500" : "text-gray-700"
              )}>
                {englishCharCount} / {characterLimits.english}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  englishPercentage > 90 ? "bg-red-500" : 
                  englishPercentage > 80 ? "bg-orange-500" : "bg-blue-500"
                )}
                style={{ width: `${Math.min(englishPercentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swedish/LinkedIn Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-700" />
              LinkedIn Content
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Swedish</Badge>
              {onCopySwedish && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCopySwedish}
                  className="h-8"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="swedish-content">
              Content (Swedish)
            </Label>
            <Textarea
              id="swedish-content"
              value={swedishContent}
              onChange={handleSwedishChange}
              placeholder="Skriv ditt LinkedIn-inlägg här..."
              className="min-h-[150px] mt-2"
              maxLength={characterLimits.swedish}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Character count</span>
              <span className={cn(
                "font-medium",
                swedishPercentage > 90 ? "text-red-500" : 
                swedishPercentage > 80 ? "text-orange-500" : "text-gray-700"
              )}>
                {swedishCharCount} / {characterLimits.swedish}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  swedishPercentage > 90 ? "bg-red-500" : 
                  swedishPercentage > 80 ? "bg-orange-500" : "bg-blue-700"
                )}
                style={{ width: `${Math.min(swedishPercentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-save indicator */}
      {(isAutoSaving || lastSaved) && (
        <div className="md:col-span-2 text-center text-sm text-gray-500">
          {isAutoSaving ? (
            <span>Saving...</span>
          ) : lastSaved ? (
            <span>Last saved at {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>
      )}
    </div>
  )
}