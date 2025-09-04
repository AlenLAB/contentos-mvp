"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Save, CheckCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIContentAssistant } from "./ai-content-assistant"

type PostState = "Draft" | "Approved" | "Scheduled" | "Published"
type Template = "Story" | "Tool"

interface PostData {
  title: string
  state: PostState
  template: Template
  xContent: string
  linkedinContent: string
}

export function PostEditor() {
  const [postData, setPostData] = useState<PostData>({
    title: "",
    state: "Draft",
    template: "Story",
    xContent: "",
    linkedinContent: "",
  })
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [activeEditor, setActiveEditor] = useState<"x" | "linkedin">("x")

  useEffect(() => {
    if (postData.title || postData.xContent || postData.linkedinContent) {
      setSaveStatus("unsaved")
      const timer = setTimeout(() => {
        setSaveStatus("saving")
        setTimeout(() => setSaveStatus("saved"), 500)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [postData])

  const getCharacterCountColor = (count: number, limit: number, type: "x" | "linkedin") => {
    if (type === "x") {
      if (count < 224) return "text-green-600"
      if (count <= 266) return "text-yellow-600"
      return "text-red-600"
    } else {
      if (count < 2400) return "text-green-600"
      if (count <= 2850) return "text-yellow-600"
      return "text-red-600"
    }
  }

  const getStateBadgeVariant = (state: PostState) => {
    switch (state) {
      case "Draft":
        return "secondary"
      case "Approved":
        return "default"
      case "Scheduled":
        return "outline"
      case "Published":
        return "default"
      default:
        return "secondary"
    }
  }

  const copyToClipboard = async (content: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleAISuggestion = (suggestion: string) => {
    if (activeEditor === "x") {
      setPostData((prev) => ({ ...prev, xContent: prev.xContent + "\n\n" + suggestion }))
    } else {
      setPostData((prev) => ({ ...prev, linkedinContent: prev.linkedinContent + "\n\n" + suggestion }))
    }
  }

  return (
    <div className="space-y-6 bg-zinc-900 min-h-screen p-6">
      <Card className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Input
              placeholder="Post title"
              value={postData.title}
              onChange={(e) => setPostData((prev) => ({ ...prev, title: e.target.value }))}
              className="flex-1 text-lg font-medium bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
            />
            <div className="flex gap-2 items-center">
              <Badge
                variant={getStateBadgeVariant(postData.state)}
                className="bg-zinc-700 text-zinc-300 border-zinc-600"
              >
                {postData.state}
              </Badge>
              <Select
                value={postData.state}
                onValueChange={(value: PostState) => setPostData((prev) => ({ ...prev, state: value }))}
              >
                <SelectTrigger className="w-32 bg-zinc-700 border-zinc-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={postData.template}
                onValueChange={(value: Template) => setPostData((prev) => ({ ...prev, template: value }))}
              >
                <SelectTrigger className="w-24 bg-zinc-700 border-zinc-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Story">Story</SelectItem>
                  <SelectItem value="Tool">Tool</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                AI
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className={cn("grid gap-6", showAIAssistant ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
        <div className={cn("space-y-6", showAIAssistant ? "lg:col-span-2" : "")}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-all duration-300">
              <CardHeader className="pb-3">
                <h3 className="font-medium text-white">X/Twitter (English)</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="What's happening?"
                  value={postData.xContent}
                  onChange={(e) => setPostData((prev) => ({ ...prev, xContent: e.target.value }))}
                  onFocus={() => setActiveEditor("x")}
                  rows={4}
                  className="resize-none bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-emerald-500"
                />
                <div className="flex justify-between items-center">
                  <span
                    className={cn("text-sm font-medium", getCharacterCountColor(postData.xContent.length, 280, "x"))}
                  >
                    {postData.xContent.length}/280
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(postData.xContent, "X")}
                    className="gap-2 bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
                  >
                    <Copy className="h-4 w-4" />
                    Copy X
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-all duration-300">
              <CardHeader className="pb-3">
                <h3 className="font-medium text-white">LinkedIn (Svenska)</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="What's happening in Swedish? Share your thoughts and ideas..."
                  value={postData.linkedinContent}
                  onChange={(e) => setPostData((prev) => ({ ...prev, linkedinContent: e.target.value }))}
                  onFocus={() => setActiveEditor("linkedin")}
                  rows={8}
                  className="resize-none bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-emerald-500"
                />
                <div className="flex justify-between items-center">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getCharacterCountColor(postData.linkedinContent.length, 3000, "linkedin"),
                    )}
                  >
                    {postData.linkedinContent.length}/3000 characters
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(postData.linkedinContent, "LinkedIn")}
                    className="gap-2 bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
                  >
                    <Copy className="h-4 w-4" />
                    Copy LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showAIAssistant && (
          <div className="lg:col-span-1">
            <AIContentAssistant
              content={activeEditor === "x" ? postData.xContent : postData.linkedinContent}
              platform={activeEditor}
              onApplySuggestion={handleAISuggestion}
            />
          </div>
        )}
      </div>

      <Card className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="secondary" className="gap-2 bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600">
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              {saveStatus === "saving" && (
                <>
                  <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                  Saving...
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  Saved
                </>
              )}
              {saveStatus === "unsaved" && (
                <>
                  <div className="h-2 w-2 bg-zinc-400 rounded-full" />
                  Unsaved changes
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
