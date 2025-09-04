"use client"

import { useEffect, useState } from "react"

interface PerformanceData {
  frameRate: number
  memoryUsage: number
  interactionLatency: number
  cardCount: number
}

export function usePerformanceTracker() {
  const [performance, setPerformance] = useState<PerformanceData>({
    frameRate: 60,
    memoryUsage: 0,
    interactionLatency: 0,
    cardCount: 0,
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFrameRate = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))

        setPerformance((prev) => ({
          ...prev,
          frameRate: fps,
          cardCount: document.querySelectorAll("[data-card3d]").length,
          memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
        }))

        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(measureFrameRate)
    }

    // Start monitoring
    animationId = requestAnimationFrame(measureFrameRate)

    // Monitor interaction latency
    const handleInteractionStart = () => {
      const startTime = performance.now()

      const handleInteractionEnd = () => {
        const endTime = performance.now()
        setPerformance((prev) => ({
          ...prev,
          interactionLatency: endTime - startTime,
        }))
        document.removeEventListener("transitionend", handleInteractionEnd)
      }

      document.addEventListener("transitionend", handleInteractionEnd, { once: true })
    }

    document.addEventListener("mouseenter", handleInteractionStart, true)

    return () => {
      cancelAnimationFrame(animationId)
      document.removeEventListener("mouseenter", handleInteractionStart, true)
    }
  }, [])

  return performance
}
