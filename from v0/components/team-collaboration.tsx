"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Users,
  UserPlus,
  MessageCircle,
  CheckCircle,
  Clock,
  Crown,
  Shield,
  Edit3,
  Send,
  MoreHorizontal,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "reviewer" | "viewer"
  avatar?: string
  status: "active" | "pending" | "inactive"
  lastActive: string
}

interface Comment {
  id: string
  author: TeamMember
  content: string
  timestamp: string
  type: "comment" | "approval" | "rejection"
  postId?: string
}

interface ApprovalRequest {
  id: string
  postTitle: string
  author: TeamMember
  status: "pending" | "approved" | "rejected"
  timestamp: string
  reviewers: TeamMember[]
}

export function TeamCollaboration() {
  const [activeTab, setActiveTab] = useState("team")
  const [newComment, setNewComment] = useState("")

  // Mock data
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "admin",
      avatar: "/professional-woman-diverse.png",
      status: "active",
      lastActive: "2 minutes ago",
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "editor",
      avatar: "/professional-man.png",
      status: "active",
      lastActive: "1 hour ago",
    },
    {
      id: "3",
      name: "Emma Davis",
      email: "emma@company.com",
      role: "reviewer",
      avatar: "/professional-woman-reviewer.png",
      status: "pending",
      lastActive: "1 day ago",
    },
  ]

  const comments: Comment[] = [
    {
      id: "1",
      author: teamMembers[1],
      content: "Great hook! Maybe we could add a statistic to make it even more compelling?",
      timestamp: "2 hours ago",
      type: "comment",
      postId: "post-1",
    },
    {
      id: "2",
      author: teamMembers[0],
      content: "Approved for publishing. The messaging aligns perfectly with our brand voice.",
      timestamp: "4 hours ago",
      type: "approval",
      postId: "post-2",
    },
  ]

  const approvalRequests: ApprovalRequest[] = [
    {
      id: "1",
      postTitle: "Day 14: Final Reflection on Content Creation Journey",
      author: teamMembers[1],
      status: "pending",
      timestamp: "30 minutes ago",
      reviewers: [teamMembers[0], teamMembers[2]],
    },
    {
      id: "2",
      postTitle: "Day 13: Advanced Content Strategies for Maximum Impact",
      author: teamMembers[1],
      status: "approved",
      timestamp: "2 hours ago",
      reviewers: [teamMembers[0]],
    },
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "editor":
        return <Edit3 className="h-4 w-4 text-blue-500" />
      case "reviewer":
        return <Shield className="h-4 w-4 text-green-500" />
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-500" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "inactive":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "approved":
        return "text-green-600 bg-green-50 border-green-200"
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-xl px-6 py-6 shadow-premium">
        <div className="flex items-center justify-between">
          <div className="space-premium-xs">
            <h1 className="text-foreground flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              Team Collaboration
            </h1>
            <p className="text-base text-muted-foreground font-medium">Manage team members and content workflows</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="glass-effect hover-lift transition-premium">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-effect">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Email address" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full">Send Invitation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass-effect">
              <TabsTrigger value="team">Team Members</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="team" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member, index) => (
                  <Card
                    key={member.id}
                    className="glass-effect hover-lift transition-premium animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${getStatusColor(member.status)}`}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-card-foreground">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(member.role)}
                          <Badge variant="outline" className="capitalize">
                            {member.role}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{member.lastActive}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approvals" className="space-y-6">
              <div className="space-y-4">
                {approvalRequests.map((request, index) => (
                  <Card
                    key={request.id}
                    className="glass-effect hover-lift transition-premium animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-card-foreground mb-2">{request.postTitle}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={request.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {request.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{request.author.name}</span>
                            </div>
                            <span>{request.timestamp}</span>
                          </div>
                        </div>
                        <Badge className={getApprovalStatusColor(request.status)}>{request.status}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Reviewers:</span>
                          <div className="flex -space-x-2">
                            {request.reviewers.map((reviewer) => (
                              <Avatar key={reviewer.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={reviewer.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {reviewer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="glass-effect bg-transparent">
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button size="sm" className="glass-effect">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Recent Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className="flex gap-4 p-4 rounded-lg border glass-effect hover-lift transition-premium animate-scale-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {comment.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-card-foreground">{comment.author.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {comment.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-4 pt-4 border-t">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="glass-effect"
                      />
                      <Button size="sm" className="glass-effect">
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Team Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "approved",
                        user: "Sarah Johnson",
                        item: "Day 13 post",
                        time: "2 hours ago",
                        icon: CheckCircle,
                        color: "text-green-500",
                      },
                      {
                        action: "commented on",
                        user: "Mike Chen",
                        item: "Day 12 post",
                        time: "4 hours ago",
                        icon: MessageCircle,
                        color: "text-blue-500",
                      },
                      {
                        action: "submitted for review",
                        user: "Emma Davis",
                        item: "Day 14 post",
                        time: "6 hours ago",
                        icon: Clock,
                        color: "text-yellow-500",
                      },
                    ].map((activity, index) => {
                      const Icon = activity.icon
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 rounded-lg glass-effect hover-lift transition-premium animate-scale-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <Icon className={`h-5 w-5 ${activity.color}`} />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                              <span className="font-medium">{activity.item}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
