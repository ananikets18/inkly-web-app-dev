'use client';

import React from "react";
import { Heart, Bookmark, MessageCircle, TrendingUp } from "lucide-react";

export default function EchoSummary() {
  const echoData = [
    {
      title: "Reactions",
      count: 1247,
      change: "+12%",
      icon: Heart,
      color: "from-red-400 to-pink-500",
      bgColor: "bg-red-50/60",
      story: "Your words are resonating! 12% more hearts this week."
    },
    {
      title: "Bookmarks",
      count: 89,
      change: "+23%",
      icon: Bookmark,
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50/60",
      story: "Readers are saving your insights for later inspiration."
    },
    {
      title: "Reflections",
      count: 156,
      change: "+8%",
      icon: MessageCircle,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50/60",
      story: "Your quotes are sparking meaningful conversations."
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Echo Summary</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {echoData.map((item, index) => (
          <div
            key={item.title}
            className={`bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">{item.change}</div>
                <div className="text-xs text-muted-foreground">vs last week</div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="text-3xl font-bold text-foreground">{item.count.toLocaleString()}</div>
              <div className="text-muted-foreground font-medium">{item.title}</div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">{item.story}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
