import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  Edit, 
  Sparkles, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  ArrowUpRight,
  Activity
} from "lucide-react"
import { Card3D } from "@/components/ui/card-3d"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DashboardProps {
  stats?: {
    total: number
    scheduled: number
    published: number
    drafts: number
  }
  postcards?: Array<{
    id: string
    english_content: string
    state: 'draft' | 'approved' | 'scheduled' | 'published'
    created_at: string | Date
  }>
}

export function ContentOSDashboard({ stats, postcards = [] }: DashboardProps = {}) {
  // Calculate additional metrics
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const recentPostcards = postcards.filter(p => new Date(p.created_at) >= weekAgo)
  const scheduledToday = postcards.filter(p => {
    const created = new Date(p.created_at)
    return format(created, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') && p.state === 'scheduled'
  })
  
  const completionRate = stats?.total ? Math.round(((stats.published + stats.scheduled) / stats.total) * 100) : 0
  
  // Enhanced stats with better metrics
  const dashboardStats = [
    {
      title: "Total Content",
      value: stats?.total?.toString() || "0",
      subtitle: `${recentPostcards.length} this week`,
      icon: FileText,
      trend: recentPostcards.length > 0 ? "+12%" : "0%",
      color: "text-blue-400"
    },
    {
      title: "Published",
      value: stats?.published?.toString() || "0",
      subtitle: "Live content",
      icon: CheckCircle,
      trend: "+8%",
      color: "text-emerald-400"
    },
    {
      title: "Scheduled",
      value: stats?.scheduled?.toString() || "0",
      subtitle: `${scheduledToday.length} today`,
      icon: Clock,
      trend: scheduledToday.length > 0 ? "Due today" : "None due",
      color: "text-amber-400"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtitle: "Goal progress",
      icon: Target,
      trend: completionRate >= 75 ? "On track" : "Behind",
      color: completionRate >= 75 ? "text-emerald-400" : "text-orange-400"
    },
  ]

  // Convert postcards to recent activity format
  const recentActivity = postcards.slice(0, 5).map(postcard => {
    const createdAt = new Date(postcard.created_at)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60))
    
    let timeAgo = ''
    if (diffInHours < 1) {
      timeAgo = 'Just now'
    } else if (diffInHours < 24) {
      timeAgo = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInHours / 24)
      timeAgo = `${days} day${days > 1 ? 's' : ''} ago`
    }
    
    return {
      id: postcard.id,
      title: postcard.english_content.substring(0, 60) + (postcard.english_content.length > 60 ? '...' : ''),
      state: postcard.state,
      timeAgo
    }
  })

  const getStateBadgeVariant = (state: "draft" | "scheduled" | "published") => {
    switch (state) {
      case "draft":
        return "secondary"
      case "scheduled":
        return "outline"
      case "published":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <header className="border-b border-border bg-card/80 backdrop-blur-xl px-4 sm:px-6 py-4 sm:py-6 shadow-header">
        <div className="flex items-center justify-between">
          <div className="space-premium-xs">
            <h1 className="text-heading-2 text-foreground">ContentOS</h1>
            <p className="text-body text-muted-foreground">14 Postcards in 14 Days</p>
          </div>
          <div className="flex items-center space-premium-sm">
            <Button
              variant="outline"
              className="glass-effect hover-lift transition-premium bg-accent border-border text-foreground hover:bg-accent/80"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="text-body-small">View Analytics</span>
            </Button>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 animate-pulse-subtle glass-effect"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {dashboardStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card3D
                  key={stat.title}
                  variant="hero"
                  intensity={0.8}
                  className="animate-slide-up group cursor-pointer"
                >
                  <Card className="glass-effect transition-premium bg-card border-border hover:bg-card/80 h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <div className="space-y-1">
                        <CardTitle className="text-sm text-muted-foreground font-medium">
                          {stat.title}
                        </CardTitle>
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      </div>
                      <div className={cn("rounded-lg p-2.5 transition-all group-hover:scale-110", 
                        stat.color === "text-blue-400" && "bg-blue-500/10",
                        stat.color === "text-emerald-400" && "bg-emerald-500/10",
                        stat.color === "text-amber-400" && "bg-amber-500/10",
                        stat.color === "text-orange-400" && "bg-orange-500/10"
                      )}>
                        <Icon className={cn("h-5 w-5", stat.color)} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{stat.subtitle}</span>
                        <div className="flex items-center gap-1">
                          {stat.trend.includes('+') && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                          <span className={cn("text-xs font-medium",
                            stat.trend.includes('+') ? "text-emerald-400" : 
                            stat.trend.includes('Behind') ? "text-orange-400" :
                            stat.trend.includes('Due today') ? "text-amber-400" : "text-zinc-400"
                          )}>
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Card3D>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card3D variant="standard" className="lg:col-span-2">
              <Card className="glass-effect transition-premium bg-card border-border h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 justify-start group">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                    <Sparkles className="h-4 w-4 mr-3 transition-transform group-hover:rotate-12" />
                    Generate Phase Content
                  </Button>
                  <Button variant="outline" className="border-zinc-700 text-zinc-200 hover:bg-zinc-800 h-12 justify-start group">
                    <Plus className="h-4 w-4 mr-3 transition-transform group-hover:scale-110" />
                    Create New Post
                  </Button>
                  <Button variant="outline" className="border-zinc-700 text-zinc-200 hover:bg-zinc-800 h-12 justify-start group">
                    <Calendar className="h-4 w-4 mr-3" />
                    View Calendar
                  </Button>
                  <Button variant="outline" className="border-zinc-700 text-zinc-200 hover:bg-zinc-800 h-12 justify-start group">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Analytics
                  </Button>
                </CardContent>
              </Card>
            </Card3D>
            
            {/* Today's Goals */}
            <Card3D variant="standard">
              <Card className="glass-effect transition-premium bg-card border-border h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">Today's Goals</CardTitle>
                    <Target className="h-5 w-5 text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Content Creation</span>
                    <span className="text-sm font-medium text-foreground">2/3</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Publishing</span>
                    <span className="text-sm font-medium text-foreground">1/2</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  
                  <div className="pt-2 border-t border-zinc-700">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{format(today, 'EEEE, MMMM d')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Card3D>
          </div>

          {/* Recent Activity */}
          <Card3D variant="standard">
            <Card className="glass-effect transition-premium bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4 transition-all hover:bg-zinc-800/50 cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">
                            {activity.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
                            <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                            <div className="flex items-center gap-1">
                              {activity.state === 'published' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                              {activity.state === 'scheduled' && <Clock className="w-3 h-3 text-amber-400" />}
                              {activity.state === 'draft' && <Edit className="w-3 h-3 text-zinc-400" />}
                              <span className="text-xs text-muted-foreground capitalize">{activity.state}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-400 hover:text-zinc-200 transition-colors" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                      <p className="text-xs text-zinc-600 mt-1">Start creating content to see activity here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Card3D>
        </div>
      </main>
    </div>
  )
}
