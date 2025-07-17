"use client"

import { useState } from "react"
import { Calendar, Flame, Target } from "lucide-react"

export default function StreakTracker() {
  const [hoveredDay, setHoveredDay] = useState<any>(null)

  // Generate last 30 days of activity data
  const generateActivityData = () => {
    const days = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Simulate activity data
      const activity = Math.random()
      const inkCount = activity > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0

      days.push({
        date: date,
        day: date.getDate(),
        month: date.getMonth(),
        inkCount: inkCount,
        intensity: inkCount > 0 ? Math.min(inkCount / 3, 1) : 0,
        isToday: i === 0,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: date.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
      })
    }

    return days
  }

  const activityData = generateActivityData()
  const currentStreak = 5 // Mock current streak
  const longestStreak = 12 // Mock longest streak
  const totalActiveDays = activityData.filter((day) => day.inkCount > 0).length

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return "bg-gray-100 dark:bg-gray-800"
    if (intensity <= 0.33) return "bg-green-200 dark:bg-green-900"
    if (intensity <= 0.66) return "bg-green-400 dark:bg-green-700"
    return "bg-green-600 dark:bg-green-500"
  }

  const getIntensityBorder = (intensity: number, isToday: boolean) => {
    if (isToday) return "border-2 border-purple-500"
    if (intensity === 0) return "border border-gray-200 dark:border-gray-700"
    return "border border-green-300 dark:border-green-600"
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Activity Streak</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border">
        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-r from-orange-50/60 to-red-50/60 dark:from-orange-900 dark:to-red-950 rounded-xl border border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">{currentStreak}</span>
            </div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900 dark:to-emerald-950 rounded-xl border border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{longestStreak}</span>
            </div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-900 dark:to-indigo-950 rounded-xl border border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{totalActiveDays}</span>
            </div>
            <div className="text-sm text-muted-foreground">Active Days</div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Last 30 Days Activity</h3>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Activity grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Fill empty cells for proper calendar alignment */}
            {Array.from({ length: (7 - (activityData.length % 7)) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8" />
            ))}

            {activityData.map((day, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-md cursor-pointer transition-all duration-200 hover:scale-110 ${getIntensityColor(day.intensity)} ${getIntensityBorder(day.intensity, day.isToday)}`}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                title={`${day.fullDate}: ${day.inkCount} inks`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {day.isToday && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div className="mb-4 p-3 bg-gradient-to-r from-gray-50/60 to-gray-100/60 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-border">
            <div className="text-sm font-medium text-foreground">{hoveredDay.fullDate}</div>
            <div className="text-sm text-muted-foreground">
              {hoveredDay.inkCount > 0
                ? `Wrote ${hoveredDay.inkCount} ink${hoveredDay.inkCount > 1 ? "s" : ""}`
                : "No activity"}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900 border border-green-300 dark:border-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700 border border-green-300 dark:border-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500 border border-green-300 dark:border-green-600" />
          </div>
          <span>More</span>
        </div>

        {/* Motivation */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-900 dark:to-pink-950 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-semibold text-foreground">Keep the Fire Burning!</div>
              <div className="text-sm text-muted-foreground">
                You're on a {currentStreak}-day streak! Write an ink today to keep it going.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
