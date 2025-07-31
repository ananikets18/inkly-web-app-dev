"use client"
import { Eye, TrendingUp, BarChart3 } from "lucide-react"

export default function ViewsImpressions() {
  const totalViews = 12400
  const totalImpressions = 45200
  const viewsGrowth = 23.5
  const impressionsGrowth = 31.8
  const avgViewsPerInk = Math.round(totalViews / 48) // total views / total inks

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Reach & Views</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-900 dark:to-indigo-950 rounded-xl border border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{totalViews.toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground">Total Views</div>
            <div className="text-xs text-green-600 font-medium">+{viewsGrowth}%</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-900 dark:to-pink-950 rounded-xl border border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">{totalImpressions.toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground">Impressions</div>
            <div className="text-xs text-green-600 font-medium">+{impressionsGrowth}%</div>
          </div>
        </div>

        {/* Average Views */}
        <div className="p-4 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900 dark:to-emerald-950 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-semibold text-foreground">Avg. Views per Ink</div>
                <div className="text-sm text-muted-foreground">Your content reach</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">{avgViewsPerInk}</div>
          </div>
        </div>

        {/* View Rate */}
        <div className="mt-4 p-4 bg-gradient-to-r from-orange-50/60 to-yellow-50/60 dark:from-orange-900 dark:to-yellow-950 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground">View Rate</div>
              <div className="text-sm text-muted-foreground">Views / Impressions</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{Math.round((totalViews / totalImpressions) * 100)}%</div>
              <div className="text-xs text-muted-foreground">engagement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 