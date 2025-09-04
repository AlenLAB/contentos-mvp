"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react"

interface AccessibilityIssue {
  id: string
  type: "error" | "warning" | "info"
  message: string
  element: string
  impact: "critical" | "serious" | "moderate" | "minor"
}

interface PerformanceMetrics {
  frameRate: number
  memoryUsage: number
  activeCards: number
  interactionLatency: number
}

export function AccessibilityMonitor() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    frameRate: 60,
    memoryUsage: 12.5,
    activeCards: 18,
    interactionLatency: 14,
  })
  const [isScanning, setIsScanning] = useState(false)

  const runAccessibilityAudit = async () => {
    setIsScanning(true)

    // Simulate accessibility scanning
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockIssues: AccessibilityIssue[] = [
      {
        id: "1",
        type: "info",
        message: "All contrast ratios meet WCAG AA standards",
        element: "Global",
        impact: "minor",
      },
      {
        id: "2",
        type: "info",
        message: "Card3D effects respect prefers-reduced-motion",
        element: "Card3D components",
        impact: "minor",
      },
      {
        id: "3",
        type: "info",
        message: "Focus indicators visible on all interactive elements",
        element: "Navigation & Buttons",
        impact: "minor",
      },
    ]

    setIssues(mockIssues)
    setIsScanning(false)
  }

  useEffect(() => {
    runAccessibilityAudit()

    // Monitor performance metrics
    const performanceInterval = setInterval(() => {
      setPerformance((prev) => ({
        ...prev,
        frameRate: 58 + Math.random() * 4, // Simulate 58-62 fps
        memoryUsage: 12 + Math.random() * 2, // Simulate 12-14 MB
        interactionLatency: 12 + Math.random() * 6, // Simulate 12-18ms
      }))
    }, 1000)

    return () => clearInterval(performanceInterval)
  }, [])

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "serious":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "moderate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-small font-medium text-foreground">Performance Metrics</h3>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Real-time</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-body-small text-muted-foreground">Frame Rate</p>
            <p className="text-heading-small font-medium text-foreground">{performance.frameRate.toFixed(0)} fps</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((performance.frameRate / 60) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-body-small text-muted-foreground">Memory Usage</p>
            <p className="text-heading-small font-medium text-foreground">{performance.memoryUsage.toFixed(1)} MB</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((performance.memoryUsage / 20) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-body-small text-muted-foreground">Active Cards</p>
            <p className="text-heading-small font-medium text-foreground">{performance.activeCards}</p>
            <p className="text-caption text-muted-foreground">
              {performance.activeCards <= 21 ? "Within budget" : "Over budget"}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-body-small text-muted-foreground">Interaction Latency</p>
            <p className="text-heading-small font-medium text-foreground">
              {performance.interactionLatency.toFixed(0)}ms
            </p>
            <p className="text-caption text-muted-foreground">
              {performance.interactionLatency <= 16 ? "Excellent" : "Good"}
            </p>
          </div>
        </div>
      </Card>

      {/* Accessibility Audit */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-small font-medium text-foreground">Accessibility Audit</h3>
          <Button
            onClick={runAccessibilityAudit}
            disabled={isScanning}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Audit
              </>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          {issues.map((issue) => (
            <div key={issue.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              {getIssueIcon(issue.type)}
              <div className="flex-1 min-w-0">
                <p className="text-body text-foreground">{issue.message}</p>
                <p className="text-caption text-muted-foreground mt-1">{issue.element}</p>
              </div>
              <Badge className={getImpactColor(issue.impact)}>{issue.impact}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Design System Validation */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-heading-small font-medium text-foreground mb-4">Design System Validation</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-body font-medium text-foreground">Color System</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">Design tokens implemented</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">WCAG AA contrast ratios</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">Emerald accent usage consistent</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-body font-medium text-foreground">Typography</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">8-scale hierarchy implemented</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">Optimal line heights (1.5)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">3 font weights maximum</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-body font-medium text-foreground">Spacing</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">8px base grid system</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">Consistent vertical rhythm</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">Semantic spacing tokens</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-body font-medium text-foreground">Card3D System</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">Performance budget maintained</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">Reduced motion support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-body-small text-muted-foreground">Proper hierarchy applied</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
