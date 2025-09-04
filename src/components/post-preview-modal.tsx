"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface PostPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: {
    id: string
    english_content: string
    swedish_content?: string
    state: string
    template?: string | null
    scheduled_date?: Date | string | null
    created_at: Date | string
  }
}

export function PostPreviewModal({ open, onOpenChange, post }: PostPreviewModalProps) {
  if (!post) return null

  const getStateColor = (state: string) => {
    switch (state) {
      case "draft":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "scheduled":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "published":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      default:
        return "bg-zinc-700 text-zinc-300 border-zinc-600"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            Post Preview
            <Badge variant="outline" className={getStateColor(post.state)}>
              {post.state}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Twitter/X (English)</h3>
            <p className="text-white bg-zinc-800 rounded-lg p-4">
              {post.english_content}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {post.english_content.length}/280 characters
            </p>
          </div>
          
          {post.swedish_content && (
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-2">LinkedIn (Swedish)</h3>
              <p className="text-white bg-zinc-800 rounded-lg p-4 whitespace-pre-wrap">
                {post.swedish_content}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {post.swedish_content.length}/3000 characters
              </p>
            </div>
          )}
          
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Created: {format(new Date(post.created_at), 'MMM d, yyyy')}</span>
            {post.scheduled_date && (
              <span>Scheduled: {format(new Date(post.scheduled_date), 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}