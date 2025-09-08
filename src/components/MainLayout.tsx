"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NavigationCore } from "@/components/NavigationCore"
import { ContentOSDashboard } from "@/components/contentos-dashboard"
import { ContentCalendar } from "@/components/content-calendar"
import { PostEditor } from "@/components/post-editor"
import { PostcardList } from "@/components/postcard-list"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { TeamCollaboration } from "@/components/team-collaboration"
import { AdvancedScheduler } from "@/components/advanced-scheduler"
import { ToastProvider } from "@/components/toast-provider"
import { AIChatbot } from "@/components/ai-chatbot"
import { AudienceAnalytics } from "@/components/audience-analytics"
import { ContentDiscovery } from "@/components/content-discovery"
import { AccessibilityMonitor } from "@/components/qc/accessibility-monitor"
import { cn } from "@/lib/utils"
import { semanticTypography } from "@/lib/typography"

const onAction = (action: string, data?: any) => {
  console.log("[v0] Action triggered:", action, data)
}

const handleAIAction = (action: string, data?: any) => {
  console.log("[AI] Action triggered:", action, data)
}

export function MainLayout() {
  const [currentView, setCurrentView] = useState("calendar")
  const [isLoading, setIsLoading] = useState(false)
  const [previousView, setPreviousView] = useState("calendar")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleViewChange = (view: string) => {
    if (view === currentView) return

    setPreviousView(currentView)
    setIsLoading(true)

    setTimeout(() => {
      setCurrentView(view)
      setIsLoading(false)
    }, 250)
  }

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLoading) {
        setIsLoading(false)
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isLoading])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const magneticElements = document.querySelectorAll(".magnetic-hover")
      magneticElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        const distance = Math.sqrt(x * x + y * y)

        if (distance < 100) {
          const strength = (100 - distance) / 100
          const moveX = x * strength * 0.1
          const moveY = y * strength * 0.1
          ;(element as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.02})`
        } else {
          ;(element as HTMLElement).style.transform = "translate(0px, 0px) scale(1)"
        }
      })
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const getTransitionDirection = (from: string, to: string) => {
    const viewOrder = [
      "dashboard",
      "calendar",
      "postcards",
      "editor",
      "scheduler",
      "analytics",
      "team",
      "audience",
      "discovery",
      "qc",
      "settings",
    ]
    const fromIndex = viewOrder.indexOf(from)
    const toIndex = viewOrder.indexOf(to)

    return fromIndex < toIndex ? 1 : -1
  }

  const pageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 30 : -30,
      scale: 0.98,
    }),
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -30 : 30,
      scale: 0.98,
    }),
  }

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  }

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <motion.div
          className="flex items-center justify-center h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="space-y-premium-md text-center">
            <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground animate-pulse">Loading...</p>
            <p className={cn("text-muted-foreground/60", semanticTypography.hint)}>Press ESC to skip animation</p>
          </div>
        </motion.div>
      )
    }

    const direction = getTransitionDirection(previousView, currentView)

    const viewComponents = {
      dashboard: <ContentOSDashboard />,
      calendar: <ContentCalendar />,
      editor: <PostEditor />,
      postcards: <PostcardList />,
      analytics: <AnalyticsDashboard />,
      team: <TeamCollaboration />,
      scheduler: <AdvancedScheduler />,
      audience: <AudienceAnalytics />,
      discovery: <ContentDiscovery />,
      settings: (
        <div className="padding-premium-2xl">
          <div className="max-w-md mx-auto text-center space-y-premium-md">
            <div className="w-16 h-16 bg-card rounded-full mx-auto animate-pulse-subtle border border-border" />
            <h1 className="text-heading-2 text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configuration options coming soon</p>
          </div>
        </div>
      ),
      qc: (
        <div className="padding-premium-2xl">
          <div className="mb-6">
            <h1 className="text-display text-foreground mb-2">Quality Control</h1>
            <p className="text-body text-muted-foreground">
              Real-time monitoring and validation of ContentOS design system
            </p>
          </div>
          <AccessibilityMonitor />
        </div>
      ),
    }

    return (
      <motion.div
        key={currentView}
        custom={direction}
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
        className="w-full h-full"
      >
        {viewComponents[currentView as keyof typeof viewComponents] || <ContentCalendar />}
      </motion.div>
    )
  }

  return (
    <ToastProvider>
      <div className="dark">
        <div className="fixed inset-0 particles-bg gradient-mesh pointer-events-none" />

        <div className="flex h-screen bg-background text-foreground relative">
          <NavigationCore
            variant="view-based"
            currentView={currentView}
            onViewChange={handleViewChange}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
          />

          <div className="flex-1 flex flex-col">
            <div className="flex h-16 items-center space-premium-md border-b border-border padding-premium-md lg:hidden bg-background/80 backdrop-blur-xl">
              <NavigationCore 
                variant="view-based"
                currentView={currentView} 
                onViewChange={handleViewChange} 
              />
              <h1 className={cn("text-foreground", "text-heading-3")}>ContentOS</h1>
            </div>

            <main
              className={`flex-1 overflow-auto bg-background padding-premium-md sm:padding-premium-lg relative transition-all duration-300 z-10 ${
                isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
              }`}
            >
              <AnimatePresence mode="wait" custom={getTransitionDirection(previousView, currentView)}>
                <div className="max-w-full h-full">{renderCurrentView()}</div>
              </AnimatePresence>
            </main>
          </div>

          <AIChatbot onViewChange={handleViewChange} onAction={handleAIAction} />
        </div>
      </div>
    </ToastProvider>
  )
}
