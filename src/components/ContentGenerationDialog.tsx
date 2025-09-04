"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface ContentGenerationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DialogState = "default" | "loading" | "success" | "error"

export function ContentGenerationDialog({ open, onOpenChange }: ContentGenerationDialogProps) {
  const [state, setState] = useState<DialogState>("default")
  const [formData, setFormData] = useState({
    phaseName: "",
    phaseDescription: "",
    numberOfPosts: "",
    templateStyle: "",
    targetAudience: "",
    keyTopics: "",
  })
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.phaseName || !formData.numberOfPosts || !formData.templateStyle) {
      setErrorMessage("Please fill in all required fields")
      setState("error")
      return
    }

    setState("loading")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setState("success")

      // Auto-close after success
      setTimeout(() => {
        onOpenChange(false)
        setState("default")
        setFormData({
          phaseName: "",
          phaseDescription: "",
          numberOfPosts: "",
          templateStyle: "",
          targetAudience: "",
          keyTopics: "",
        })
      }, 2000)
    } catch (error) {
      setState("error")
      setErrorMessage("Failed to generate content. Please try again.")
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setState("default")
    setErrorMessage("")
  }

  const getPostsLabel = () => {
    const posts = formData.numberOfPosts
    return posts ? `${posts} postcards` : "postcards"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Phase Content</DialogTitle>
          <DialogDescription>Create a series of posts for your content phase</DialogDescription>
        </DialogHeader>

        {state === "loading" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating {getPostsLabel()}...</p>
          </div>
        )}

        {state === "success" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <p className="text-sm font-medium">Successfully generated!</p>
          </div>
        )}

        {(state === "default" || state === "error") && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {state === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="phaseName">Phase Name *</Label>
              <Input
                id="phaseName"
                value={formData.phaseName}
                onChange={(e) => setFormData((prev) => ({ ...prev, phaseName: e.target.value }))}
                placeholder="e.g., Product Launch Series"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phaseDescription">Phase Description</Label>
              <Textarea
                id="phaseDescription"
                value={formData.phaseDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, phaseDescription: e.target.value }))}
                placeholder="Describe the theme and goals..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPosts">Number of Posts *</Label>
              <Select
                value={formData.numberOfPosts}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, numberOfPosts: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="21">21 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Template Style *</Label>
              <RadioGroup
                value={formData.templateStyle}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, templateStyle: value }))}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="story-focused" id="story-focused" />
                  <Label htmlFor="story-focused" className="font-normal">
                    Story-focused (personal narratives)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tool-focused" id="tool-focused" />
                  <Label htmlFor="tool-focused" className="font-normal">
                    Tool-focused (tips and resources)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed" className="font-normal">
                    Mixed (combination)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="e.g., Founders, Creators, Developers"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyTopics">Key Topics</Label>
              <Input
                id="keyTopics"
                value={formData.keyTopics}
                onChange={(e) => setFormData((prev) => ({ ...prev, keyTopics: e.target.value }))}
                placeholder="Enter topics separated by commas"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={state === "loading"}>
                {state === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
