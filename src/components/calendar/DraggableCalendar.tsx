'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { format, addDays, startOfWeek, isSameDay, isPast, isToday } from 'date-fns'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePostcardStore, Postcard } from '@/store/postcards'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Clock, GripVertical, CheckCircle } from 'lucide-react'

// Detect if we're on a touch device
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Item type for drag and drop
const ItemTypes = {
  POSTCARD: 'postcard'
}

interface DragItem {
  id: string
  originalDate: Date | null
}

// Draggable Postcard Component
interface DraggablePostcardProps {
  postcard: Postcard
  onRemove?: () => void
}

function DraggablePostcard({ postcard, onRemove }: DraggablePostcardProps) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.POSTCARD,
    item: { 
      id: postcard.id, 
      originalDate: postcard.scheduled_date 
    } as DragItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop() && onRemove) {
        // If dropped outside valid targets, could optionally unschedule
        // onRemove()
      }
    }
  }), [postcard.id, postcard.scheduled_date])

  // For mobile: add long-press to initiate selection
  const [isSelected, setIsSelected] = useState(false)
  const handleLongPress = useCallback(() => {
    if (isTouchDevice()) {
      setIsSelected(true)
      toast.info('Tap a date to reschedule', { duration: 2000 })
    }
  }, [])

  return (
    <div
      ref={preview}
      className={cn(
        "transition-all duration-200",
        isDragging && "opacity-50 scale-95",
        isSelected && "ring-2 ring-primary animate-pulse"
      )}
    >
      <Card 
        className={cn(
          "cursor-move hover:shadow-md transition-shadow",
          "bg-white dark:bg-gray-800"
        )}
        onTouchStart={() => {
          const timer = setTimeout(handleLongPress, 500)
          const cleanup = () => clearTimeout(timer)
          document.addEventListener('touchend', cleanup, { once: true })
          document.addEventListener('touchmove', cleanup, { once: true })
        }}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div ref={drag} className="mt-1 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
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
                {postcard.english_content}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{postcard.scheduled_date ? format(postcard.scheduled_date, 'h:mm a') : 'Not scheduled'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Droppable Calendar Cell Component
interface DroppableCalendarCellProps {
  date: Date
  postcards: Postcard[]
  onDrop: (item: DragItem, date: Date) => void
  isDisabled?: boolean
}

function DroppableCalendarCell({ date, postcards, onDrop, isDisabled }: DroppableCalendarCellProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.POSTCARD,
    canDrop: () => !isDisabled && !isPast(date) || isToday(date),
    drop: (item: DragItem) => onDrop(item, date),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [date, isDisabled, onDrop])

  const isActive = isOver && canDrop
  const isPastDate = isPast(date) && !isToday(date)
  const hasPostcards = postcards.length > 0

  return (
    <div
      ref={drop}
      className={cn(
        "min-h-[120px] p-2 border rounded-lg transition-all duration-200",
        "hover:bg-gray-50 dark:hover:bg-gray-800",
        isPastDate && "opacity-50 bg-gray-100 dark:bg-gray-900",
        isActive && "bg-primary/10 border-primary border-2 scale-[1.02]",
        canDrop && !isActive && "border-dashed border-gray-300",
        hasPostcards && "bg-blue-50/50 dark:bg-blue-900/20"
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
          {hasPostcards && (
            <Badge variant="secondary" className="text-xs">
              {postcards.length}
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {format(date, 'EEE')}
        </span>
      </div>

      {isActive && (
        <div className="flex items-center justify-center p-4 border-2 border-dashed border-primary rounded-md bg-primary/5">
          <p className="text-xs text-primary font-medium">Drop here</p>
        </div>
      )}

      <div className="space-y-2 mt-2">
        {postcards.map((postcard) => (
          <DraggablePostcard 
            key={postcard.id} 
            postcard={postcard}
            onRemove={() => {
              // Optional: unschedule on remove
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Main Calendar Component with Drag and Drop
export function DraggableCalendar() {
  const { postcards, updatePostcard, fetchPostcards } = usePostcardStore()
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedPostcard, setSelectedPostcard] = useState<string | null>(null)

  useEffect(() => {
    fetchPostcards()
  }, [fetchPostcards])

  // Get the days of the current week (or next 14 days)
  const getDaysArray = useCallback(() => {
    const days = []
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Start on Monday
    for (let i = 0; i < 14; i++) {
      days.push(addDays(start, i))
    }
    return days
  }, [currentWeek])

  const days = getDaysArray()

  // Handle drop event
  const handleDrop = useCallback(async (item: DragItem, date: Date) => {
    const postcard = postcards.find(p => p.id === item.id)
    if (!postcard) return

    // Check if date already has postcards (optional: enforce single postcard per day)
    const existingPostcards = postcards.filter(p => 
      p.scheduled_date && isSameDay(p.scheduled_date, date) && p.id !== item.id
    )

    if (existingPostcards.length >= 3) {
      toast.error('Maximum 3 postcards per day', {
        description: 'This date already has the maximum number of scheduled posts.'
      })
      return
    }

    // Update the postcard's scheduled date
    try {
      await updatePostcard(item.id, {
        scheduled_date: date,
        state: 'scheduled'
      })

      toast.success(`Rescheduled to ${format(date, 'MMM d, yyyy')}`, {
        description: 'Postcard has been successfully rescheduled.',
        icon: <CheckCircle className="h-4 w-4" />
      })

      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    } catch (error) {
      toast.error('Failed to reschedule', {
        description: 'Please try again.',
        action: {
          label: 'Retry',
          onClick: () => handleDrop(item, date)
        }
      })
    }
  }, [postcards, updatePostcard])

  // Mobile tap handler for selected postcards
  const handleCellTap = useCallback((date: Date) => {
    if (selectedPostcard && !isPast(date)) {
      handleDrop({ id: selectedPostcard, originalDate: null }, date)
      setSelectedPostcard(null)
    }
  }, [selectedPostcard, handleDrop])

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
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <div className="space-y-6">
        {/* Unscheduled Postcards Section */}
        {unscheduledPostcards.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Unscheduled Postcards ({unscheduledPostcards.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {unscheduledPostcards.map((postcard) => (
                <DraggablePostcard key={postcard.id} postcard={postcard} />
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
              <DroppableCalendarCell
                key={day.toISOString()}
                date={day}
                postcards={getPostcardsForDate(day)}
                onDrop={handleDrop}
                isDisabled={isPast(day) && !isToday(day)}
              />
            ))}
          </div>
        </div>

        {/* Mobile Instructions */}
        {isTouchDevice() && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Mobile tip:</strong> Long-press a postcard to select it, then tap a date to reschedule.
            </p>
          </div>
        )}
      </div>
    </DndProvider>
  )
}