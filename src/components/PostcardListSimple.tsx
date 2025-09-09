'use client'

import { useState, useEffect } from 'react'
import { usePostcardStore } from '@/store/postcards'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  Edit, 
  Eye, 
  Trash2, 
  Calendar,
  Plus,
  Layers,
  Twitter,
  Linkedin
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function PostcardListSimple() {
  const router = useRouter()
  const { postcards, isLoading, fetchPostcards, deletePostcard } = usePostcardStore()
  const [selectedPostcard, setSelectedPostcard] = useState<any>(null)

  useEffect(() => {
    fetchPostcards()
  }, [fetchPostcards])

  const handleEdit = (postcard: any) => {
    router.push(`/editor/${postcard.id}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this postcard?')) {
      try {
        await deletePostcard(id)
        toast.success('Postcard deleted successfully')
      } catch (error) {
        toast.error('Failed to delete postcard')
      }
    }
  }

  const handleSchedule = (postcard: any) => {
    router.push('/calendar')
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'draft':
        return 'text-yellow-500 border-yellow-500/50'
      case 'approved':
        return 'text-blue-500 border-blue-500/50'
      case 'scheduled':
        return 'text-purple-500 border-purple-500/50'
      case 'published':
        return 'text-emerald-500 border-emerald-500/50'
      default:
        return 'text-zinc-400 border-zinc-700'
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen flex items-center justify-center">
        <div className="text-zinc-400">Loading postcards...</div>
      </div>
    )
  }

  if (postcards.length === 0) {
    return (
      <div className="p-4 sm:p-6 min-h-screen flex flex-col items-center justify-center space-y-4">
        <Layers className="h-12 w-12 text-zinc-600" />
        <p className="text-zinc-400">No postcards yet</p>
        <Button
          onClick={() => router.push('/generate')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Content
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Postcards</h1>
          <p className="text-zinc-500">Manage your content library</p>
        </div>
        <Button
          onClick={() => router.push('/generate')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Content
        </Button>
      </div>

      {/* Postcards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {postcards.map((postcard) => (
          <Card 
            key={postcard.id} 
            className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
            onClick={() => handleEdit(postcard)}
          >
            <div className="p-4 space-y-3">
              {/* Header with State Badge */}
              <div className="flex items-start justify-between">
                <Badge 
                  variant="outline" 
                  className={cn("capitalize", getStateColor(postcard.state))}
                >
                  {postcard.state}
                </Badge>
                <div className="flex items-center gap-1">
                  <Twitter className="h-3 w-3 text-zinc-500" />
                  <Linkedin className="h-3 w-3 text-zinc-500" />
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-2">
                <p className="text-sm text-white line-clamp-3">
                  {postcard.x_content || postcard.english_content}
                </p>
                {(postcard.linkedin_content || postcard.swedish_content) && (
                  <p className="text-xs text-zinc-500 italic line-clamp-2">
                    LinkedIn: {postcard.linkedin_content || postcard.swedish_content}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <div className="text-xs text-zinc-500">
                  {postcard.scheduled_date 
                    ? format(new Date(postcard.scheduled_date), 'MMM d, yyyy')
                    : format(new Date(postcard.created_at), 'MMM d, yyyy')
                  }
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(postcard)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSchedule(postcard)
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-zinc-800"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(postcard.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  )
}