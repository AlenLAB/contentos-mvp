'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PostcardEditor } from '@/components/editor/PostcardEditor'
import { usePostcardStore, Postcard } from '@/store/postcards'
import { useAutoSave, useAutoSaveStatus } from '@/hooks/useAutoSave'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { AppLayout } from '@/components/AppLayout'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  Send,
  Loader2,
  AlertCircle,
  Clock,
  FileText,
  Trash2
} from 'lucide-react'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const isNew = id === 'new'

  const { 
    postcards,
    getPostcardById,
    createPostcard,
    updatePostcard,
    deletePostcard,
    changeState,
    isLoading,
    error,
    fetchPostcards
  } = usePostcardStore()

  const { copyToClipboard } = useCopyToClipboard()
  
  // Local state for the postcard
  const [postcard, setPostcard] = useState<Partial<Postcard>>({
    english_content: '',
    swedish_content: '',
    template: 'story',
    state: 'draft'
  })
  const [isInitialized, setIsInitialized] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Auto-save configuration
  const savePostcard = useCallback(async (data: Partial<Postcard>) => {
    try {
      if (isNew && !postcard.id) {
        // Create new postcard
        await createPostcard({
          ...data,
          state: 'draft'
        })
        // After creation, we should get the ID from the store
        // For now, we'll keep it in draft mode
        toast.success('Postcard created!', { duration: 1500 })
      } else if (postcard.id) {
        // Update existing postcard
        await updatePostcard(postcard.id, data)
      }
    } catch (error) {
      console.error('Failed to save postcard:', error)
      throw error
    }
  }, [isNew, postcard.id, createPostcard, updatePostcard])

  // Use auto-save hook
  const {
    isSaving,
    lastSaved,
    error: saveError,
    saveNow
  } = useAutoSave({
    data: postcard,
    onSave: savePostcard,
    delay: 2000,
    enabled: isInitialized && !notFound,
    localStorageKey: `postcard-draft-${id}`
  })

  const saveStatus = useAutoSaveStatus(lastSaved, isSaving)

  // Load existing postcard or initialize new one
  useEffect(() => {
    const loadPostcard = async () => {
      if (isNew) {
        setIsInitialized(true)
        return
      }

      // Fetch postcards if not already loaded
      if (postcards.length === 0) {
        await fetchPostcards()
      }

      const existingPostcard = getPostcardById(id)
      
      if (existingPostcard) {
        setPostcard(existingPostcard)
        setIsInitialized(true)
      } else {
        setNotFound(true)
      }
    }

    loadPostcard()
  }, [id, isNew, postcards.length, getPostcardById, fetchPostcards])

  // Handle content changes
  const handleEnglishChange = useCallback((content: string) => {
    setPostcard(prev => ({ ...prev, english_content: content }))
  }, [])

  const handleSwedishChange = useCallback((content: string) => {
    setPostcard(prev => ({ ...prev, swedish_content: content }))
  }, [])

  const handleTemplateChange = useCallback((template: 'story' | 'tool') => {
    setPostcard(prev => ({ ...prev, template }))
  }, [])

  // Copy handlers
  const handleCopyEnglish = useCallback(async () => {
    if (postcard.english_content) {
      await copyToClipboard(postcard.english_content, 'X')
    }
  }, [postcard.english_content, copyToClipboard])

  const handleCopySwedish = useCallback(async () => {
    if (postcard.swedish_content) {
      await copyToClipboard(postcard.swedish_content, 'LinkedIn')
    }
  }, [postcard.swedish_content, copyToClipboard])

  // State transition handlers
  const handleApprove = async () => {
    if (!postcard.id) {
      toast.error('Please save the postcard first')
      return
    }
    
    try {
      await changeState(postcard.id, 'approved')
      setPostcard(prev => ({ ...prev, state: 'approved' }))
      toast.success('Postcard approved!', {
        description: 'Ready for scheduling',
        icon: <CheckCircle className="h-4 w-4" />
      })
    } catch (error) {
      toast.error('Failed to approve postcard')
    }
  }

  const handleSchedule = async () => {
    if (!postcard.id) {
      toast.error('Please save the postcard first')
      return
    }
    
    try {
      await changeState(postcard.id, 'scheduled')
      setPostcard(prev => ({ ...prev, state: 'scheduled' }))
      toast.success('Postcard scheduled!', {
        description: 'Will be published at the scheduled time',
        icon: <Calendar className="h-4 w-4" />
      })
      
      // Navigate to calendar to set date
      setTimeout(() => {
        router.push('/calendar')
      }, 1500)
    } catch (error) {
      toast.error('Failed to schedule postcard')
    }
  }

  const handlePublish = async () => {
    if (!postcard.id) {
      toast.error('Please save the postcard first')
      return
    }
    
    try {
      await changeState(postcard.id, 'published')
      setPostcard(prev => ({ ...prev, state: 'published', published_date: new Date() }))
      toast.success('Postcard published!', {
        description: 'Now live on social media',
        icon: <Send className="h-4 w-4" />
      })
    } catch (error) {
      toast.error('Failed to publish postcard')
    }
  }

  const handleDelete = async () => {
    if (!postcard.id) return
    
    if (!confirm('Are you sure you want to delete this postcard?')) return
    
    try {
      await deletePostcard(postcard.id)
      toast.success('Postcard deleted')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to delete postcard')
    }
  }

  const handleSaveAndExit = async () => {
    await saveNow()
    router.push('/dashboard')
  }

  // Loading state
  if (!isInitialized && !notFound) {
    return (
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-500">Loading editor...</p>
              </div>
            </div>
          </div>
        </main>
    )
  }

  // Not found state
  if (notFound) {
    return (
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Card className="max-w-md mx-auto mt-20">
              <CardContent className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Postcard not found</h2>
                <p className="text-gray-500 mb-6">
                  The postcard you're looking for doesn't exist or has been deleted.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => router.push('/dashboard')} variant="outline">
                    Back to Dashboard
                  </Button>
                  <Button onClick={() => router.push('/editor/new')}>
                    Create New Postcard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
    )
  }

  return (
    <AppLayout>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isNew ? 'Create New Postcard' : 'Edit Postcard'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {saveStatus}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Current State Badge */}
                <Badge 
                  variant={
                    postcard.state === 'published' ? 'success' :
                    postcard.state === 'scheduled' ? 'default' :
                    postcard.state === 'approved' ? 'secondary' :
                    'outline'
                  }
                  className="gap-1"
                >
                  {postcard.state === 'published' && <CheckCircle className="h-3 w-3" />}
                  {postcard.state === 'scheduled' && <Calendar className="h-3 w-3" />}
                  {postcard.state === 'approved' && <Clock className="h-3 w-3" />}
                  {postcard.state === 'draft' && <FileText className="h-3 w-3" />}
                  {postcard.state}
                </Badge>

                {/* State Transition Buttons */}
                {postcard.state === 'draft' && (
                  <Button
                    onClick={handleApprove}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                )}

                {(postcard.state === 'draft' || postcard.state === 'approved') && (
                  <Button
                    onClick={handleSchedule}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </Button>
                )}

                {postcard.state !== 'published' && (
                  <Button
                    onClick={handlePublish}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Publish Now
                  </Button>
                )}

                {/* Delete Button */}
                {postcard.id && (
                  <Button
                    onClick={handleDelete}
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}

                {/* Save and Exit */}
                <Button
                  onClick={handleSaveAndExit}
                  className="gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span className="hidden sm:inline">Save & Exit</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {(error || saveError) && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error || saveError}
                </p>
              </div>
            )}
          </div>

          {/* Editor Component */}
          <PostcardEditor
            initialEnglish={postcard.english_content || ''}
            initialSwedish={postcard.swedish_content || ''}
            onEnglishChange={handleEnglishChange}
            onSwedishChange={handleSwedishChange}
            characterLimits={{ english: 280, swedish: 3000 }}
            isSaving={isSaving}
            lastSaved={lastSaved}
            template={postcard.template as 'story' | 'tool' || 'story'}
            onTemplateChange={handleTemplateChange}
            onCopyEnglish={handleCopyEnglish}
            onCopySwedish={handleCopySwedish}
            saveStatus={saveStatus}
          />

          {/* Tips Section */}
          <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-sm mb-2">💡 Pro Tips:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Auto-save activates 2 seconds after you stop typing</li>
                <li>• Press <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">Ctrl/Cmd + S</kbd> to save immediately</li>
                <li>• Your work is backed up locally in case of connection issues</li>
                <li>• Click the copy buttons to quickly share content on social media</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  )
}