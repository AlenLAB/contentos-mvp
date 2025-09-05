'use client'

import { useState, useEffect } from 'react'
import { X, Twitter, Linkedin, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Postcard } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { usePostcardStore } from '@/store/postcards'

interface PostcardSplitViewProps {
  postcard: Postcard
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostcardSplitView({ postcard, open, onOpenChange }: PostcardSplitViewProps) {
  const [englishContent, setEnglishContent] = useState(postcard.english_content)
  const [swedishContent, setSwedishContent] = useState(postcard.swedish_content || '')
  const [copiedEnglish, setCopiedEnglish] = useState(false)
  const [copiedSwedish, setCopiedSwedish] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const updatePostcard = usePostcardStore((state) => state.updatePostcard)

  // Update local state when postcard changes
  useEffect(() => {
    setEnglishContent(postcard.english_content)
    setSwedishContent(postcard.swedish_content || '')
  }, [postcard])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePostcard(postcard.id, {
        english_content: englishContent,
        swedish_content: swedishContent
      })
      toast.success('Content updated successfully')
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to update content')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async (text: string, platform: 'english' | 'swedish') => {
    try {
      await navigator.clipboard.writeText(text)
      if (platform === 'english') {
        setCopiedEnglish(true)
        setTimeout(() => setCopiedEnglish(false), 2000)
      } else {
        setCopiedSwedish(true)
        setTimeout(() => setCopiedSwedish(false), 2000)
      }
      toast.success(`Copied ${platform === 'english' ? 'X' : 'LinkedIn'} content`)
    } catch (error) {
      toast.error('Failed to copy content')
    }
  }

  const englishCharCount = englishContent.length
  const swedishCharCount = swedishContent.length
  const englishCharLimit = 280
  const swedishCharLimit = 3000

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-white">
              Edit Postcard Content
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 h-full overflow-hidden">
          {/* X/Twitter Panel (English) */}
          <div className="flex-1 flex flex-col border-r border-zinc-800">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-black rounded-lg">
                    <Twitter className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">X Post</h3>
                    <p className="text-xs text-zinc-500">English • AI-First Builder</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(englishContent, 'english')}
                  className="text-zinc-400 hover:text-white"
                >
                  {copiedEnglish ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* X Post Preview */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-black rounded-2xl p-4 border border-zinc-800">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-semibold text-white">Alen</span>
                      <span className="text-zinc-500">@alenlab</span>
                      <span className="text-zinc-500">·</span>
                      <span className="text-zinc-500">now</span>
                    </div>
                    <Textarea
                      value={englishContent}
                      onChange={(e) => setEnglishContent(e.target.value)}
                      className="bg-transparent border-0 p-0 text-white resize-none focus:ring-0 min-h-[100px]"
                      placeholder="What's happening?"
                      maxLength={englishCharLimit}
                    />
                  </div>
                </div>
                
                {/* Character Counter */}
                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-zinc-500">
                    <button className="hover:text-white transition-colors">💬</button>
                    <button className="hover:text-white transition-colors">🔁</button>
                    <button className="hover:text-white transition-colors">❤️</button>
                    <button className="hover:text-white transition-colors">📊</button>
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    englishCharCount > englishCharLimit 
                      ? "text-red-500" 
                      : englishCharCount > englishCharLimit * 0.9 
                      ? "text-yellow-500" 
                      : "text-zinc-500"
                  )}>
                    {englishCharCount}/{englishCharLimit}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Panel (Swedish) */}
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Linkedin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">LinkedIn Post</h3>
                    <p className="text-xs text-zinc-500">Swedish • Professional Network</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(swedishContent, 'swedish')}
                  className="text-zinc-400 hover:text-white"
                >
                  {copiedSwedish ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* LinkedIn Post Preview */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <div className="flex gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="mb-1">
                      <div className="font-semibold text-white">Alen Lab</div>
                      <div className="text-xs text-zinc-500">AI Consultant & Digital Strategist</div>
                      <div className="text-xs text-zinc-500">Just nu</div>
                    </div>
                  </div>
                </div>
                
                <Textarea
                  value={swedishContent}
                  onChange={(e) => setSwedishContent(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white resize-none focus:ring-emerald-500 min-h-[200px] mb-3"
                  placeholder="Vad vill du dela?"
                  maxLength={swedishCharLimit}
                />
                
                {/* Character Counter & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-zinc-500">
                    <button className="hover:text-white transition-colors">👍 Gilla</button>
                    <button className="hover:text-white transition-colors">💬 Kommentera</button>
                    <button className="hover:text-white transition-colors">↗️ Dela</button>
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    swedishCharCount > swedishCharLimit 
                      ? "text-red-500" 
                      : swedishCharCount > swedishCharLimit * 0.9 
                      ? "text-yellow-500" 
                      : "text-zinc-500"
                  )}>
                    {swedishCharCount}/{swedishCharLimit}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
              {postcard.template || 'General'}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn(
                "border-zinc-700",
                postcard.state === 'draft' && "text-yellow-500 border-yellow-500/50",
                postcard.state === 'approved' && "text-blue-500 border-blue-500/50",
                postcard.state === 'scheduled' && "text-purple-500 border-purple-500/50",
                postcard.state === 'published' && "text-emerald-500 border-emerald-500/50"
              )}
            >
              {postcard.state}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || englishCharCount > englishCharLimit || swedishCharCount > swedishCharLimit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}