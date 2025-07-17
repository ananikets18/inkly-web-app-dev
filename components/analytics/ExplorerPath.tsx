"use client"

import { useState } from "react"
import { Compass, PenTool, Eye, MessageCircle, Heart, Share2, ChevronDown, ChevronUp } from "lucide-react"

export default function ExplorerPath() {
  const [isExpanded, setIsExpanded] = useState(false)

  const pathData = [
    {
      action: "Create",
      icon: PenTool,
      count: 48,
      color: "from-purple-400 to-pink-500",
      description: "Inks written",
      nextActions: ["Read", "Share"],
    },
    {
      action: "Read",
      icon: Eye,
      count: 234,
      color: "from-blue-400 to-indigo-500",
      description: "Inks explored",
      nextActions: ["React", "Reflect"],
    },
    {
      action: "React",
      icon: Heart,
      count: 156,
      color: "from-red-400 to-pink-500",
      description: "Hearts given",
      nextActions: ["Reflect", "Share"],
    },
    {
      action: "Reflect",
      icon: MessageCircle,
      count: 89,
      color: "from-green-400 to-emerald-500",
      description: "Reflections shared",
      nextActions: ["Create", "Share"],
    },
    {
      action: "Share",
      icon: Share2,
      count: 67,
      color: "from-yellow-400 to-orange-500",
      description: "Inks shared",
      nextActions: ["Create", "Read"],
    },
  ]

  const userJourneyStyle = "Creative Explorer" // Based on user behavior
  const dominantAction = pathData.reduce((prev, current) => (prev.count > current.count ? prev : current))

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Compass className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Explorer Path</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg border border-border overflow-hidden">
        {/* Collapsible Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-indigo-900/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground">Your Journey Style: {userJourneyStyle}</div>
              <div className="text-sm text-muted-foreground">
                You're most active in: {dominantAction.action.toLowerCase()}ing
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="p-6 pt-0">
            {/* Journey Flow */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Inkly Journey</h3>

              {/* Flow Diagram */}
              <div className="relative">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  {pathData.map((item, index) => {
                    if (index === pathData.length - 1) return null
                    const nextIndex = (index + 1) % pathData.length
                    return (
                      <line
                        key={`line-${index}`}
                        x1={`${20 + index * 160}%`}
                        y1="50%"
                        x2={`${20 + nextIndex * 160}%`}
                        y2="50%"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.6"
                      />
                    )
                  })}
                </svg>

                {/* Action Nodes */}
                <div className="flex flex-wrap justify-center gap-4 relative" style={{ zIndex: 2 }}>
                  {pathData.map((item, index) => (
                    <div
                      key={item.action}
                      className="flex flex-col items-center"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      {/* Node */}
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center shadow-lg mb-2 hover:scale-110 transition-transform cursor-pointer`}
                      >
                        <item.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Label */}
                      <div className="text-center">
                        <div className="font-semibold text-foreground text-sm">{item.action}</div>
                        <div className="text-xs text-muted-foreground">{item.count}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {pathData.map((item, index) => (
                <div
                  key={item.action}
                  className="p-3 bg-white/50 dark:bg-indigo-900 rounded-lg border border-border text-center hover:shadow-md transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                  >
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-lg font-bold text-foreground">{item.count}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              ))}
            </div>

            {/* Journey Insights */}
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-900 dark:to-pink-950 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <dominantAction.icon className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-foreground">Primary Activity</div>
                    <div className="text-sm text-muted-foreground">
                      You love to {dominantAction.action.toLowerCase()} - {dominantAction.count} times this month!
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-900 dark:to-indigo-950 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-foreground">Explorer Style</div>
                    <div className="text-sm text-muted-foreground">
                      You're a balanced creator who enjoys both writing and engaging with others' content.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
