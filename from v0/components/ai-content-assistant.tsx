"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Wand2, Hash, TrendingUp, Target, Lightbulb, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react"

interface AISuggestion {
  id: string
  type: "improvement" | "hashtag" | "timing" | "engagement"
  title: string
  suggestion: string
  confidence: number
  impact: "low" | "medium" | "high"
}

interface AIContentAssistantProps {
  content: string
  platform: "x" | "linkedin"
  onApplySuggestion: (suggestion: string) => void
}

export function AIContentAssistant({ content, platform, onApplySuggestion }: AIContentAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [selectedTone, setSelectedTone] = useState<string>("professional")
  const [selectedAudience, setSelectedAudience] = useState<string>("general")

  // Mock AI suggestions based on content analysis
  const generateSuggestions = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockSuggestions: AISuggestion[] = [
      {
        id: "1",
        type: "improvement",
        title: "Enhance Opening Hook",
        suggestion: "Start with a compelling question or statistic to grab attention immediately.",
        confidence: 92,
        impact: "high",
      },
      {
        id: "2",
        type: "hashtag",
        title: "Trending Hashtags",
        suggestion:
          platform === "x"
            ? "#ContentCreation #DigitalMarketing #AI"
            : "#ContentStrategy #LinkedInTips #ProfessionalGrowth",
        confidence: 87,
        impact: "medium",
      },
      {
        id: "3",
        type: "engagement",
        title: "Call-to-Action",
        suggestion: "Add a clear call-to-action asking readers to share their thoughts or experiences.",
        confidence: 89,
        impact: "high",
      },
      {
        id: "4",
        type: "timing",
        title: "Optimal Posting Time",
        suggestion:
          platform === "x"
            ? "Best time: 9:00 AM or 3:00 PM on weekdays"
            : "Best time: 8:00 AM or 12:00 PM on Tuesday-Thursday",
        confidence: 85,
        impact: "medium",
      },
    ]

    setSuggestions(mockSuggestions)
    setIsAnalyzing(false)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "improvement":
        return <Lightbulb className="h-4 w-4" />
      case "hashtag":
        return <Hash className="h-4 w-4" />
      case "timing":
        return <Target className="h-4 w-4" />
      case "engagement":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  return (
    <Card className="glass-effect hover-lift transition-premium">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          AI Content Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={generateSuggestions}
                disabled={isAnalyzing || !content}
                className="flex items-center gap-2"
              >
                {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isAnalyzing ? "Analyzing..." : "Analyze Content"}
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 rounded-lg border glass-effect hover-lift transition-premium">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(suggestion.type)}
                        <span className="font-medium text-sm">{suggestion.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(suggestion.impact)}>{suggestion.impact} impact</Badge>
                        <span className="text-xs text-muted-foreground">{suggestion.confidence}% confidence</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{suggestion.suggestion}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onApplySuggestion(suggestion.suggestion)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Apply
                      </Button>
                      <Button size="sm" variant="ghost" className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="optimize" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tone</label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Target Audience</label>
                <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Audience</SelectItem>
                    <SelectItem value="professionals">Business Professionals</SelectItem>
                    <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                    <SelectItem value="developers">Developers</SelectItem>
                    <SelectItem value="marketers">Marketers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Optimize for {selectedAudience} ({selectedTone} tone)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-3">
              <Textarea placeholder="Describe what you want to write about..." rows={3} className="resize-none" />
              <div className="grid gap-2">
                <Button className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate {platform === "x" ? "Tweet" : "LinkedIn Post"}
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Hash className="h-4 w-4" />
                  Generate Hashtags
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
