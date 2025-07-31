"use client"
import { Target, Heart, MessageCircle, TrendingUp } from "lucide-react"

export default function EngagementRate() {
  const totalViews = 12400
  const totalReactions = 2800
  const totalReflections = 156
  const totalBookmarks = 1200
  
  // Calculate engagement rate: (reactions + reflections) / views
  const engagementRate = ((totalReactions + totalReflections) / totalViews * 100).toFixed(1)
  const previousEngagementRate = 18.2 // Mock previous rate
  const growth = ((parseFloat(engagementRate) - previousEngagementRate) / previousEngagementRate * 100).toFixed(1)
  
  const isGrowthPositive = parseFloat(growth) > 0

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Engagement Rate</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border">
        {/* Main Engagement Rate */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
          <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{engagementRate}%</div>
          <div className="text-lg text-muted-foreground font-medium">Engagement Rate</div>
          <div className={`text-sm font-medium ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isGrowthPositive ? '+' : ''}{growth}% vs last week
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-gradient-to-r from-red-50/60 to-pink-50/60 dark:from-red-900 dark:to-pink-950 rounded-lg border border-border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-lg font-bold text-red-600">{totalReactions.toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground">Reactions</div>
          </div>

          <div className="text-center p-3 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900 dark:to-emerald-950 rounded-lg border border-border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span className="text-lg font-bold text-green-600">{totalReflections.toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground">Reflections</div>
          </div>

          <div className="text-center p-3 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-900 dark:to-indigo-950 rounded-lg border border-border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-lg font-bold text-blue-600">{totalBookmarks.toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground">Bookmarks</div>
          </div>
        </div>

        {/* Engagement Quality */}
        <div className="p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-900 dark:to-pink-950 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground">Engagement Quality</div>
              <div className="text-sm text-muted-foreground">
                {totalReflections > totalReactions * 0.1 ? 'High' : 'Good'} - {totalReflections} reflections
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">
                {totalReflections > totalReactions * 0.1 ? '🌟' : '⭐'}
              </div>
              <div className="text-xs text-muted-foreground">quality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 