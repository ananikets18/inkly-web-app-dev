"use client"
import { FileText, BarChart3, TrendingUp } from "lucide-react"

export default function AvgWordCount() {
  const avgWordCount = 187
  const highestWordCount = 342
  const lowestWordCount = 45
  const totalWords = avgWordCount * 48 // total inks * avg words

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Average Word Count</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border">
        {/* Main Stat */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{avgWordCount}</div>
          <div className="text-base text-muted-foreground font-medium">Avg. words per Ink</div>
        </div>

        {/* Range Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900 dark:to-emerald-950 rounded-lg border border-border">
            <div className="text-lg font-bold text-green-600">{highestWordCount}</div>
            <div className="text-xs text-muted-foreground">Highest</div>
          </div>

          <div className="text-center p-3 bg-gradient-to-r from-orange-50/60 to-red-50/60 dark:from-orange-900 dark:to-red-950 rounded-lg border border-border">
            <div className="text-lg font-bold text-orange-600">{lowestWordCount}</div>
            <div className="text-xs text-muted-foreground">Lowest</div>
          </div>
        </div>

        {/* Word Range Visualization */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Word Range</span>
            <span>
              {lowestWordCount} - {highestWordCount} words
            </span>
          </div>
          <div className="relative h-2 bg-gray-200/50 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-blue-500 to-green-500 rounded-full" />
            {/* Average marker */}
            <div
              className="absolute top-0 w-1 h-full bg-white border border-gray-400 rounded-full"
              style={{ left: `${((avgWordCount - lowestWordCount) / (highestWordCount - lowestWordCount)) * 100}%` }}
            />
          </div>
          <div className="flex justify-center mt-1">
            <div className="text-xs text-muted-foreground">↑ Average</div>
          </div>
        </div>

        {/* Total Words */}
        <div className="p-4 bg-gradient-to-r from-purple-50/60 to-indigo-50/60 dark:from-purple-900 dark:to-indigo-950 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-semibold text-foreground">Total Words Written</div>
                <div className="text-sm text-muted-foreground">Across all {48} inks</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{totalWords.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">words</div>
            </div>
          </div>
        </div>

        {/* Writing Style Insight */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50/60 to-cyan-50/60 dark:from-blue-900 dark:to-cyan-950 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-foreground">Writing Style</div>
              <div className="text-sm text-muted-foreground">
                Your inks are perfectly balanced - not too short, not too long. Great for engagement!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
