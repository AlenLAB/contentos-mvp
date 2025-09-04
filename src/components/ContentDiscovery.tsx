"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Sparkles,
  BookOpen,
  Hash,
  ImageIcon,
  TrendingUp,
  Copy,
  Heart,
  Share2,
  Eye,
  Star,
  Filter,
  Download,
  Plus,
  Lightbulb,
  Target,
  Zap,
  MessageCircle,
} from "lucide-react"

export function ContentDiscovery() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndustry, setSelectedIndustry] = useState("tech")

  // Mock data for smart templates
  const smartTemplates = [
    {
      id: "1",
      title: "AI Announcement Template",
      description: "High-performing template for AI product launches",
      performance: 94,
      usage: 156,
      category: "announcement",
      preview: "🚀 Excited to announce our latest AI breakthrough...",
      metrics: { engagement: 8.4, reach: 15200, shares: 342 },
    },
    {
      id: "2",
      title: "Behind-the-Scenes Story",
      description: "Personal storytelling format that drives engagement",
      performance: 87,
      usage: 203,
      category: "storytelling",
      preview: "Here's what happened behind the scenes when we...",
      metrics: { engagement: 7.2, reach: 12800, shares: 289 },
    },
    {
      id: "3",
      title: "Industry Insight Thread",
      description: "Multi-part content series for thought leadership",
      performance: 91,
      usage: 128,
      category: "education",
      preview: "🧵 Thread: 5 trends shaping the future of...",
      metrics: { engagement: 9.1, reach: 18500, shares: 456 },
    },
    {
      id: "4",
      title: "Question Engagement Post",
      description: "Interactive format that boosts comments",
      performance: 76,
      usage: 89,
      category: "engagement",
      preview: "Quick question for my network: What's your take on...",
      metrics: { engagement: 6.8, reach: 9800, shares: 167 },
    },
  ]

  // Mock data for content library
  const contentLibrary = [
    {
      id: "1",
      type: "snippet",
      title: "AI Ethics Opening",
      content: "As AI continues to reshape our world, it's crucial we address the ethical implications...",
      tags: ["AI", "Ethics", "Technology"],
      usage: 45,
    },
    {
      id: "2",
      type: "hashtag-set",
      title: "Tech Innovation Set",
      content: "#AI #Innovation #TechTrends #FutureOfWork #DigitalTransformation",
      tags: ["Technology", "Innovation"],
      usage: 78,
    },
    {
      id: "3",
      type: "snippet",
      title: "Call-to-Action Closer",
      content: "What are your thoughts? Share your experience in the comments below! 👇",
      tags: ["CTA", "Engagement"],
      usage: 156,
    },
    {
      id: "4",
      type: "media",
      title: "Tech Gradient Background",
      content: "Premium gradient background for tech content",
      tags: ["Design", "Background"],
      usage: 23,
    },
  ]

  // Mock data for trending content
  const trendingContent = [
    {
      id: "1",
      title: "The Rise of AI Agents in 2024",
      author: "Sarah Chen",
      platform: "LinkedIn",
      engagement: 2400,
      trend: "rising",
      category: "AI",
      preview: "AI agents are becoming the new frontier in automation...",
      metrics: { likes: 1200, comments: 340, shares: 860 },
    },
    {
      id: "2",
      title: "Remote Work Culture Evolution",
      author: "Marcus Rodriguez",
      platform: "Twitter",
      engagement: 1800,
      trend: "hot",
      category: "Work Culture",
      preview: "The way we think about remote work has fundamentally changed...",
      metrics: { likes: 890, comments: 245, shares: 665 },
    },
    {
      id: "3",
      title: "Sustainable Tech Practices",
      author: "Emma Thompson",
      platform: "LinkedIn",
      engagement: 3200,
      trend: "viral",
      category: "Sustainability",
      preview: "Here's how tech companies are reducing their carbon footprint...",
      metrics: { likes: 1800, comments: 520, shares: 880 },
    },
  ]

  const inspirationFeed = [
    {
      id: "1",
      type: "insight",
      title: "Content Format Trending",
      description: "Carousel posts are seeing 40% higher engagement this week",
      action: "Create Carousel",
      icon: TrendingUp,
      color: "#10b981",
    },
    {
      id: "2",
      type: "opportunity",
      title: "Optimal Posting Window",
      description: "Your audience is most active in 2 hours - perfect time to post",
      action: "Schedule Now",
      icon: Target,
      color: "#3b82f6",
    },
    {
      id: "3",
      type: "suggestion",
      title: "Trending Topic Alert",
      description: "#AIEthics is trending in your industry - consider joining the conversation",
      action: "Create Post",
      icon: Lightbulb,
      color: "#f59e0b",
    },
  ]

  const filteredTemplates = smartTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredLibrary = contentLibrary.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-xl px-6 py-6 shadow-premium">
        <div className="flex items-center justify-between">
          <div className="space-premium-xs">
            <h1 className="text-foreground flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              Content Discovery
            </h1>
            <p className="text-base text-muted-foreground font-medium">
              Smart templates, inspiration, and content library
            </p>
          </div>
          <Button className="glass-effect hover-lift transition-premium">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-premium-xl">
          {/* Inspiration Feed */}
          <Card className="glass-effect hover-lift transition-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Smart Insights & Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {inspirationFeed.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 rounded-lg border glass-effect hover-lift transition-premium cursor-pointer"
                    >
                      <div className="rounded-lg p-2.5 flex-shrink-0" style={{ backgroundColor: `${item.color}20` }}>
                        <Icon className="h-5 w-5" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 space-premium-xs">
                        <h4 className="font-semibold text-card-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          {item.action}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content Discovery Tabs */}
          <Tabs defaultValue="templates" className="space-premium-lg">
            <TabsList className="glass-effect">
              <TabsTrigger value="templates" className="transition-premium">
                Smart Templates
              </TabsTrigger>
              <TabsTrigger value="library" className="transition-premium">
                Content Library
              </TabsTrigger>
              <TabsTrigger value="trending" className="transition-premium">
                Trending Content
              </TabsTrigger>
            </TabsList>

            {/* Smart Templates Tab */}
            <TabsContent value="templates" className="space-premium-lg">
              {/* Search and Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="announcement">Announcements</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template, index) => (
                  <Card
                    key={template.id}
                    className="glass-effect hover-lift transition-premium cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-1">{template.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <Badge variant="outline" className="text-xs">
                            {template.performance}%
                          </Badge>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-premium-sm">
                      <div className="bg-muted/30 rounded-md p-3 mb-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{template.preview}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {template.metrics.reach.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {template.metrics.engagement}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="h-3 w-3" />
                            {template.metrics.shares}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" className="flex-1">
                          <Copy className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">Used {template.usage} times this month</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Content Library Tab */}
            <TabsContent value="library" className="space-premium-lg">
              {/* Search */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search library..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Library
                </Button>
              </div>

              {/* Library Items */}
              <div className="space-premium-md">
                {filteredLibrary.map((item, index) => (
                  <Card
                    key={item.id}
                    className="glass-effect hover-lift transition-premium cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="rounded-lg p-2.5 bg-primary/10">
                            {item.type === "snippet" && <BookOpen className="h-5 w-5 text-primary" />}
                            {item.type === "hashtag-set" && <Hash className="h-5 w-5 text-primary" />}
                            {item.type === "media" && <ImageIcon className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="flex-1 space-premium-xs">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-card-foreground">{item.title}</h4>
                              <Badge variant="outline" className="text-xs capitalize">
                                {item.type.replace("-", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs text-muted-foreground">{item.usage} uses</span>
                          <Button size="sm" variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Trending Content Tab */}
            <TabsContent value="trending" className="space-premium-lg">
              {/* Industry Filter */}
              <div className="flex items-center gap-4 mb-6">
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trending Content */}
              <div className="space-premium-md">
                {trendingContent.map((content, index) => (
                  <Card
                    key={content.id}
                    className="glass-effect hover-lift transition-premium cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-premium-sm">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg text-card-foreground">{content.title}</h3>
                            <Badge
                              variant={
                                content.trend === "viral"
                                  ? "destructive"
                                  : content.trend === "hot"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {content.trend}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>by {content.author}</span>
                            <Badge variant="outline">{content.platform}</Badge>
                            <Badge variant="outline">{content.category}</Badge>
                          </div>
                          <p className="text-muted-foreground">{content.preview}</p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {content.metrics.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {content.metrics.comments}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="h-4 w-4" />
                              {content.metrics.shares}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Inspire Me
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
