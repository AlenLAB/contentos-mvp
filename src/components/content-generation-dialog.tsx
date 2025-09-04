"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface ContentGenerationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContentGenerationDialog({ open, onOpenChange }: ContentGenerationDialogProps) {
  const router = useRouter()
  
  const handleGenerateClick = () => {
    onOpenChange(false)
    router.push('/generate')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Generate Content Phase</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-zinc-400">
            Create multiple posts for your content calendar using AI-powered generation.
          </p>
          <Button 
            onClick={handleGenerateClick}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Go to Generate Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}