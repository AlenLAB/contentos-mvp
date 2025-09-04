"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Edit, Eye, ExternalLink, Twitter, Linkedin } from "lucide-react"
import { format } from "date-fns"

interface PostPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  post: {
    id: string
    title: string
    content: string
    state: "draft" | "scheduled" | "published"
    scheduledDate: Date | null
    platform: "twitter" | "linkedin" | "both"
    engagement?: {
      likes: number
      shares: number
      comments: number
    }
  } | null
}

export function PostPreviewModal({ isOpen, onClose, post }: PostPreviewModalProps) {
  if (!post) return null

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "linkedin":
        return <Linkedin className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  const getStateBadgeVariant = (state: string) => {
    switch (state) {
      case "published":
        return "default"
      case "scheduled":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <DialogHeader className="space-premium-sm">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold pr-8">{post.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={getStateBadgeVariant(post.state)} className="capitalize">
                {post.state}
              </Badge>
              {getPlatformIcon(post.platform)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-premium-lg">
          {/* Post Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {post.scheduledDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Scheduled for {format(post.scheduledDate, "MMM d, yyyy 'at' h:mm a")}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Platform: {post.platform === "both" ? "Twitter & LinkedIn" : post.platform}</span>
            </div>
          </div>

          <Separator />

          {/* Post Content Preview */}
          <div className="space-premium-md">
            <h4 className="font-medium text-foreground">Content Preview</h4>
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="space-premium-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">CO</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">ContentOS</p>
                    <p className="text-xs text-muted-foreground">@contentos</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                {post.state === "published" && post.engagement && (
                  <div className="flex items-center gap-4 pt-3 border-t text-xs text-muted-foreground">
                    <span>{post.engagement.likes} likes</span>
                    <span>{post.engagement.shares} shares</span>
                    <span>{post.engagement.comments} comments</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </Button>
            {post.state === "draft" && (
              <Button variant="outline" className="flex-1 bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            )}
            {post.state === "published" && (
              <Button variant="outline" className="flex-1 bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
