"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Eye, Heart, Bookmark, Users, Calendar } from "lucide-react"

export default function AnalyticsPanel() {
  // Mock data for charts
  const weeklyData = [
    { day: "Mon", views: 120, reactions: 15, bookmarks: 8 },
    { day: "Tue", views: 180, reactions: 22, bookmarks: 12 },
    { day: "Wed", views: 240, reactions: 31, bookmarks: 18 },
    { day: "Thu", views: 190, reactions: 25, bookmarks: 14 },
    { day: "Fri", views: 280, reactions: 38, bookmarks: 22 },
    { day: "Sat", views: 320, reactions: 42, bookmarks: 28 },
    { day: "Sun", views: 260, reactions: 35, bookmarks: 20 },
  ]

  const monthlyTrend = [
    { month: "Jan", engagement: 65 },
    { month: "Feb", engagement: 72 },
    { month: "Mar", engagement: 68 },
    { month: "Apr", engagement: 84 },
    { month: "May", engagement: 91 },
    { month: "Jun", engagement: 88 },
  ]

  const engagementDistribution = [
    { name: "Views", value: 65, color: "#3b82f6" },
    { name: "Reactions", value: 20, color: "#ef4444" },
    { name: "Bookmarks", value: 10, color: "#f59e0b" },
    { name: "Reflections", value: 5, color: "#8b5cf6" },
  ]

  const topInks = [
    {
      title: "The Power of Vulnerability",
      views: 2156,
      reactions: 143,
      engagement: 6.6,
    },
    {
      title: "The Art of Mindful Writing",
      views: 1247,
      reactions: 89,
      engagement: 7.1,
    },
    {
      title: "Building Better Habits",
      views: 892,
      reactions: 67,
      engagement: 7.5,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your content performance and engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Views</p>
                <p className="text-2xl font-bold">1.2K</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Reactions</p>
                <p className="text-2xl font-bold">84</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Bookmarks</p>
                <p className="text-2xl font-bold">31</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+15%</span>
                </div>
              </div>
              <Bookmark className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
                <p className="text-2xl font-bold">7.2%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+0.8%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3b82f6" />
                <Bar dataKey="reactions" fill="#ef4444" />
                <Bar dataKey="bookmarks" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Engagement Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={engagementDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                  {engagementDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {engagementDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Inks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Inks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topInks.map((ink, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{ink.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {ink.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {ink.reactions}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">{ink.engagement}% engagement</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
