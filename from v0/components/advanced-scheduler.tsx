"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Clock,
  CalendarIcon,
  Repeat,
  Zap,
  Target,
  BarChart3,
  Settings,
  Play,
  Pause,
  Copy,
  Trash2,
  Edit,
  CheckSquare,
} from "lucide-react"
import { format, addDays, addWeeks } from "date-fns"

interface ContentSeries {
  id: string
  name: string
  description: string
  frequency: "daily" | "weekly" | "monthly"
  platforms: string[]
  status: "active" | "paused" | "completed"
  postsCount: number
  nextPost: Date
}

interface SmartSchedule {
  id: string
  name: string
  rules: {
    platforms: string[]
    optimalTimes: { [key: string]: string[] }
    frequency: string
    contentTypes: string[]
  }
  performance: {
    avgEngagement: number
    reachIncrease: number
  }
}

interface BulkOperation {
  action: "reschedule" | "duplicate" | "delete" | "change_status"
  selectedPosts: string[]
  newDate?: Date
  newStatus?: string
}

export function AdvancedScheduler() {
  const [activeTab, setActiveTab] = useState("smart")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [bulkSelection, setBulkSelection] = useState<string[]>([])

  // Mock data
  const contentSeries: ContentSeries[] = [
    {
      id: "1",
      name: "14 Days of Content Creation",
      description: "Daily tips and insights about content creation",
      frequency: "daily",
      platforms: ["LinkedIn", "Twitter"],
      status: "active",
      postsCount: 14,
      nextPost: addDays(new Date(), 1),
    },
    {
      id: "2",
      name: "Weekly Industry Roundup",
      description: "Weekly summary of industry trends and news",
      frequency: "weekly",
      platforms: ["LinkedIn"],
      status: "active",
      postsCount: 4,
      nextPost: addWeeks(new Date(), 1),
    },
  ]

  const smartSchedules: SmartSchedule[] = [
    {
      id: "1",
      name: "High Engagement Schedule",
      rules: {
        platforms: ["LinkedIn", "Twitter"],
        optimalTimes: {
          Monday: ["9:00 AM", "1:00 PM"],
          Tuesday: ["10:00 AM", "3:00 PM"],
          Wednesday: ["11:00 AM", "2:00 PM"],
          Thursday: ["9:00 AM", "4:00 PM"],
          Friday: ["10:00 AM", "12:00 PM"],
        },
        frequency: "daily",
        contentTypes: ["educational", "promotional"],
      },
      performance: {
        avgEngagement: 8.4,
        reachIncrease: 23.5,
      },
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200"
      case "paused":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const handleBulkOperation = (operation: BulkOperation) => {
    console.log("Bulk operation:", operation)
    // Implementation would handle the bulk operation
    setBulkSelection([])
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-xl px-6 py-6 shadow-premium">
        <div className="flex items-center justify-between">
          <div className="space-premium-xs">
            <h1 className="text-foreground flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              Advanced Scheduling
            </h1>
            <p className="text-base text-muted-foreground font-medium">
              Smart scheduling and content series management
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="glass-effect hover-lift transition-premium bg-transparent">
                  <Repeat className="h-4 w-4 mr-2" />
                  New Series
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-effect max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Content Series</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Series name" />
                  <Textarea placeholder="Description" />
                  <div className="grid grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Number of posts" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platforms</label>
                    <div className="flex gap-2">
                      {["LinkedIn", "Twitter", "Instagram"].map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox id={platform} />
                          <label htmlFor={platform} className="text-sm">
                            {platform}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full glass-effect">Create Series</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="glass-effect hover-lift transition-premium">
              <Zap className="h-4 w-4 mr-2" />
              Smart Schedule
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass-effect">
              <TabsTrigger value="smart">Smart Scheduling</TabsTrigger>
              <TabsTrigger value="series">Content Series</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>

            <TabsContent value="smart" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="glass-effect hover-lift transition-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Optimal Posting Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(smartSchedules[0].rules.optimalTimes).map(([day, times]) => (
                        <div key={day} className="flex items-center justify-between p-3 rounded-lg border glass-effect">
                          <span className="font-medium">{day}</span>
                          <div className="flex gap-2">
                            {times.map((time, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect hover-lift transition-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Performance Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border glass-effect">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Average Engagement</span>
                          <span className="text-2xl font-bold text-green-600">
                            {smartSchedules[0].performance.avgEngagement}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                            style={{ width: `${smartSchedules[0].performance.avgEngagement * 10}%` }}
                          />
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border glass-effect">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Reach Increase</span>
                          <span className="text-2xl font-bold text-blue-600">
                            +{smartSchedules[0].performance.reachIncrease}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                            style={{ width: `${smartSchedules[0].performance.reachIncrease}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="series" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {contentSeries.map((series, index) => (
                  <Card
                    key={series.id}
                    className="glass-effect hover-lift transition-premium animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{series.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{series.description}</p>
                        </div>
                        <Badge className={getStatusColor(series.status)}>{series.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Frequency:</span>
                          <p className="font-medium capitalize">{series.frequency}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Posts:</span>
                          <p className="font-medium">{series.postsCount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Post:</span>
                          <p className="font-medium">{format(series.nextPost, "MMM d, yyyy")}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Platforms:</span>
                          <div className="flex gap-1 mt-1">
                            {series.platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="glass-effect bg-transparent">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="glass-effect bg-transparent">
                          {series.status === "active" ? (
                            <Pause className="h-4 w-4 mr-1" />
                          ) : (
                            <Play className="h-4 w-4 mr-1" />
                          )}
                          {series.status === "active" ? "Pause" : "Resume"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-6">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    Bulk Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bulkSelection.length > 0 && (
                    <div className="p-4 rounded-lg border glass-effect bg-primary/5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">{bulkSelection.length} posts selected</span>
                        <Button variant="outline" size="sm" onClick={() => setBulkSelection([])}>
                          Clear Selection
                        </Button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass-effect bg-transparent"
                          onClick={() =>
                            handleBulkOperation({
                              action: "reschedule",
                              selectedPosts: bulkSelection,
                              newDate: addDays(new Date(), 1),
                            })
                          }
                        >
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass-effect bg-transparent"
                          onClick={() =>
                            handleBulkOperation({
                              action: "duplicate",
                              selectedPosts: bulkSelection,
                            })
                          }
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass-effect bg-transparent"
                          onClick={() =>
                            handleBulkOperation({
                              action: "change_status",
                              selectedPosts: bulkSelection,
                              newStatus: "draft",
                            })
                          }
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Change Status
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleBulkOperation({
                              action: "delete",
                              selectedPosts: bulkSelection,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select posts from the calendar to perform bulk operations</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="automation" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="glass-effect hover-lift transition-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Auto-Reposting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border glass-effect">
                      <div>
                        <p className="font-medium">Reshare Top Performers</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically reshare posts with 80%+ engagement
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auto-reshare" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border glass-effect">
                      <div>
                        <p className="font-medium">Cross-Platform Posting</p>
                        <p className="text-sm text-muted-foreground">Auto-adapt content for different platforms</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cross-platform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect hover-lift transition-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Smart Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border glass-effect">
                      <div>
                        <p className="font-medium">Audience Activity Optimization</p>
                        <p className="text-sm text-muted-foreground">Post when your audience is most active</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="audience-optimization" defaultChecked />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border glass-effect">
                      <div>
                        <p className="font-medium">Time Zone Adjustment</p>
                        <p className="text-sm text-muted-foreground">Automatically adjust for different time zones</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="timezone-adjustment" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
