export interface AIAction {
  type: string
  data?: any
  callback?: (result: any) => void
}

export interface ContentData {
  title: string
  content: string
  platform: "twitter" | "linkedin" | "both"
  scheduledDate?: Date
  hashtags?: string[]
}

export interface AnalyticsInsight {
  metric: string
  value: number
  trend: "up" | "down" | "stable"
  recommendation: string
}

export class AIActionsService {
  private static instance: AIActionsService
  private actionCallbacks: Map<string, Function> = new Map()

  static getInstance(): AIActionsService {
    if (!AIActionsService.instance) {
      AIActionsService.instance = new AIActionsService()
    }
    return AIActionsService.instance
  }

  registerCallback(action: string, callback: Function) {
    this.actionCallbacks.set(action, callback)
  }

  async executeAction(action: string, data?: any): Promise<any> {
    console.log(`[v0] AI executing action: ${action}`, data)

    switch (action) {
      case "generate-content":
        return this.generateContent(data)
      case "optimize-posting":
        return this.optimizePostingTimes(data)
      case "analyze-performance":
        return this.analyzePerformance(data)
      case "schedule-post":
        return this.schedulePost(data)
      case "generate-hashtags":
        return this.generateHashtags(data)
      case "create-content-series":
        return this.createContentSeries(data)
      case "bulk-schedule":
        return this.bulkSchedule(data)
      case "performance-report":
        return this.generatePerformanceReport(data)
      case "content-recommendations":
        return this.getContentRecommendations(data)
      case "team-insights":
        return this.getTeamInsights(data)
      default:
        // Try registered callbacks
        const callback = this.actionCallbacks.get(action)
        if (callback) {
          return callback(data)
        }
        throw new Error(`Unknown action: ${action}`)
    }
  }

  private async generateContent(data: { topic?: string; platform?: string; tone?: string }): Promise<ContentData> {
    // Simulate AI content generation
    await this.delay(2000)

    const topics = [
      "The Future of AI in Content Creation",
      "Building Authentic Brand Connections",
      "Social Media Trends for 2024",
      "Behind the Scenes: Our Development Process",
      "Customer Success Stories That Inspire",
    ]

    const contents = {
      "The Future of AI in Content Creation": {
        twitter:
          "AI is revolutionizing how we create content. From ideation to optimization, AI tools are becoming essential for content creators. What's your experience with AI-powered content? #AI #ContentCreation #Innovation",
        linkedin:
          "The landscape of content creation is rapidly evolving with AI at the forefront. We're seeing unprecedented capabilities in generating ideas, optimizing for engagement, and personalizing content at scale. As content creators, embracing these tools while maintaining authenticity is key to staying competitive. What AI tools have transformed your content strategy?",
      },
    }

    const topic = data.topic || topics[Math.floor(Math.random() * topics.length)]
    const platform = data.platform || "both"

    return {
      title: topic,
      content:
        contents[topic as keyof typeof contents]?.[platform as keyof (typeof contents)[typeof topic]] ||
        `Generated content about ${topic}`,
      platform: platform as "twitter" | "linkedin" | "both",
      hashtags: ["#AI", "#ContentCreation", "#SocialMedia"],
    }
  }

  private async optimizePostingTimes(
    data?: any,
  ): Promise<{ recommendations: Array<{ day: string; time: string; engagement: number }> }> {
    await this.delay(1500)

    return {
      recommendations: [
        { day: "Tuesday", time: "1:00 PM", engagement: 92 },
        { day: "Thursday", time: "3:00 PM", engagement: 95 },
        { day: "Friday", time: "10:00 AM", engagement: 88 },
        { day: "Wednesday", time: "11:00 AM", engagement: 85 },
      ],
    }
  }

  private async analyzePerformance(data?: any): Promise<{ insights: AnalyticsInsight[] }> {
    await this.delay(2000)

    return {
      insights: [
        {
          metric: "Engagement Rate",
          value: 8.4,
          trend: "up",
          recommendation:
            "Your engagement is trending upward. Continue focusing on interactive content and behind-the-scenes posts.",
        },
        {
          metric: "Reach",
          value: 15200,
          trend: "up",
          recommendation: "Reach has increased 8.2%. Consider expanding to new hashtags to maintain growth.",
        },
        {
          metric: "Best Content Type",
          value: 94,
          trend: "stable",
          recommendation:
            "AI and tech content performs best (94% engagement). Create more educational content in this niche.",
        },
      ],
    }
  }

