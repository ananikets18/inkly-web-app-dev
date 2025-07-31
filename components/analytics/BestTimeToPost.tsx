"use client"
import { Clock, TrendingUp, Calendar } from "lucide-react"

export default function BestTimeToPost() {
  const bestTimes = [
    { day: "Monday", time: "9:00 AM", engagement: 89, color: "from-blue-400 to-indigo-500" },
    { day: "Wednesday", time: "7:00 PM", engagement: 92, color: "from-purple-400 to-pink-500" },
    { day: "Friday", time: "6:00 PM", engagement: 78, color: "from-green-400 to-emerald-500" },
    { day: "Sunday", time: "10:00 AM", engagement: 85, color: "from-orange-400 to-red-500" },
  ]

  const currentBestTime = bestTimes.reduce((prev, current) => 
    prev.engagement > current.engagement ? prev : current
  )

  const timeSlots = [
    { hour: "6-9 AM", engagement: 67, label: "Morning" },
    { hour: "9-12 PM", engagement: 89, label: "Late Morning" },
    { hour: "12-3 PM", engagement: 45, label: "Afternoon" },
    { hour: "3-6 PM", engagement: 72, label: "Late Afternoon" },
    { hour: "6-9 PM", engagement: 94, label: "Evening" },
    { hour: "9-12 AM", engagement: 38, label: "Night" },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Best Time to Post</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border">
        {/* Top Recommendation */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${currentBestTime.color} rounded-full mb-4 shadow-lg`}>
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{currentBestTime.day}</div>
          <div className="text-lg text-muted-foreground font-medium">{currentBestTime.time}</div>
          <div className="text-sm text-green-600 font-medium">+{currentBestTime.engagement}% engagement</div>
        </div>

        {/* Time Slots Performance */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Engagement by Time</h4>
          <div className="space-y-2">
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50/60 dark:bg-gray-800/60 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{slot.label}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{slot.engagement}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-900 dark:to-pink-950 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold text-gray-700">Weekly Schedule</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {bestTimes.map((time, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">{time.day}</span>
                <span className="text-gray-600 dark:text-gray-400">{time.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900 dark:to-emerald-950 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Tip:</strong> Post during peak hours (6-9 PM) for maximum reach
            </span>
          </div>
        </div>
      </div>
    </section>
  )
} 