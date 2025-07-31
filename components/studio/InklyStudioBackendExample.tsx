// Example: How to update InklyStudio component for backend integration
// This shows the structure for replacing mock data with real API calls

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Bookmark,
  Users,
  Calendar,
  Plus,
  Filter,
  Download,
  Activity,
  Clock,
  Share2,
} from "lucide-react"
import InksOverview from "./InksOverview"
import AnalyticsPanel from "./AnalyticsPanel"
import DraftsQueue from "./DraftsQueue"
import { useUserAnalytics, AnalyticsAPI } from "@/lib/api/analytics"
// Authentication removed - using mock authentication

export default function InklyStudioBackendExample() {
  const [activeTab, setActiveTab] = useState("overview")
  
  // Get user ID from auth context
  // Mock user for demo
  const user = {
    id: "demo-user-id",
    fullName: "Demo User",
    username: "demo_user",
    email: "demo@example.com"
  }
  const userId = user?.id || "current-user-id"
  const { data: analyticsData, loading, error, refetch } = useUserAnalytics(userId, "7d")

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 lg:gap-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardContent className="p-3 lg:p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 p-4 lg:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load analytics: {error}</p>
          <Button onClick={refetch} variant="outline">Retry</Button>
        </div>
      </div>
    )
  }

  // Use real data from backend
  const quickStats = [
    {
      label: "Impressions",
      value: analyticsData?.quickStats.impressions.toLocaleString() || "0",
      growth: analyticsData?.quickStats.impressionsGrowth || 0,
      icon: Activity,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Total Views",
      value: analyticsData?.quickStats.totalViews.toLocaleString() || "0",
      growth: analyticsData?.quickStats.viewsGrowth || 0,
      icon: Eye,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Avg. Read Time",
      value: `${analyticsData?.quickStats.avgReadTime || 0}m`,
      growth: analyticsData?.quickStats.readTimeGrowth || 0,
      icon: Clock,
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      label: "Reactions",
      value: analyticsData?.quickStats.totalReactions.toLocaleString() || "0",
      growth: analyticsData?.quickStats.reactionsGrowth || 0,
      icon: Heart,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Shares",
      value: analyticsData?.quickStats.totalShares.toLocaleString() || "0",
      growth: analyticsData?.quickStats.sharesGrowth || 0,
      icon: Share2,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Bookmarks",
      value: analyticsData?.quickStats.totalBookmarks.toLocaleString() || "0",
      growth: analyticsData?.quickStats.bookmarksGrowth || 0,
      icon: Bookmark,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "New Followers",
      value: analyticsData?.quickStats.followers.toLocaleString() || "0",
      growth: analyticsData?.quickStats.followersGrowth || 0,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 lg:gap-4">
        {quickStats.map((stat, index) => (
          <Card
            key={index}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50"
          >
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${stat.color}`} />
                <Badge
                  variant={stat.growth > 0 ? "default" : "secondary"}
                  className={`text-xs ${stat.growth > 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : ""}`}
                >
                  {stat.growth > 0 ? "+" : ""}
                  {stat.growth}%
                </Badge>
              </div>
              <div className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-1.5">
          <TabsList
            role="tablist"
            className="flex w-full p-1 
                      dark:from-purple-800 dark:to-purple-900
                      border border-gray-200 dark:border-gray-700
                      rounded overflow-hidden text-sm font-medium"
          >
            <TabsTrigger
              role="tab"
              aria-selected="true"
              value="overview"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md
                        transition-all duration-200
                        hover:bg-purple-100 dark:hover:bg-purple-800
                        focus:outline-none 
                        data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900
                        data-[state=active]:text-purple-700 dark:text-purple-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>

            <TabsTrigger
              role="tab"
              value="analytics"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md
                        transition-all duration-200
                        hover:bg-purple-100 dark:hover:bg-purple-800
                        focus:outline-none 
                        data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900
                        data-[state=active]:text-purple-700 dark:text-purple-300"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>

            <TabsTrigger
              role="tab"
              value="drafts"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md
                        transition-all duration-200
                        hover:bg-purple-100 dark:hover:bg-purple-800
                        focus:outline-none 
                        data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900
                        data-[state=active]:text-purple-700 dark:text-purple-300"
            >
              <Calendar className="w-4 h-4" />
              <span>Drafts</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Pass real ink data to InksOverview */}
          <InksOverview />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsPanel />
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          <DraftsQueue />
        </TabsContent>
      </Tabs>
    </div>
  )
} 