  private async schedulePost(data: { content: string; date: Date; platform: string }): Promise<{
    success: boolean
    postId: string
  }> {
    await this.delay(1000)

    return {
      success: true,
      postId: `post_${Date.now()}`,
    }
  }

  private async generateHashtags(data: { content: string; platform: string }): Promise<{ hashtags: string[] }> {
    await this.delay(800)

    const hashtagSets = {
      ai: ["#AI", "#MachineLearning", "#Innovation", "#TechTrends", "#FutureOfWork"],
      content: ["#ContentCreation", "#SocialMedia", "#Marketing", "#DigitalStrategy", "#Branding"],
      business: ["#Business", "#Entrepreneurship", "#Leadership", "#Growth", "#Strategy"],
      tech: ["#Technology", "#Development", "#Programming", "#Software", "#Innovation"],
    }

    // Simple keyword matching for demo
    const content = data.content.toLowerCase()
    let selectedHashtags: string[] = []

    if (content.includes("ai") || content.includes("artificial")) {
      selectedHashtags = hashtagSets.ai
    } else if (content.includes("content") || content.includes("social")) {
      selectedHashtags = hashtagSets.content
    } else if (content.includes("business") || content.includes("strategy")) {
      selectedHashtags = hashtagSets.business
    } else {
      selectedHashtags = hashtagSets.tech
    }

    return {
      hashtags: selectedHashtags.slice(0, 5),
    }
  }

  private async createContentSeries(data: { topic: string; count: number }): Promise<{ series: ContentData[] }> {
    await this.delay(3000)

    const seriesTemplates = {
      "AI Series": [
        "Introduction to AI in Content Creation",
        "AI Tools Every Creator Should Know",
        "The Ethics of AI-Generated Content",
        "Measuring AI Content Performance",
        "Future Predictions for AI and Creativity",
      ],
    }

    const templates = seriesTemplates["AI Series"]
    const series = templates.slice(0, data.count).map((title, index) => ({
      title,
      content: `Part ${index + 1}: ${title} - Comprehensive guide coming soon...`,
      platform: "both" as const,
      scheduledDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000),
      hashtags: ["#AI", "#ContentSeries", "#Education"],
    }))

    return { series }
  }

  private async bulkSchedule(data: { posts: ContentData[] }): Promise<{ scheduled: number; failed: number }> {
    await this.delay(2500)

    return {
      scheduled: data.posts.length,
      failed: 0,
    }
  }

  private async generatePerformanceReport(data: { period: string }): Promise<{ report: any }> {
    await this.delay(2000)

    return {
      report: {
        period: data.period,
        totalPosts: 42,
        avgEngagement: 8.4,
        topPerformer: "AI in Content Creation",
        growth: "+12.5%",
        recommendations: [
          "Continue focusing on AI and tech content",
          "Post more frequently on Tuesday and Thursday",
          "Increase video content by 20%",
        ],
      },
    }
  }

  private async getContentRecommendations(
    data?: any,
  ): Promise<{ recommendations: Array<{ topic: string; reason: string; potential: number }> }> {
    await this.delay(1500)

    return {
      recommendations: [
        {
          topic: "AI Tool Reviews",
          reason: "Your AI content has 94% engagement rate",
          potential: 95,
        },
        {
          topic: "Behind the Scenes",
          reason: "Personal content increases authenticity",
          potential: 88,
        },
        {
          topic: "Industry Predictions",
          reason: "Thought leadership content performs well",
          potential: 91,
        },
      ],
    }
  }

  private async getTeamInsights(data?: any): Promise<{ insights: any }> {
    await this.delay(1200)

    return {
      insights: {
        totalMembers: 5,
        activeCollaborations: 3,
        pendingApprovals: 2,
        topContributor: "Sarah Johnson",
        teamEfficiency: 94,
      },
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const aiActions = AIActionsService.getInstance()
