import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, CheckCircle, Edit, Sparkles, Plus, BarChart3 } from "lucide-react"
import { Card3D } from "@/components/ui/card-3d"

export function ContentOSDashboard() {
  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Postcards",
      value: "14",
      icon: FileText,
    },
    {
      title: "Scheduled",
      value: "8",
      icon: Calendar,
    },
    {
      title: "Published",
      value: "4",
      icon: CheckCircle,
    },
    {
      title: "Drafts",
      value: "2",
      icon: Edit,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      title: "Day 14: Final Reflection on Content Creation Journey",
      state: "published" as const,
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      title: "Day 13: Advanced Content Strategies for Maximum Impact",
      state: "scheduled" as const,
      timeAgo: "4 hours ago",
    },
    {
      id: 3,
      title: "Day 12: Building Authentic Connections Through Storytelling",
      state: "published" as const,
      timeAgo: "1 day ago",
    },
    {
      id: 4,
      title: "Day 11: Leveraging User-Generated Content for Growth",
      state: "draft" as const,
      timeAgo: "1 day ago",
    },
    {
      id: 5,
      title: "Day 10: Mastering Visual Content Design Principles",
      state: "scheduled" as const,
      timeAgo: "2 days ago",
    },
  ]

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
      <header className="border-b border-border bg-card/80 backdrop-blur-xl px-6 py-6 shadow-premium">
        <div className="flex items-center justify-between">
          <div className="space-premium-xs">
            <h1 className="text-heading-2 text-foreground">ContentOS</h1>
            <p className="text-body text-muted-foreground">14 Postcards in 14 Days</p>
          </div>
          <div className="flex items-center gap-3">
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
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-premium-xl">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card3D
                  key={stat.title}
                  variant="hero"
                  intensity={0.8}
                  className="animate-slide-up group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="glass-effect transition-premium bg-card border-border hover:bg-card/80 h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-caption text-muted-foreground">{stat.title}</CardTitle>
                      <div className="rounded-lg bg-primary/10 p-2.5 transition-premium hover:bg-primary/20 group-hover:scale-110">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-premium-sm">
                      <div className="text-display text-foreground">{stat.value}</div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out animate-progress-fill"
                          style={{ width: `${(Number.parseInt(stat.value) / 14) * 100}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                </Card3D>
              )
            })}
          </div>

          <Card3D variant="standard" className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            <Card className="glass-effect transition-premium bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-heading-3 text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row">
                <Button className="flex items-center gap-3 h-11 px-6 glass-effect hover-lift transition-premium group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12 relative z-10" />
                  <span className="text-body relative z-10">Generate Phase Content</span>
                </Button>
                <Button
                  variant="secondary"
                  className="flex items-center gap-3 h-11 px-6 glass-effect hover-lift transition-premium group relative overflow-hidden bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Plus className="h-4 w-4 transition-transform group-hover:scale-110 relative z-10" />
                  <span className="text-body relative z-10">Create New Post</span>
                </Button>
              </CardContent>
            </Card>
          </Card3D>

          <Card3D variant="standard" className="animate-slide-up" style={{ animationDelay: "500ms" }}>
            <Card className="glass-effect transition-premium bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-heading-3 text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-premium-md">
                  {recentActivity.map((activity, index) => (
                    <Card3D
                      key={activity.id}
                      variant="minimal"
                      intensity={0.3}
                      gloss={false}
                      className="animate-scale-in"
                      style={{ animationDelay: `${600 + index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between rounded-lg border border-border bg-secondary p-5 transition-premium hover:shadow-premium cursor-pointer hover:bg-secondary/80">
                        <div className="flex-1 space-premium-xs">
                          <p className="text-body-small text-foreground">
                            {activity.title.length > 50 ? `${activity.title.substring(0, 50)}...` : activity.title}
                          </p>
                          <p className="text-caption text-muted-foreground">{activity.timeAgo}</p>
                        </div>
                        <Badge
                          variant={getStateBadgeVariant(activity.state)}
                          className="transition-premium hover:scale-105 text-caption px-3 py-1"
                        >
                          {activity.state}
                        </Badge>
                      </div>
                    </Card3D>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Card3D>
        </div>
      </main>
    </div>
  )
}
