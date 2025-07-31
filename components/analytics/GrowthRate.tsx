"use client"
import { TrendingUp, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function GrowthRate() {
  const growthMetrics = [
    {
      metric: "Views",
      current: 12400,
      previous: 10000,
      growth: 24.0,
      icon: "👁️",
      color: "from-blue-400 to-indigo-500"
    },
    {
      metric: "Reactions",
      current: 2800,
      previous: 2400,
      growth: 16.7,
      icon: "❤️",
      color: "from-red-400 to-pink-500"
    },
    {
      metric: "Reflections",
      current: 156,
      previous: 120,
      growth: 30.0,
      icon: "💭",
      color: "from-green-400 to-emerald-500"
    },
    {
      metric: "Followers",
      current: 234,
      previous: 200,
      growth: 17.0,
      icon: "👥",
      color: "from-purple-400 to-pink-500"
    }
  ]

  const overallGrowth = growthMetrics.reduce((sum, metric) => sum + metric.growth, 0) / growthMetrics.length

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Growth Rate</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border">
        {/* Overall Growth */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">+{overallGrowth.toFixed(1)}%</div>
          <div className="text-lg text-muted-foreground font-medium">Overall Growth</div>
          <div className="text-sm text-green-600 font-medium">Week over week</div>
        </div>

        {/* Growth Breakdown */}
        <div className="space-y-3 mb-6">
          {growthMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50/60 dark:bg-gray-800/60 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-full flex items-center justify-center text-sm`}>
                  {metric.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">{metric.metric}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {metric.current.toLocaleString()} vs {metric.previous.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {metric.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-bold ${metric.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Growth Trend */}
        <div className="p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-900 dark:to-pink-950 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground">Growth Trend</div>
              <div className="text-sm text-muted-foreground">
                {overallGrowth > 15 ? 'Excellent' : overallGrowth > 10 ? 'Good' : 'Steady'} performance
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {overallGrowth > 15 ? '🚀' : overallGrowth > 10 ? '📈' : '📊'}
              </div>
              <div className="text-xs text-muted-foreground">trend</div>
            </div>
          </div>
        </div>

        {/* Growth Insights */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-900 dark:to-indigo-950 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Insight:</strong> Your reflections are growing fastest (+30%) - keep sharing meaningful content!
            </span>
          </div>
        </div>
      </div>
    </section>
  )
} 