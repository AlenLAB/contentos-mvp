"use client"

import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MiniGrowthChartProps {
  data: Array<{ value: number; label?: string }>
  className?: string
  showTooltip?: boolean
  state?: "loading" | "empty" | "error" | "success"
  trend?: "up" | "down" | "neutral"
}

export function MiniGrowthChart({
  data,
  className,
  showTooltip = true,
  state = "success",
  trend = "neutral",
}: MiniGrowthChartProps) {
  if (state === "loading") {
    return <div className={cn("w-[60px] h-[30px] bg-muted rounded animate-pulse", className)} />
  }

  if (state === "empty") {
    return (
      <div className={cn("w-[60px] h-[30px] flex items-center justify-center", className)}>
        <div className="w-full h-px border-t border-dashed border-muted-foreground/50" />
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className={cn("w-[60px] h-[30px] flex items-center justify-center", className)}>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      </div>
    )
  }

  const getLineColor = () => {
    switch (trend) {
      case "up":
        return "#10b981" // emerald-500 for positive growth
      case "down":
        return "#ef4444" // red-500 for negative growth
      default:
        return "#6b7280" // gray-500 for neutral
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-emerald-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />
    }
  }

  return (
    <div className={cn("relative group", className)}>
      <ResponsiveContainer width={60} height={30}>
        <LineChart data={data}>
          {showTooltip && (
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-sm font-medium">{payload[0].value}</p>
                      {label && <p className="text-xs text-muted-foreground">{label}</p>}
                    </div>
                  )
                }
                return null
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={getLineColor()}
            strokeWidth={2}
            dot={false}
            className="animate-draw-path"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {getTrendIcon()}
      </div>
    </div>
  )
}
