"use client"

import type React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { type ReactNode, useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Card3DProps {
  children: ReactNode
  className?: string
  variant?: "hero" | "standard" | "minimal"
  disabled?: boolean
  onClick?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: () => void
  onDrop?: (e: React.DragEvent) => void
}

export function Card3D({
  children,
  className,
  variant = "standard",
  disabled = false,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0

      setIsMobile(width < 768 || isTouchDevice)
      setIsTablet(width >= 768 && width < 1024 && isTouchDevice)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  const getTiltRange = () => {
    if (isMobile) return 0

    switch (variant) {
      case "hero":
        return isTablet ? 4 : 8 // Reduced tilt on tablets
      case "standard":
        return isTablet ? 2 : 4 // Reduced tilt on tablets
      case "minimal":
        return 0
      default:
        return isTablet ? 2 : 4
    }
  }

  const tiltRange = getTiltRange()
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltRange, -tiltRange])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltRange, tiltRange])

  const glossX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100])
  const glossY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100])

  const parallaxX = useTransform(mouseXSpring, [-0.5, 0.5], [-2, 2])
  const parallaxY = useTransform(mouseYSpring, [-0.5, 0.5], [-2, 2])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled || isMobile) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    if (!disabled && !isMobile) {
      x.set(0)
      y.set(0)
    }
  }

  const getVariantStyles = () => {
    const baseStyles = isMobile
      ? "min-h-[44px] touch-manipulation" // Ensure minimum touch target size
      : ""

    switch (variant) {
      case "hero":
        return cn(
          baseStyles,
          isMobile
            ? "shadow-lg hover:shadow-xl bg-card border border-border"
            : "shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] bg-card border border-border",
        )
      case "standard":
        return cn(baseStyles, "shadow-lg hover:shadow-xl bg-card border border-border")
      case "minimal":
        return cn(baseStyles, "shadow-md hover:shadow-lg bg-card border border-border hover:scale-[1.02]")
      default:
        return cn(baseStyles, "shadow-lg hover:shadow-xl bg-card border border-border")
    }
  }

  const getPressScale = () => {
    if (isMobile) {
      switch (variant) {
        case "hero":
          return 0.95
        case "standard":
          return 0.97
        case "minimal":
          return 0.98
        default:
          return 0.97
      }
    }

    switch (variant) {
      case "hero":
        return 0.98
      case "standard":
        return 0.99
      case "minimal":
        return 0.99
      default:
        return 0.99
    }
  }

  const getHoverScale = () => {
    if (isMobile) {
      return variant === "minimal" ? 1.02 : 1.03
    }
    return variant === "minimal" ? 1.02 : 1.05
  }

  return (
    <motion.div
      ref={ref}
      style={{
        rotateY: !isMobile && variant !== "minimal" && !disabled ? rotateY : 0,
        rotateX: !isMobile && variant !== "minimal" && !disabled ? rotateX : 0,
        transformStyle: !isMobile ? "preserve-3d" : "flat",
        willChange: !isMobile && variant !== "minimal" ? "transform" : "auto",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      whileHover={{
        scale: getHoverScale(),
        transition: { duration: isMobile ? 0.15 : 0.2, ease: "easeOut" },
      }}
      whileTap={{
        scale: getPressScale(),
        transition: { duration: 0.1, ease: "easeOut" },
      }}
      className={cn(
        "relative transition-all duration-300 ease-out cursor-pointer",
        getVariantStyles(),
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      data-card3d
    >
      {!isMobile && variant !== "minimal" && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 hover:opacity-30 transition-opacity duration-500 pointer-events-none overflow-hidden"
          style={{
            background:
              variant === "hero"
                ? `radial-gradient(circle at ${glossX}% ${glossY}%, rgba(255,255,255,0.4) 0%, transparent 50%)`
                : `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.2) ${glossX}%, transparent 70%)`,
          }}
        />
      )}

      <motion.div
        style={{
          x: !isMobile && variant === "hero" && !disabled ? parallaxX : 0,
          y: !isMobile && variant === "hero" && !disabled ? parallaxY : 0,
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .card-3d {
            transform: none !important;
          }
          .card-3d:hover {
            transform: scale(1.02) !important;
          }
        }
        
        @media (max-width: 768px) {
          .card-3d {
            transform-style: flat !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
