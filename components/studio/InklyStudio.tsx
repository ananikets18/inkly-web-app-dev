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
  MessageCircle,
  Bookmark,
  Users,
  Calendar,
  Plus,
  Filter,
  Download,
} from "lucide-react"
import InksOverview from "./InksOverview"
import AnalyticsPanel from "./AnalyticsPanel"
import DraftsQueue from "./DraftsQueue"

export default function InklyStudio() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock analytics data
  const analyticsData = {
    totalViews: 45672,
    totalReactions: 3421,
    totalReflections: 892,
    totalBookmarks: 1567,
    followers: 2341,
    viewsGrowth: 12.5,
    reactionsGrowth: 8.3,
    reflectionsGrowth: 15.2,
    bookmarksGrowth: 6.7,
    followersGrowth: 9.1,
  }

  const quickStats = [
    {
      label: "Total Views",
      value: analyticsData.totalViews.toLocaleString(),
      growth: analyticsData.viewsGrowth,
      icon: Eye,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Reactions",
      value: analyticsData.totalReactions.toLocaleString(),
      growth: analyticsData.reactionsGrowth,
      icon: Heart,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Reflections",
      value: analyticsData.totalReflections.toLocaleString(),
      growth: analyticsData.reflectionsGrowth,
      icon: MessageCircle,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Bookmarks",
      value: analyticsData.totalBookmarks.toLocaleString(),
      growth: analyticsData.bookmarksGrowth,
      icon: Bookmark,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Followers",
      value: analyticsData.followers.toLocaleString(),
      growth: analyticsData.followersGrowth,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
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
