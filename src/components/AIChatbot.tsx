"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, Bot, User, Sparkles, Calendar, TrendingUp, CheckCircle, Zap } from "lucide-react"
import { aiActions } from "@/lib/ai-actions"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  actions?: Array<{
    type: string
    label: string
    data?: any
  }>
  isExecuting?: boolean
  executionResult?: any
}

interface AIChatbotProps {
  onViewChange?: (view: string) => void
  onAction?: (action: string, data?: any) => void
}

export function AIChatbot({ onViewChange, onAction }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your ContentOS AI assistant. I can help you create content, analyze performance, schedule posts, optimize your strategy, and much more. What would you like to accomplish today?",
      timestamp: new Date(),
      actions: [
        { type: "action", label: "Generate Content", data: "generate-content" },
        { type: "action", label: "Analyze Performance", data: "analyze-performance" },
        { type: "view", label: "View Analytics", data: "analytics" },
        { type: "action", label: "Optimize Posting", data: "optimize-posting" },
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const response = generateAIResponse(inputValue)
      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): Message => {
    const lowerInput = input.toLowerCase()

    // Content generation queries
    if (lowerInput.includes("generate") || lowerInput.includes("create content") || lowerInput.includes("write")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "I'll help you generate high-quality content! Based on your top-performing posts, I can create content about AI trends, industry insights, or behind-the-scenes content. What topic would you like me to focus on?",
        timestamp: new Date(),
        actions: [
          { type: "action", label: "Generate AI Content", data: "generate-content" },
          { type: "action", label: "Create Content Series", data: "create-series" },
          { type: "action", label: "Generate Hashtags", data: "generate-hashtags" },
        ],
      }
    }

    // Analytics queries
    if (
      lowerInput.includes("analytics") ||
      lowerInput.includes("performance") ||
      lowerInput.includes("how did") ||
      lowerInput.includes("stats")
    ) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "I'll analyze your content performance right now! Your recent metrics show strong engagement with AI-related content. Let me get you detailed insights and recommendations.",
        timestamp: new Date(),
        actions: [
          { type: "action", label: "Full Performance Analysis", data: "analyze-performance" },
          { type: "action", label: "Generate Report", data: "performance-report" },
          { type: "view", label: "View Analytics Dashboard", data: "analytics" },
        ],
      }
    }

    // Scheduling queries
    if (
      lowerInput.includes("schedule") ||
      lowerInput.includes("post") ||
      lowerInput.includes("when") ||
      lowerInput.includes("optimal")
    ) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "I can help optimize your posting schedule! Let me analyze your audience engagement patterns and suggest the best times to post for maximum reach.",
        timestamp: new Date(),
        actions: [
          { type: "action", label: "Optimize Posting Times", data: "optimize-posting" },
          { type: "action", label: "Bulk Schedule Posts", data: "bulk-schedule" },
          { type: "view", label: "Open Calendar", data: "calendar" },
        ],
      }
    }

    // Team queries
    if (lowerInput.includes("team") || lowerInput.includes("collaborate") || lowerInput.includes("approval")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "I'll check your team's current status and collaboration metrics. Let me gather insights about pending approvals, team performance, and workflow efficiency.",
        timestamp: new Date(),
        actions: [
          { type: "action", label: "Team Insights", data: "team-insights" },
          { type: "view", label: "Team Dashboard", data: "team" },
          { type: "action", label: "Review Approvals", data: "review-approvals" },
        ],
      }
    }

    // Recommendations queries
    if (lowerInput.includes("recommend") || lowerInput.includes("suggest") || lowerInput.includes("ideas")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "I'll provide personalized content recommendations based on your performance data and trending topics in your industry. Let me analyze what's working best for you.",
        timestamp: new Date(),
        actions: [
          { type: "action", label: "Content Recommendations", data: "content-recommendations" },
          { type: "action", label: "Trending Topics", data: "trending-topics" },
          { type: "view", label: "Content Discovery", data: "discovery" },
        ],
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: "assistant",
      content:
        "I can help you with content creation, performance analysis, scheduling optimization, team collaboration, and strategic recommendations. What would you like to work on?",
      timestamp: new Date(),
      actions: [
        { type: "action", label: "Generate Content", data: "generate-content" },
        { type: "action", label: "Analyze Performance", data: "analyze-performance" },
        { type: "action", label: "Optimize Strategy", data: "optimize-posting" },
        { type: "view", label: "View Dashboard", data: "dashboard" },
      ],
    }
  }

  const handleActionClick = async (action: { type: string; label: string; data?: any }) => {
    if (action.type === "view" && onViewChange) {
      onViewChange(action.data)
      setIsOpen(false)
      return
    }

    if (action.type === "action") {
      // Show execution message
      const executionMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: `Executing: ${action.label}...`,
        timestamp: new Date(),
        isExecuting: true,
      }

      setMessages((prev) => [...prev, executionMessage])

      try {
        let result
        switch (action.data) {
          case "generate-content":
            result = await aiActions.executeAction("generate-content", {
              topic: "AI in Content Creation",
              platform: "both",
            })
            break
          case "analyze-performance":
            result = await aiActions.executeAction("analyze-performance")
            break
          case "optimize-posting":
            result = await aiActions.executeAction("optimize-posting")
            break
          case "create-series":
            result = await aiActions.executeAction("create-content-series", { topic: "AI Series", count: 5 })
            break
          case "generate-hashtags":
            result = await aiActions.executeAction("generate-hashtags", {
              content: "AI and content creation",
              platform: "both",
            })
            break
          case "performance-report":
            result = await aiActions.executeAction("performance-report", { period: "last-month" })
            break
          case "content-recommendations":
            result = await aiActions.executeAction("content-recommendations")
            break
          case "team-insights":
            result = await aiActions.executeAction("team-insights")
            break
          default:
            result = { message: "Action completed successfully!" }
        }

        // Update the execution message with results
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === executionMessage.id
              ? {
                  ...msg,
                  content: formatActionResult(action.data, result),
                  isExecuting: false,
                  executionResult: result,
                  actions: getFollowUpActions(action.data, result),
                }
              : msg,
          ),
        )
      } catch (error) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === executionMessage.id
              ? {
                  ...msg,
                  content: `Error executing ${action.label}: ${error}`,
                  isExecuting: false,
                }
              : msg,
          ),
        )
      }
    }
  }

  const formatActionResult = (actionType: string, result: any): string => {
    switch (actionType) {
      case "generate-content":
        return `✅ Content generated successfully!\n\n**Title:** ${result.title}\n**Platform:** ${result.platform}\n**Content:** ${result.content.substring(0, 150)}...\n\n**Hashtags:** ${result.hashtags?.join(", ")}`

      case "analyze-performance":
        return `📊 Performance analysis complete!\n\n${result.insights
          .map(
            (insight: any) =>
              `**${insight.metric}:** ${insight.value}${typeof insight.value === "number" && insight.value > 100 ? "" : "%"} (${insight.trend === "up" ? "📈" : insight.trend === "down" ? "📉" : "➡️"})\n${insight.recommendation}`,
          )
          .join("\n\n")}`

      case "optimize-posting":
        return `⏰ Optimal posting times identified!\n\n${result.recommendations
          .map((rec: any) => `**${rec.day}** at **${rec.time}** - ${rec.engagement}% avg engagement`)
          .join("\n")}`

      case "create-series":
        return `📚 Content series created!\n\n**${result.series.length} posts** scheduled:\n${result.series
          .map((post: any, i: number) => `${i + 1}. ${post.title}`)
          .join("\n")}`

      case "generate-hashtags":
        return `🏷️ Hashtags generated!\n\n**Recommended hashtags:**\n${result.hashtags.join(", ")}`

      case "performance-report":
        return `📈 Performance report generated!\n\n**Period:** ${result.report.period}\n**Total Posts:** ${result.report.totalPosts}\n**Avg Engagement:** ${result.report.avgEngagement}%\n**Growth:** ${result.report.growth}\n**Top Performer:** ${result.report.topPerformer}`

      case "content-recommendations":
        return `💡 Content recommendations ready!\n\n${result.recommendations
          .map((rec: any) => `**${rec.topic}** (${rec.potential}% potential)\n${rec.reason}`)
          .join("\n\n")}`

      case "team-insights":
        return `👥 Team insights gathered!\n\n**Team Members:** ${result.insights.totalMembers}\n**Active Collaborations:** ${result.insights.activeCollaborations}\n**Pending Approvals:** ${result.insights.pendingApprovals}\n**Top Contributor:** ${result.insights.topContributor}\n**Team Efficiency:** ${result.insights.teamEfficiency}%`

      default:
        return "✅ Action completed successfully!"
    }
  }

  const getFollowUpActions = (actionType: string, result: any): Array<{ type: string; label: string; data?: any }> => {
    switch (actionType) {
      case "generate-content":
        return [
          { type: "view", label: "Edit in Editor", data: "editor" },
          { type: "action", label: "Schedule Post", data: "schedule-post" },
          { type: "action", label: "Generate More", data: "generate-content" },
        ]

      case "analyze-performance":
        return [
          { type: "view", label: "Full Analytics", data: "analytics" },
          { type: "action", label: "Get Recommendations", data: "content-recommendations" },
          { type: "action", label: "Optimize Posting", data: "optimize-posting" },
        ]

      case "optimize-posting":
        return [
          { type: "view", label: "Open Calendar", data: "calendar" },
          { type: "action", label: "Bulk Schedule", data: "bulk-schedule" },
          { type: "view", label: "Advanced Scheduler", data: "scheduler" },
        ]

      default:
        return [
          { type: "action", label: "Generate More Content", data: "generate-content" },
          { type: "view", label: "View Dashboard", data: "dashboard" },
        ]
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-premium-xl 
          hover-lift transition-premium magnetic-hover animate-float bg-primary hover:bg-primary/90
          ${isOpen ? "rotate-180" : ""}
        `}
        style={{ animationDelay: "1s" }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Interface */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-40 w-96 h-[500px] shadow-premium-xl glass-effect-strong border animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              ContentOS AI Assistant
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col h-[400px] p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                        {message.isExecuting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                    )}

                    <div className={`max-w-[280px] ${message.type === "user" ? "order-1" : ""}`}>
                      <div
                        className={`
                          p-3 rounded-lg text-sm leading-relaxed whitespace-pre-line
                          ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : message.isExecuting
                                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        {message.content}
                      </div>

                      {message.actions && !message.isExecuting && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleActionClick(action)}
                              className="text-xs h-7 glass-effect hover-lift transition-premium"
                            >
                              {action.type === "view" && <Calendar className="h-3 w-3 mr-1" />}
                              {action.type === "action" && <Sparkles className="h-3 w-3 mr-1" />}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}

                      {message.executionResult && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}

                      <div className="text-xs text-muted-foreground mt-1 opacity-60">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>

                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me to create content, analyze data, or optimize your strategy..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 glass-effect"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="hover-lift transition-premium"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputValue("Generate content about AI trends")}
                  className="text-xs glass-effect hover-lift transition-premium"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Generate Content
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputValue("Analyze my performance")}
                  className="text-xs glass-effect hover-lift transition-premium"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Analyze Performance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
