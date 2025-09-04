"use client"

import type React from "react"

import { useState } from "react"
import {
  format,
  addDays,
  startOfDay,
  isToday,
  isWeekend,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getYear,
  setYear,
  setMonth,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import { Card3D } from "@/components/ui/card-3d"
import { Plus, Sparkles, GripVertical, TrendingUp, ChevronLeft, ChevronRight, Calendar, ZoomOut } from "lucide-react"
import { ContentGenerationDialog } from "@/components/content-generation-dialog"

interface ScheduledPost {
  id: string
  content: string
  state: "draft" | "scheduled" | "published"
  date: Date
  engagement?: number // Mock engagement score 0-100
  platform?: "twitter" | "linkedin" | "both"
  performance?: {
    likes: number
    shares: number
    comments: number
    reach: number
  }
}

const mockPosts: ScheduledPost[] = [
  {
    id: "1",
    content:
      "Excited to share our latest product update! New features include advanced analytics and improved user experience.",
    state: "scheduled",
    date: addDays(new Date(), 2),
    engagement: 85,
    platform: "both",
  },
  {
    id: "2",
    content: "Behind the scenes look at our development process and how we build features that matter to our users.",
    state: "draft",
    date: addDays(new Date(), 5),
    engagement: 0,
    platform: "linkedin",
  },
  {
    id: "3",
    content: "Weekly roundup of industry insights and trends that are shaping the future of content creation.",
    state: "scheduled",
    date: addDays(new Date(), 8),
    engagement: 92,
    platform: "twitter",
  },
  // Historical posts for previous months
  {
    id: "4",
    content: "Reflecting on our Q3 achievements and setting goals for Q4. Exciting times ahead!",
    state: "published",
    date: subMonths(new Date(), 1),
    engagement: 78,
    platform: "both",
    performance: { likes: 245, shares: 67, comments: 34, reach: 12500 },
  },
  {
    id: "5",
    content: "Team spotlight: Meet our amazing developers who make the magic happen behind the scenes.",
    state: "published",
    date: addDays(subMonths(new Date(), 1), 5),
    engagement: 91,
    platform: "linkedin",
    performance: { likes: 189, shares: 45, comments: 28, reach: 8900 },
  },
  {
    id: "6",
    content: "Industry trends report: What we learned from analyzing 10,000+ social media posts.",
    state: "published",
    date: addDays(subMonths(new Date(), 1), 12),
    engagement: 95,
    platform: "both",
    performance: { likes: 567, shares: 123, comments: 89, reach: 25600 },
  },
]

export function ContentCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isGenerationDialogOpen, setIsGenerationDialogOpen] = useState(false)
  const [posts, setPosts] = useState<ScheduledPost[]>(mockPosts)
  const [draggedPost, setDraggedPost] = useState<ScheduledPost | null>(null)
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "year">("month")

  const today = startOfDay(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "month" ? "year" : "month")
  }

  const yearMonths = Array.from({ length: 12 }, (_, i) => setMonth(setYear(new Date(), getYear(currentDate)), i))

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => format(post.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
  }

  const getPostsForMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    return posts.filter((post) => post.date >= monthStart && post.date <= monthEnd)
  }

  const getMonthPerformance = (monthDate: Date) => {
    const monthPosts = getPostsForMonth(monthDate)
    const publishedPosts = monthPosts.filter((post) => post.state === "published")

    if (publishedPosts.length === 0) return { avgEngagement: 0, totalReach: 0, postCount: 0 }

    const avgEngagement = publishedPosts.reduce((sum, post) => sum + (post.engagement || 0), 0) / publishedPosts.length
    const totalReach = publishedPosts.reduce((sum, post) => sum + (post.performance?.reach || 0), 0)

    return { avgEngagement, totalReach, postCount: publishedPosts.length }
  }

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

  const getActivityIntensity = (date: Date) => {
    const dayPosts = getPostsForDate(date)
    if (dayPosts.length === 0) return 0

    let intensity = 0.2 * dayPosts.length // Base intensity per post

    dayPosts.forEach((post) => {
      if (post.state === "scheduled") intensity += 0.2
      if (post.state === "published") intensity += 0.4
      if (post.engagement) intensity += (post.engagement / 100) * 0.3
    })

    return Math.min(intensity, 1)
  }

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return "text-emerald-400"
    if (engagement >= 60) return "text-blue-400"
    if (engagement >= 40) return "text-amber-400"
    return "text-red-400"
  }

  const handleDragStart = (e: React.DragEvent, post: ScheduledPost) => {
    setDraggedPost(post)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverDate(date)
  }

  const handleDragLeave = () => {
    setDragOverDate(null)
  }

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault()
    setDragOverDate(null)

    if (draggedPost) {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === draggedPost.id ? { ...post, date: targetDate } : post)),
      )
      setDraggedPost(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedPost(null)
    setDragOverDate(null)
  }

  const renderYearView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {yearMonths.map((month, index) => {
        const performance = getMonthPerformance(month)
        const isCurrentMonth = format(month, "yyyy-MM") === format(new Date(), "yyyy-MM")

        return (
          <Card3D
            key={index}
            variant="standard"
            className={`cursor-pointer bg-zinc-800 border-zinc-700 hover:border-zinc-600 ${
              isCurrentMonth ? "ring-2 ring-emerald-500" : ""
            }`}
            onClick={() => {
              setCurrentDate(month)
              setViewMode("month")
            }}
          >
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <h3 className="font-semibold text-lg text-white">{format(month, "MMM")}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Posts:</span>
                    <span className="font-medium text-white">{performance.postCount}</span>
                  </div>
                  {performance.avgEngagement > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Avg Engagement:</span>
                      <span className={`font-medium ${getEngagementColor(performance.avgEngagement)}`}>
                        {Math.round(performance.avgEngagement)}%
                      </span>
                    </div>
                  )}
                  {performance.totalReach > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Total Reach:</span>
                      <span className="font-medium text-white">{(performance.totalReach / 1000).toFixed(1)}K</span>
                    </div>
                  )}
                </div>
                {performance.avgEngagement > 0 && (
                  <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-1000"
                      style={{ width: `${performance.avgEngagement}%` }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card3D>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-6 bg-zinc-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Content Calendar</h1>
            <p className="text-sm text-zinc-400 mt-1">
              {viewMode === "year" ? getYear(currentDate) : format(currentDate, "MMMM yyyy")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
            >
              <Calendar className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
            >
              <ZoomOut className="w-4 h-4" />
              {viewMode === "month" ? "Year" : "Month"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400">
            <TrendingUp className="w-4 h-4" />
            <span>
              {posts.filter((p) => format(p.date, "yyyy-MM") === format(currentDate, "yyyy-MM")).length} posts this
              month
            </span>
            {viewMode === "month" && (
              <div className="flex gap-1 ml-2">
                {calendarDays.slice(0, 7).map((day, i) => {
                  const intensity = getActivityIntensity(day)
                  return (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-sm bg-emerald-500 transition-all duration-200"
                      style={{ opacity: intensity || 0.1 }}
                      title={format(day, "MMM d")}
                    />
                  )
                })}
              </div>
            )}
          </div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setIsGenerationDialogOpen(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Phase
          </Button>
        </div>
      </div>

      {viewMode === "year" ? (
        renderYearView()
      ) : (
        /* Calendar Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {calendarDays.map((day, index) => {
            const dayPosts = getPostsForDate(day)
            const isCurrentDay = isToday(day)
            const isWeekendDay = isWeekend(day)
            const isFirstOfMonth = format(day, "d") === "1"
            const isDragOver = dragOverDate && format(dragOverDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
            const activityIntensity = getActivityIntensity(day)

            return (
              <Card3D
                key={index}
                variant={dayPosts.length > 0 ? "hero" : "standard"}
                className={`
                  relative cursor-pointer
                  ${isCurrentDay ? "ring-2 ring-emerald-500" : ""}
                  ${isWeekendDay ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-800 border-zinc-700"}
                  ${dayPosts.length === 0 ? "border-dashed hover:border-zinc-600" : "hover:border-zinc-600"}
                  ${isDragOver ? "ring-2 ring-blue-500 bg-blue-900/20" : ""}
                  min-h-[140px] sm:min-h-[120px]
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                onClick={() => setSelectedDate(day)}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
              >
                <CardContent className="p-4 h-full flex flex-col">
                  {/* Date Header */}
                  <div className="flex flex-col items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${isCurrentDay ? "text-emerald-400" : "text-white"}`}>
                        {format(day, "d")}
                      </span>
                      {isFirstOfMonth && (
                        <span className="text-xs font-medium text-zinc-400 uppercase">{format(day, "MMM")}</span>
                      )}
                      {dayPosts.length > 0 && (
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                            style={{ opacity: activityIntensity }}
                          />
                          {dayPosts.length > 1 && (
                            <span className="text-xs font-medium text-zinc-400">+{dayPosts.length - 1}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 uppercase font-medium">{format(day, "EEE")}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    {dayPosts.length > 0 ? (
                      <div className="space-y-2">
                        {dayPosts.slice(0, 1).map((post) => (
                          <div
                            key={post.id}
                            className={`space-y-2 cursor-move transition-all duration-300 ${draggedPost?.id === post.id ? "opacity-50" : ""}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, post)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs transition-all duration-300 ${getStateColor(post.state)}`}
                              >
                                {post.state}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {post.engagement && post.engagement > 0 && (
                                  <span className={`text-xs font-medium ${getEngagementColor(post.engagement)}`}>
                                    {post.engagement}%
                                  </span>
                                )}
                                <GripVertical className="w-3 h-3 text-zinc-400" />
                              </div>
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                              {post.content.slice(0, 50)}
                              {post.content.length > 50 && "..."}
                            </p>
                            {post.performance && (
                              <div className="flex justify-between text-xs text-zinc-400">
                                <span>{post.performance.likes} likes</span>
                                <span>{(post.performance.reach / 1000).toFixed(1)}K reach</span>
                              </div>
                            )}
                            {post.engagement && post.engagement > 0 && (
                              <div className="mt-2">
                                <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${post.engagement}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                        <Plus className="w-5 h-5 text-zinc-400" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card3D>
            )
          })}
        </div>
      )}

      {/* Content Generation Dialog */}
      <ContentGenerationDialog open={isGenerationDialogOpen} onOpenChange={setIsGenerationDialogOpen} />
    </div>
  )
}
