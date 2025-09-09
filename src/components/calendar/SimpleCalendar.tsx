'use client'

import React, { useState, useCallback, useEffect, DragEvent } from 'react'
import { format, addDays, startOfWeek, isSameDay, isPast, isToday } from 'date-fns'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePostcardStore, Postcard } from '@/store/postcards'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Clock, GripVertical, CheckCircle, AlertCircle } from 'lucide-react'

// Simple Draggable Postcard Component using native HTML5
interface PostcardCardProps {
  postcard: Postcard
  isDragging?: boolean
  onDragStart: (postcard: Postcard) => void
  onDragEnd: () => void
}

function PostcardCard({ postcard, isDragging, onDragStart, onDragEnd }: PostcardCardProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('postcard', JSON.stringify(postcard))
    onDragStart(postcard)
  }

  return (
    <Card 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "cursor-move hover:shadow-md transition-all duration-200",
        "bg-white dark:bg-gray-800",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-gray-400 mt-1 cursor-grab active:cursor-grabbing" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge 
                variant={postcard.template === 'story' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {postcard.template}
              </Badge>
              <Badge 
                variant={postcard.state === 'published' ? 'success' : 'outline'}
                className="text-xs"
              >
                {postcard.state}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {postcard.x_content}
            </p>
            {postcard.scheduled_date && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{format(postcard.scheduled_date, 'h:mm a')}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Calendar Cell Component
interface CalendarCellProps {
  date: Date
  postcards: Postcard[]
  onDrop: (postcard: Postcard, date: Date) => void
  isOver?: boolean
}

function CalendarCell({ date, postcards, onDrop, isOver }: CalendarCellProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const isPastDate = isPast(date) && !isToday(date)
  const canDrop = !isPastDate

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (canDrop) {
      e.dataTransfer.dropEffect = 'move'
      setIsDragOver(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    if (!canDrop) {
      toast.error('Cannot schedule in the past')
      return
    }

    try {
      const postcardData = e.dataTransfer.getData('postcard')
      const postcard = JSON.parse(postcardData) as Postcard
      onDrop(postcard, date)
    } catch (error) {
      console.error('Error parsing dropped data:', error)
      toast.error('Failed to schedule postcard')
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "min-h-[120px] p-2 border rounded-lg transition-all duration-200",
        "hover:bg-gray-50 dark:hover:bg-gray-800",
        isPastDate && "opacity-50 bg-gray-100 dark:bg-gray-900 cursor-not-allowed",
        isDragOver && canDrop && "bg-primary/10 border-primary border-2 scale-[1.02]",
        postcards.length > 0 && "bg-blue-50/50 dark:bg-blue-900/20"
      )}
    >
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-sm font-medium",
            isToday(date) && "text-primary",
            isPastDate && "text-gray-400"
          )}>
            {format(date, 'd')}
          </span>
          {postcards.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {postcards.length}
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {format(date, 'EEE')}
        </span>
      </div>

      {isDragOver && canDrop && (
        <div className="flex items-center justify-center p-4 border-2 border-dashed border-primary rounded-md bg-primary/5 mb-2">
          <p className="text-xs text-primary font-medium">Drop here</p>
        </div>
      )}

      <div className="space-y-1">
        {postcards.map((postcard) => (
          <div key={postcard.id} className="text-xs bg-white dark:bg-gray-700 rounded p-1">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                {postcard.template}
              </Badge>
              <span className="truncate flex-1 text-gray-600 dark:text-gray-300">
                {postcard.x_content}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Simple Calendar Component
export function SimpleCalendar() {
  const { postcards, updatePostcard, fetchPostcards } = usePostcardStore()
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [draggedPostcard, setDraggedPostcard] = useState<Postcard | null>(null)

  useEffect(() => {
    fetchPostcards()
  }, [fetchPostcards])

  // Get 14 days starting from Monday of current week
  const getDaysArray = useCallback(() => {
    const days = []
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 })
    for (let i = 0; i < 14; i++) {
      days.push(addDays(start, i))
    }
    return days
  }, [currentWeek])

  const days = getDaysArray()

  // Handle drop event
  const handleDrop = useCallback(async (postcard: Postcard, date: Date) => {
    // Check for existing postcards on this date
    const existingPostcards = postcards.filter(p => 
      p.scheduled_date && isSameDay(p.scheduled_date, date) && p.id !== postcard.id
    )

    if (existingPostcards.length >= 3) {
      toast.error('Maximum 3 postcards per day', {
        description: 'This date already has the maximum number of scheduled posts.',
        icon: <AlertCircle className="h-4 w-4" />
      })
      return
    }

    try {
      await updatePostcard(postcard.id, {
        scheduled_date: date,
        state: 'scheduled'
      })

      toast.success(`Rescheduled to ${format(date, 'MMM d, yyyy')}`, {
        description: 'Postcard has been successfully rescheduled.',
        icon: <CheckCircle className="h-4 w-4" />
      })
    } catch (error) {
      toast.error('Failed to reschedule', {
        description: 'Please try again.',
        action: {
          label: 'Retry',
          onClick: () => handleDrop(postcard, date)
        }
      })
    }
  }, [postcards, updatePostcard])

  // Get postcards for a specific date
  const getPostcardsForDate = useCallback((date: Date) => {
    return postcards.filter(p => 
      p.scheduled_date && isSameDay(p.scheduled_date, date)
    )
  }, [postcards])

  // Unscheduled postcards
  const unscheduledPostcards = postcards.filter(p => 
    !p.scheduled_date && p.state === 'draft'
  )

  return (
    <div className="space-y-6">
      {/* Unscheduled Postcards */}
      {unscheduledPostcards.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Unscheduled Postcards ({unscheduledPostcards.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unscheduledPostcards.map((postcard) => (
              <PostcardCard 
                key={postcard.id} 
                postcard={postcard}
                isDragging={draggedPostcard?.id === postcard.id}
                onDragStart={setDraggedPostcard}
                onDragEnd={() => setDraggedPostcard(null)}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Drag postcards to calendar dates to schedule them
          </p>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Next 14 Days Schedule
          </h2>
        </div>
        
        <div className="grid grid-cols-7 gap-2 p-4">
          {days.map((day) => (
            <CalendarCell
              key={day.toISOString()}
              date={day}
              postcards={getPostcardsForDate(day)}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Tip:</strong> Drag postcards from the unscheduled section to any future date on the calendar. 
          You can schedule up to 3 postcards per day.
        </p>
      </div>
    </div>
  )
}