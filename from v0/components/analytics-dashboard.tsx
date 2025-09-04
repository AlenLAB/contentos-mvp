"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card3D } from "@/components/ui/card-3d"
import { MiniGrowthChart } from "@/components/ui/mini-growth-chart"
import {
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Target,
  Clock,
  Users,
  BarChart3,
  LucidePieChart,
  Activity,
  Zap,
  Flame,
  Award,
  AlertTriangle,
  Hash,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  ComposedChart,
  Bar,
} from "recharts"

export function AnalyticsDashboard() {
  // Mock analytics data
  const performanceMetrics = [
    {
      name: "Engagement Rate",
      value: 8.4,
      change: +12.5,
      icon: Heart,
      color: "#ef4444",
      chartData: [{ value: 6.2 }, { value: 6.8 }, { value: 7.1 }, { value: 7.8 }, { value: 8.4 }],
      trend: "up" as const,
    },
    {
      name: "Reach",
      value: 15200,
      change: +8.2,
      icon: Eye,
      color: "#3b82f6",
      chartData: [{ value: 12800 }, { value: 13200 }, { value: 14100 }, { value: 14800 }, { value: 15200 }],
      trend: "up" as const,
    },
    {
      name: "Click-through Rate",
      value: 3.2,
      change: -2.1,
      icon: Target,
      color: "#10b981",
      chartData: [{ value: 3.8 }, { value: 3.6 }, { value: 3.4 }, { value: 3.3 }, { value: 3.2 }],
      trend: "down" as const,
    },
    {
      name: "Share Rate",
      value: 1.8,
      change: +15.3,
      icon: Share2,
      color: "#f59e0b",
      chartData: [{ value: 1.2 }, { value: 1.4 }, { value: 1.5 }, { value: 1.7 }, { value: 1.8 }],
      trend: "up" as const,
    },
  ]

  const engagementData = [
    { day: "Mon", likes: 120, comments: 45, shares: 12, views: 890 },
    { day: "Tue", likes: 180, comments: 62, shares: 18, views: 1200 },
    { day: "Wed", likes: 240, comments: 78, shares: 25, views: 1450 },
    { day: "Thu", likes: 190, comments: 55, shares: 20, views: 1100 },
    { day: "Fri", likes: 280, comments: 95, shares: 35, views: 1680 },
    { day: "Sat", likes: 320, comments: 110, shares: 42, views: 1890 },
    { day: "Sun", likes: 260, comments: 85, shares: 30, views: 1520 },
  ]

  const platformData = [
    { name: "LinkedIn", value: 45, color: "#0077b5" },
    { name: "Twitter", value: 35, color: "#1da1f2" },
    { name: "Instagram", value: 20, color: "#e4405f" },
  ]

  const contentPerformance = [
    { title: "AI in Content Creation", engagement: 94, reach: 15200, platform: "LinkedIn" },
    { title: "Social Media Strategies", engagement: 87, reach: 12800, platform: "Twitter" },
    { title: "Brand Storytelling", engagement: 91, reach: 14500, platform: "LinkedIn" },
    { title: "Visual Content Design", engagement: 76, reach: 9800, platform: "Instagram" },
  ]

  const optimalTimes = [
    { time: "9:00 AM", engagement: 85, day: "Monday" },
    { time: "1:00 PM", engagement: 92, day: "Tuesday" },
    { time: "11:00 AM", engagement: 88, day: "Wednesday" },
    { time: "3:00 PM", engagement: 95, day: "Thursday" },
    { time: "10:00 AM", engagement: 90, day: "Friday" },
  ]

  const engagementHeatmap = [
    { hour: "6AM", Mon: 20, Tue: 25, Wed: 30, Thu: 28, Fri: 35, Sat: 45, Sun: 40 },
    { hour: "9AM", Mon: 85, Tue: 80, Wed: 88, Thu: 92, Fri: 90, Sat: 65, Sun: 55 },
    { hour: "12PM", Mon: 75, Tue: 92, Wed: 85, Thu: 88, Fri: 82, Sat: 70, Sun: 60 },
    { hour: "3PM", Mon: 88, Tue: 85, Wed: 90, Thu: 95, Fri: 85, Sat: 75, Sun: 65 },
    { hour: "6PM", Mon: 70, Tue: 75, Wed: 78, Thu: 80, Fri: 88, Sat: 85, Sun: 80 },
    { hour: "9PM", Mon: 45, Tue: 50, Wed: 55, Thu: 60, Fri: 75, Sat: 90, Sun: 85 },
  ]

  const performanceInsights = [
    {
      type: "trending",
      title: "Viral Content Alert",
      description: "Your AI content post is trending with 340% above average engagement",
      icon: Flame,
      color: "#ef4444",
      severity: "high",
    },
    {
      type: "achievement",
      title: "Engagement Milestone",
      description: "You've reached 10K total engagements this month",
      icon: Award,
      color: "#10b981",
      severity: "success",
    },
    {
      type: "warning",
      title: "Declining Reach",
      description: "LinkedIn reach dropped 15% - consider posting at optimal times",
      icon: AlertTriangle,
      color: "#f59e0b",
      severity: "warning",
    },
    {
      type: "opportunity",
      title: "Best Posting Window",
      description: "Thursday 3PM shows highest engagement rates this week",
      icon: Clock,
      color: "#3b82f6",
      severity: "info",
    },
    {
      type: "historical",
      title: "September Performance",
      description: "Best month yet with 94% avg engagement, up 6% from August",
      icon: TrendingUp,
      color: "#10b981",
      severity: "success",
    },
    {
      type: "trend",
      title: "6-Month Growth Trend",
      description: "Consistent upward trajectory with 45% follower growth YoY",
      icon: ArrowUpRight,
      color: "#3b82f6",
      severity: "info",
    },
  ]

  const hashtagPerformance = [
    { tag: "#AI", usage: 12, engagement: 94, reach: 15200 },
    { tag: "#ContentCreation", usage: 8, engagement: 87, reach: 12800 },
    { tag: "#SocialMedia", usage: 15, engagement: 82, reach: 11500 },
    { tag: "#Marketing", usage: 10, engagement: 78, reach: 9800 },
    { tag: "#TechTrends", usage: 6, engagement: 91, reach: 13200 },
  ]

  const abTestResults = [
    {
      test: "Post Time Comparison",
      variantA: { name: "Morning (9AM)", performance: 85, sample: 1200 },
      variantB: { name: "Afternoon (3PM)", performance: 92, sample: 1150 },
      winner: "B",
      improvement: 8.2,
    },
    {
      test: "Content Length",
      variantA: { name: "Short Form", performance: 78, sample: 980 },
      variantB: { name: "Long Form", performance: 88, sample: 1020 },
      winner: "B",
      improvement: 12.8,
    },
  ]

  const historicalData = [
    { month: "Jan", posts: 28, engagement: 72, reach: 8500, growth: -2.1 },
    { month: "Feb", posts: 32, engagement: 78, reach: 9800, growth: 15.3 },
    { month: "Mar", posts: 35, engagement: 82, reach: 11200, growth: 14.3 },
    { month: "Apr", posts: 30, engagement: 85, reach: 12800, growth: 14.3 },
    { month: "May", posts: 38, engagement: 88, reach: 14500, growth: 13.3 },
    { month: "Jun", posts: 42, engagement: 91, reach: 16200, growth: 11.7 },
    { month: "Jul", posts: 45, engagement: 89, reach: 15800, growth: -2.5 },
    { month: "Aug", posts: 48, engagement: 92, reach: 17500, growth: 10.8 },
    { month: "Sep", posts: 44, engagement: 94, reach: 18200, growth: 4.0 },
  ]

  const yearOverYearComparison = [
    { metric: "Total Posts", thisYear: 342, lastYear: 298, change: 14.8 },
    { metric: "Avg Engagement", thisYear: 87.2, lastYear: 74.5, change: 17.0 },
    { metric: "Total Reach", thisYear: 145000, lastYear: 112000, change: 29.5 },
    { metric: "Follower Growth", thisYear: 2840, lastYear: 1950, change: 45.6 },
  ]

  const contentEvolution = [
    { period: "Q1 2023", topContent: "Tech Tutorials", avgEngagement: 72, bestPost: "AI Basics Guide" },
    { period: "Q2 2023", topContent: "Industry News", avgEngagement: 78, bestPost: "Future of Work" },
    { period: "Q3 2023", topContent: "Behind the Scenes", avgEngagement: 85, bestPost: "Team Spotlight" },
    { period: "Q4 2023", topContent: "Product Updates", avgEngagement: 91, bestPost: "Year in Review" },
  ]

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-xl px-6 py-6 shadow-premium">
        <div className="flex items-center justify-between">
          <div className="space-premium-xs">
            <h1 className="text-foreground flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-base text-muted-foreground font-medium">Performance insights and optimization</p>
          </div>
          <Button className="glass-effect hover-lift transition-premium">
            <Activity className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-premium-xl">
          {/* Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <Card3D
                  key={metric.name}
                  variant="standard"
                  className="animate-slide-up group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="glass-effect hover-lift transition-premium h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                        {metric.name}
                      </CardTitle>
                      <div
                        className="rounded-lg p-2.5 transition-premium group-hover:scale-110"
                        style={{ backgroundColor: `${metric.color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: metric.color }} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-premium-sm">
                      <div className="flex items-end justify-between mb-2">
                        <div className="text-3xl font-bold text-card-foreground tracking-tight">
                          {typeof metric.value === "number" && metric.value > 100
                            ? metric.value.toLocaleString()
                            : `${metric.value}${metric.name.includes("Rate") ? "%" : ""}`}
                        </div>
                        <MiniGrowthChart data={metric.chartData} trend={metric.trend} className="ml-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={metric.change > 0 ? "default" : "destructive"}
                          className={`text-xs font-medium ${
                            metric.change > 0 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : ""
                          }`}
                        >
                          {metric.change > 0 ? "+" : ""}
                          {metric.change}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">vs last week</span>
                      </div>
                    </CardContent>
                  </Card>
                </Card3D>
              )
            })}
          </div>

          {/* Year-over-Year Comparison Section */}
          <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Year-over-Year Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {yearOverYearComparison.map((item, index) => (
                    <Card3D
                      key={index}
                      variant="minimal"
                      className="p-4 rounded-lg border glass-effect hover-lift transition-premium"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">{item.metric}</span>
                        <div className="flex items-center gap-1">
                          {item.change > 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={`text-xs font-medium ${item.change > 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {item.change > 0 ? "+" : ""}
                            {item.change}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-card-foreground">
                          {typeof item.thisYear === "number" && item.thisYear > 1000
                            ? item.thisYear.toLocaleString()
                            : item.thisYear}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          vs{" "}
                          {typeof item.lastYear === "number" && item.lastYear > 1000
                            ? item.lastYear.toLocaleString()
                            : item.lastYear}{" "}
                          last year
                        </div>
                      </div>
                    </Card3D>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Card3D>

          {/* Performance Insights Section */}
          <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {performanceInsights.map((insight, index) => {
                    const Icon = insight.icon
                    return (
                      <Card3D
                        key={index}
                        variant="minimal"
                        className="flex items-start gap-4 p-4 rounded-lg border glass-effect hover-lift transition-premium cursor-pointer"
                      >
                        <div
                          className="rounded-lg p-2.5 flex-shrink-0"
                          style={{ backgroundColor: `${insight.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: insight.color }} />
                        </div>
                        <div className="flex-1 space-premium-xs">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-card-foreground">{insight.title}</h4>
                            <Badge
                              variant={
                                insight.severity === "high"
                                  ? "destructive"
                                  : insight.severity === "success"
                                    ? "default"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {insight.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                      </Card3D>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </Card3D>

          {/* Analytics Tabs */}
          <Tabs defaultValue="historical" className="space-premium-lg">
            <TabsList className="glass-effect">
              <TabsTrigger value="historical" className="transition-premium">
                Historical Trends
              </TabsTrigger>
              <TabsTrigger value="engagement" className="transition-premium">
                Engagement
              </TabsTrigger>
              <TabsTrigger value="content" className="transition-premium">
                Content Performance
              </TabsTrigger>
              <TabsTrigger value="timing" className="transition-premium">
                Optimal Timing
              </TabsTrigger>
              <TabsTrigger value="platforms" className="transition-premium">
                Platform Analysis
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="transition-premium">
                Engagement Heatmap
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="transition-premium">
                Hashtag Performance
              </TabsTrigger>
              <TabsTrigger value="abtesting" className="transition-premium">
                A/B Testing
              </TabsTrigger>
            </TabsList>

            {/* Historical Trends Tab */}
            <TabsContent value="historical" className="space-premium-lg">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Monthly Performance Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar yAxisId="left" dataKey="posts" fill="#3b82f620" stroke="#3b82f6" />
                          <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#ef4444" strokeWidth={3} />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="growth"
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Card3D>

                <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Content Evolution Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-premium-md">
                        {contentEvolution.map((period, index) => (
                          <Card3D
                            key={index}
                            variant="minimal"
                            className="flex items-start gap-4 p-4 rounded-lg border glass-effect hover-lift transition-premium"
                          >
                            <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div className="flex-1 space-premium-xs">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-card-foreground">{period.period}</h4>
                                <Badge variant="outline">{period.avgEngagement}% avg</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Top Content: {period.topContent}</p>
                              <p className="text-xs text-muted-foreground">Best Post: "{period.bestPost}"</p>
                            </div>
                          </Card3D>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Card3D>
              </div>
            </TabsContent>

            {/* Engagement Tab */}
            <TabsContent value="engagement" className="space-premium-lg">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Engagement Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={engagementData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Area type="monotone" dataKey="likes" stackId="1" stroke="#ef4444" fill="#ef444420" />
                          <Area type="monotone" dataKey="comments" stackId="1" stroke="#3b82f6" fill="#3b82f620" />
                          <Area type="monotone" dataKey="shares" stackId="1" stroke="#10b981" fill="#10b98120" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Card3D>

                <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        Views & Reach
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={engagementData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Card3D>
              </div>
            </TabsContent>

            {/* Content Performance Tab */}
            <TabsContent value="content" className="space-premium-lg">
              <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Top Performing Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-premium-md">
                      {contentPerformance.map((content, index) => (
                        <Card3D
                          key={index}
                          variant="minimal"
                          className="flex items-center justify-between p-4 rounded-lg border glass-effect hover-lift transition-premium cursor-pointer"
                        >
                          <div className="flex-1 space-premium-xs">
                            <p className="font-medium text-card-foreground">{content.title}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{content.reach.toLocaleString()} reach</span>
                              <Badge variant="outline">{content.platform}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-medium">{content.engagement}%</p>
                              <p className="text-xs text-muted-foreground">engagement</p>
                            </div>
                            <Progress value={content.engagement} className="w-20" />
                          </div>
                        </Card3D>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Card3D>
            </TabsContent>

            {/* Optimal Timing Tab */}
            <TabsContent value="timing" className="space-premium-lg">
              <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Optimal Posting Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {optimalTimes.map((time, index) => (
                        <Card3D
                          key={index}
                          variant="minimal"
                          className="p-4 rounded-lg border glass-effect hover-lift transition-premium cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-card-foreground">{time.day}</span>
                            <Badge variant="outline">{time.engagement}%</Badge>
                          </div>
                          <p className="text-2xl font-bold text-primary">{time.time}</p>
                          <Progress value={time.engagement} className="mt-2" />
                        </Card3D>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Card3D>
            </TabsContent>

            {/* Platform Analysis Tab */}
            <TabsContent value="platforms" className="space-premium-lg">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LucidePieChart className="h-5 w-5 text-primary" />
                        Platform Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie data={platformData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                            {platformData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Card3D>

                <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Platform Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-premium-md">
                        {platformData.map((platform, index) => (
                          <Card3D
                            key={index}
                            variant="minimal"
                            className="flex items-center justify-between p-3 rounded-lg border glass-effect hover-lift transition-premium"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: platform.color }} />
                              <span className="font-medium">{platform.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">{platform.value}%</span>
                              <Progress value={platform.value} className="w-20" />
                            </div>
                          </Card3D>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Card3D>
              </div>
            </TabsContent>

            {/* Engagement Heatmap Tab */}
            <TabsContent value="heatmap" className="space-premium-lg">
              <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Engagement Heatmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-premium-md">
                      <div className="grid grid-cols-8 gap-2 text-sm">
                        <div className="font-medium text-muted-foreground">Time</div>
                        <div className="font-medium text-muted-foreground text-center">Mon</div>
                        <div className="font-medium text-muted-foreground text-center">Tue</div>
                        <div className="font-medium text-muted-foreground text-center">Wed</div>
                        <div className="font-medium text-muted-foreground text-center">Thu</div>
                        <div className="font-medium text-muted-foreground text-center">Fri</div>
                        <div className="font-medium text-muted-foreground text-center">Sat</div>
                        <div className="font-medium text-muted-foreground text-center">Sun</div>

                        {engagementHeatmap.map((row, index) => (
                          <>
                            <div key={`hour-${index}`} className="font-medium text-muted-foreground py-2">
                              {row.hour}
                            </div>
                            {Object.entries(row)
                              .slice(1)
                              .map(([day, value]) => (
                                <div
                                  key={`${row.hour}-${day}`}
                                  className="h-10 rounded flex items-center justify-center text-xs font-medium transition-premium hover:scale-110 cursor-pointer"
                                  style={{
                                    backgroundColor: `hsl(${120 - (value as number) * 1.2}, 70%, ${50 + (value as number) * 0.3}%)`,
                                    color: (value as number) > 50 ? "white" : "black",
                                  }}
                                >
                                  {value}%
                                </div>
                              ))}
                          </>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
                        <span>Low Engagement</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className="w-3 h-3 rounded"
                              style={{
                                backgroundColor: `hsl(${120 - i * 12}, 70%, ${50 + i * 5}%)`,
                              }}
                            />
                          ))}
                        </div>
                        <span>High Engagement</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card3D>
            </TabsContent>

            {/* Hashtag Performance Tab */}
            <TabsContent value="hashtags" className="space-premium-lg">
              <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5 text-primary" />
                      Hashtag Performance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-premium-md">
                      {hashtagPerformance.map((hashtag, index) => (
                        <Card3D
                          key={index}
                          variant="minimal"
                          className="flex items-center justify-between p-4 rounded-lg border glass-effect hover-lift transition-premium cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="font-mono text-primary font-semibold">{hashtag.tag}</div>
                            <Badge variant="outline" className="text-xs">
                              {hashtag.usage} posts
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm font-medium">{hashtag.engagement}%</p>
                              <p className="text-xs text-muted-foreground">engagement</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{hashtag.reach.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">reach</p>
                            </div>
                            <Progress value={hashtag.engagement} className="w-24" />
                          </div>
                        </Card3D>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Card3D>
            </TabsContent>

            {/* A/B Testing Tab */}
            <TabsContent value="abtesting" className="space-premium-lg">
              <Card3D variant="standard" className="glass-effect hover-lift transition-premium">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      A/B Testing Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-premium-lg">
                      {abTestResults.map((test, index) => (
                        <Card3D
                          key={index}
                          variant="minimal"
                          className="p-6 rounded-lg border glass-effect hover-lift transition-premium"
                        >
                          <h4 className="font-semibold text-lg mb-4">{test.test}</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-premium-sm">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Variant A: {test.variantA.name}</span>
                                {test.winner === "A" && <Badge className="bg-green-500">Winner</Badge>}
                              </div>
                              <div className="flex items-center gap-4">
                                <Progress value={test.variantA.performance} className="flex-1" />
                                <span className="text-sm font-medium">{test.variantA.performance}%</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{test.variantA.sample} samples</p>
                            </div>
                            <div className="space-premium-sm">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Variant B: {test.variantB.name}</span>
                                {test.winner === "B" && <Badge className="bg-green-500">Winner</Badge>}
                              </div>
                              <div className="flex items-center gap-4">
                                <Progress value={test.variantB.performance} className="flex-1" />
                                <span className="text-sm font-medium">{test.variantB.performance}%</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{test.variantB.sample} samples</p>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium text-green-600">+{test.improvement}% improvement</span> with
                              Variant {test.winner}
                            </p>
                          </div>
                        </Card3D>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Card3D>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
