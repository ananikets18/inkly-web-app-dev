"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, Zap } from "lucide-react"

export default function XPOverTime() {
  const xpData = [
    { day: "Mon", xp: 8200, gained: 45 },
    { day: "Tue", xp: 8245, gained: 67 },
    { day: "Wed", xp: 8312, gained: 23 },
    { day: "Thu", xp: 8335, gained: 89 },
    { day: "Fri", xp: 8424, gained: 56 },
    { day: "Sat", xp: 8480, gained: 34 },
    { day: "Sun", xp: 8514, gained: 0 },
  ]

  const totalWeeklyXP = xpData.reduce((sum, day) => sum + day.gained, 0)
  const currentXP = xpData[xpData.length - 1].xp

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-purple-600">Total XP: {data.xp.toLocaleString()}</p>
          <p className="text-green-600">Gained: +{data.gained} XP</p>
        </div>
      )
    }
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">XP Over Time</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border">
        {/* Header with weekly summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Weekly XP Growth</h3>
            <p className="text-sm text-gray-600">Your experience points over the last 7 days</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">+{totalWeeklyXP}</span>
            </div>
            <div className="text-sm text-gray-500">XP this week</div>
          </div>
        </div>

        {/* Current XP Display */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50/60 to-indigo-50/60 dark:from-indigo-900 dark:to-purple-950 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Current XP</div>
              <div className="text-3xl font-bold text-purple-600">{currentXP.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Level Progress</div>
              <div className="text-lg font-semibold text-foreground">Level 12</div>
            </div>
          </div>
        </div>

        {/* XP Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={xpData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                domain={["dataMin - 50", "dataMax + 50"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#8b5cf6", strokeWidth: 2, fill: "#fff" }}
                className="drop-shadow-sm"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Breakdown */}
        <div className="mt-6 grid grid-cols-7 gap-2">
          {xpData.map((day, index) => (
            <div
              key={day.day}
              className="text-center p-2 bg-white/50 dark:bg-indigo-900 rounded-lg border border-border hover:shadow-md transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-xs font-medium text-muted-foreground mb-1">{day.day}</div>
              <div className="text-sm font-bold text-foreground">+{day.gained}</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
          ))}
        </div>

        {/* Insight */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900 dark:to-emerald-950 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-foreground">Great Progress!</div>
              <div className="text-sm text-muted-foreground">
                You gained {totalWeeklyXP} XP this week. Your most productive day was Thursday with +89 XP!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
