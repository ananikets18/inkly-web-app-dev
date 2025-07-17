"use client"
import { PenTool, TrendingUp, Calendar } from "lucide-react"

export default function TotalInksPosted() {
  const totalInks = 48
  const thisWeekInks = 7
  const thisMonthInks = 23
  const weeklyGrowth = 12 // percentage

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <PenTool className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Total Inks Posted</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border">
        {/* Main Stat */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <PenTool className="w-10 h-10 text-white" />
          </div>
          <div className="text-6xl md:text-7xl font-bold text-foreground mb-2">{totalInks}</div>
          <div className="text-lg text-muted-foreground font-medium">Total Inks</div>
        </div>

        {/* Sub Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-900 dark:to-indigo-950 rounded-xl border border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{thisWeekInks}</span>
            </div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900 dark:to-emerald-950 rounded-xl border border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{thisMonthInks}</span>
            </div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="p-4 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900 dark:to-emerald-950 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-semibold text-foreground">Weekly Growth</div>
                <div className="text-sm text-muted-foreground">+{weeklyGrowth}% more than last week</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">+{weeklyGrowth}%</div>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-900 dark:to-pink-950 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-foreground">Next Milestone</div>
              <div className="text-sm text-muted-foreground">50 Inks Achievement</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">{50 - totalInks}</div>
              <div className="text-sm text-muted-foreground">to go</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200/50 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
              style={{ width: `${(totalInks / 50) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>50</span>
          </div>
        </div>
      </div>
    </section>
  )
}
