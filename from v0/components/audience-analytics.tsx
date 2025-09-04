"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  Globe,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  UserPlus,
  Target,
  BarChart3,
} from "lucide-react"

export function AudienceAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  const audienceMetrics = {
    totalFollowers: 12847,
    growthRate: 8.3,
    engagementRate: 4.2,
    reachRate: 15.6,
    activeFollowers: 8934,
    newFollowers: 234,
  }

  const demographics = [
    { age: "18-24", percentage: 28, count: 3597 },
    { age: "25-34", percentage: 42, count: 5396 },
    { age: "35-44", percentage: 20, count: 2569 },
    { age: "45-54", percentage: 7, count: 899 },
    { age: "55+", percentage: 3, count: 386 },
  ]

  const topLocations = [
    { country: "United States", percentage: 35, count: 4496 },
    { country: "United Kingdom", percentage: 18, count: 2312 },
    { country: "Canada", percentage: 12, count: 1542 },
    { country: "Australia", percentage: 8, count: 1028 },
    { country: "Germany", percentage: 6, count: 771 },
    { country: "Others", percentage: 21, count: 2698 },
  ]

  const engagementPatterns = [
    { time: "6 AM", engagement: 12 },
    { time: "9 AM", engagement: 28 },
    { time: "12 PM", engagement: 45 },
    { time: "3 PM", engagement: 62 },
    { time: "6 PM", engagement: 78 },
    { time: "9 PM", engagement: 85 },
    { time: "12 AM", engagement: 34 },
  ]

  const contentPreferences = [
    { type: "Educational", engagement: 92, posts: 12 },
    { type: "Behind the Scenes", engagement: 87, posts: 8 },
    { type: "Industry News", engagement: 76, posts: 15 },
    { type: "Personal Stories", engagement: 71, posts: 6 },
    { type: "Product Updates", engagement: 68, posts: 10 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Audience Analytics</h1>
          <p className="text-zinc-400">Deep insights into your audience behavior and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedTimeframe === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTimeframe("7d")}
            className={
              selectedTimeframe === "7d"
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
            }
          >
            7D
          </Button>
          <Button
            variant={selectedTimeframe === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTimeframe("30d")}
            className={
              selectedTimeframe === "30d"
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
            }
          >
            30D
          </Button>
          <Button
            variant={selectedTimeframe === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTimeframe("90d")}
            className={
              selectedTimeframe === "90d"
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
            }
          >
            90D
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-zinc-800 border-zinc-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{audienceMetrics.totalFollowers.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{audienceMetrics.growthRate}%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{audienceMetrics.engagementRate}%</div>
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+0.8%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">New Followers</CardTitle>
            <UserPlus className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{audienceMetrics.newFollowers}</div>
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <span>This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="demographics" className="space-y-6">
        <TabsList className="glass-effect">
          <TabsTrigger
            value="demographics"
            className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-premium"
          >
            Demographics
          </TabsTrigger>
          <TabsTrigger
            value="engagement"
            className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-premium"
          >
            Engagement
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-premium"
          >
            Content
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-premium"
          >
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Demographics */}
            <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Age Distribution</CardTitle>
                <CardDescription className="text-zinc-400">Breakdown of your audience by age groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demographics.map((demo) => (
                  <div key={demo.age} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">{demo.age}</span>
                      <span className="text-zinc-400">
                        {demo.percentage}% ({demo.count.toLocaleString()})
                      </span>
                    </div>
                    <Progress value={demo.percentage} className="h-2 bg-zinc-700" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Top Locations</CardTitle>
                <CardDescription className="text-zinc-400">Where your audience is located</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topLocations.map((location) => (
                  <div key={location.country} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">{location.country}</span>
                      <span className="text-zinc-400">
                        {location.percentage}% ({location.count.toLocaleString()})
                      </span>
                    </div>
                    <Progress value={location.percentage} className="h-2 bg-zinc-700" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Patterns */}
            <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Daily Engagement Pattern</CardTitle>
                <CardDescription className="text-zinc-400">When your audience is most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagementPatterns.map((pattern) => (
                    <div key={pattern.time} className="flex items-center gap-4">
                      <div className="w-12 text-sm text-zinc-400">{pattern.time}</div>
                      <div className="flex-1">
                        <Progress value={pattern.engagement} className="h-3 bg-zinc-700" />
                      </div>
                      <div className="w-8 text-sm text-white">{pattern.engagement}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Engagement Breakdown</CardTitle>
                <CardDescription className="text-zinc-400">How your audience interacts with content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-lg border border-zinc-600">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-white">Likes</span>
                  </div>
                  <span className="font-semibold text-white">2,847</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-lg border border-zinc-600">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-white">Comments</span>
                  </div>
                  <span className="font-semibold text-white">432</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-lg border border-zinc-600">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-green-500" />
                    <span className="text-white">Shares</span>
                  </div>
                  <span className="font-semibold text-white">189</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-lg border border-zinc-600">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span className="text-white">Views</span>
                  </div>
                  <span className="font-semibold text-white">15,234</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Content Performance by Type</CardTitle>
              <CardDescription className="text-zinc-400">
                Which content types resonate most with your audience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentPreferences.map((content) => (
                <div key={content.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{content.type}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-zinc-700 text-zinc-200 border-zinc-600">
                        {content.posts} posts
                      </Badge>
                      <span className="text-sm text-zinc-400">{content.engagement}% avg engagement</span>
                    </div>
                  </div>
                  <Progress value={content.engagement} className="h-2 bg-zinc-700" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Key Insights</CardTitle>
                <CardDescription className="text-zinc-400">
                  AI-powered recommendations for your content strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Optimal Posting Time</h4>
                      <p className="text-sm text-zinc-400">
                        Your audience is most active between 6-9 PM. Consider scheduling more content during this
                        window.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Growing Segment</h4>
                      <p className="text-sm text-zinc-400">
                        25-34 age group shows highest engagement. Focus on content that appeals to this demographic.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Content Strategy</h4>
                      <p className="text-sm text-zinc-400">
                        Educational content performs 23% better than average. Increase educational post frequency.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Growth Opportunities</CardTitle>
                <CardDescription className="text-zinc-400">Areas to focus on for audience expansion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Geographic Expansion</h4>
                      <p className="text-sm text-zinc-400">
                        Consider targeting France and Netherlands - similar demographics to your top-performing regions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Posting Frequency</h4>
                      <p className="text-sm text-zinc-400">
                        Increase posting frequency by 20% to maintain engagement momentum with growing audience.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-cyan-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Community Building</h4>
                      <p className="text-sm text-zinc-400">
                        High comment engagement suggests strong community. Consider hosting live Q&A sessions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
