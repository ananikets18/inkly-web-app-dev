"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Users,
  Clock,
  Target,
  Zap,
  Calendar,
  BarChart3,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function AnalyticsPanel() {
  const [timeRange, setTimeRange] = useState("7d")

  // Mock data
  const keyMetrics = [
    {
      title: "Total Views",
      value: "12.4K",
      change: "+23.5%",
      trend: "up" as const,
      icon: Eye,
      color: "blue",
    },
    {
      title: "Reactions",
      value: "2.8K",
      change: "+18.2%",
      trend: "up" as const,
      icon: Heart,
      color: "rose",
    },
    {
      title: "Reflections",
      value: "847",
      change: "+12.1%",
      trend: "up" as const,
      icon: MessageCircle,
      color: "emerald",
    },
    {
      title: "Bookmarks",
      value: "1.2K",
      change: "-2.3%",
      trend: "down" as const,
      icon: Bookmark,
      color: "amber",
    },
    {
      title: "New Followers",
      value: "234",
      change: "+45.6%",
      trend: "up" as const,
      icon: Users,
      color: "violet",
    },
    {
      title: "Avg. Read Time",
      value: "3.2m",
      change: "+8.7%",
      trend: "up" as const,
      icon: Clock,
      color: "cyan",
    },
  ]

  const viewsData = [
    { date: "Jan 1", views: 1200, reactions: 89, reflections: 23 },
    { date: "Jan 2", views: 1890, reactions: 134, reflections: 45 },
    { date: "Jan 3", views: 2100, reactions: 156, reflections: 52 },
    { date: "Jan 4", views: 1750, reactions: 123, reflections: 38 },
    { date: "Jan 5", views: 2400, reactions: 189, reflections: 67 },
    { date: "Jan 6", views: 2800, reactions: 234, reflections: 78 },
    { date: "Jan 7", views: 3200, reactions: 267, reflections: 89 },
  ]

  const engagementData = [
    { name: "Reactions", value: 45, color: "#f43f5e" },
    { name: "Reflections", value: 25, color: "#10b981" },
    { name: "Bookmarks", value: 20, color: "#f59e0b" },
    { name: "Shares", value: 10, color: "#8b5cf6" },
  ]

  const activityData = [
    { hour: "00", activity: 12 },
    { hour: "04", activity: 8 },
    { hour: "08", activity: 45 },
    { hour: "12", activity: 78 },
    { hour: "16", activity: 92 },
    { hour: "20", activity: 67 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const MetricCard = ({ metric }: { metric: (typeof keyMetrics)[0] }) => {
    const Icon = metric.icon
    const isPositive = metric.trend === "up"

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-lg dark:shadow-slate-900/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{metric.title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${
                  metric.color === "blue"
                    ? "from-blue-500/10 to-blue-600/20 dark:from-blue-400/10 dark:to-blue-500/20"
                    : metric.color === "rose"
                      ? "from-rose-500/10 to-rose-600/20 dark:from-rose-400/10 dark:to-rose-500/20"
                      : metric.color === "emerald"
                        ? "from-emerald-500/10 to-emerald-600/20 dark:from-emerald-400/10 dark:to-emerald-500/20"
                        : metric.color === "amber"
                          ? "from-amber-500/10 to-amber-600/20 dark:from-amber-400/10 dark:to-amber-500/20"
                          : metric.color === "violet"
                            ? "from-violet-500/10 to-violet-600/20 dark:from-violet-400/10 dark:to-violet-500/20"
                            : "from-cyan-500/10 to-cyan-600/20 dark:from-cyan-400/10 dark:to-cyan-500/20"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    metric.color === "blue"
                      ? "text-blue-600 dark:text-blue-400"
                      : metric.color === "rose"
                        ? "text-rose-600 dark:text-rose-400"
                        : metric.color === "emerald"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : metric.color === "amber"
                            ? "text-amber-600 dark:text-amber-400"
                            : metric.color === "violet"
                              ? "text-violet-600 dark:text-violet-400"
                              : "text-cyan-600 dark:text-cyan-400"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Analytics
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                Track your content performance and audience engagement
              </p>
            </div>

            <div className="flex items-center gap-2">
              {["7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={`transition-all duration-200 ${
                    timeRange === range
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </Button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MetricCard metric={metric} />
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Views & Engagement Trend */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Views & Engagement Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={viewsData}>
                        <defs>
                          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="reactionsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                        <XAxis dataKey="date" stroke="#64748b" className="dark:stroke-slate-400" fontSize={12} />
                        <YAxis stroke="#64748b" className="dark:stroke-slate-400" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fill="url(#viewsGradient)"
                        />
                        <Area
                          type="monotone"
                          dataKey="reactions"
                          stroke="#f43f5e"
                          strokeWidth={2}
                          fill="url(#reactionsGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Engagement Mix */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    Engagement Mix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={engagementData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value) => (
                            <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Pattern */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Activity Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                        <XAxis dataKey="hour" stroke="#64748b" className="dark:stroke-slate-400" fontSize={12} />
                        <YAxis stroke="#64748b" className="dark:stroke-slate-400" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="activity" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Growth Insights */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    Growth Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-900 dark:text-emerald-100">Peak Performance</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          Your content performs best on weekends
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">Audience Growth</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">+45% new followers this week</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-100 dark:bg-violet-800 rounded-lg">
                        <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="font-medium text-violet-900 dark:text-violet-100">Consistency Streak</p>
                        <p className="text-sm text-violet-700 dark:text-violet-300">12 days of daily posting</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
