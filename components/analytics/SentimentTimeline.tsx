'use client';

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Heart, Frown, Meh, Smile } from "lucide-react";

export default function SentimentTimeline() {
  const sentimentData = [
    { date: "Mon", positive: 65, neutral: 25, negative: 10, overall: 75 },
    { date: "Tue", positive: 72, neutral: 20, negative: 8, overall: 82 },
    { date: "Wed", positive: 58, neutral: 30, negative: 12, overall: 68 },
    { date: "Thu", positive: 80, neutral: 15, negative: 5, overall: 88 },
    { date: "Fri", positive: 85, neutral: 10, negative: 5, overall: 92 },
    { date: "Sat", positive: 78, neutral: 18, negative: 4, overall: 85 },
    { date: "Sun", positive: 82, neutral: 12, negative: 6, overall: 89 }
  ];

  const emotions = [
    { name: "Joy", icon: Smile, color: "text-green-500", percentage: 45 },
    { name: "Inspiration", icon: Heart, color: "text-pink-500", percentage: 32 },
    { name: "Contemplation", icon: Meh, color: "text-yellow-500", percentage: 18 },
    { name: "Concern", icon: Frown, color: "text-red-500", percentage: 5 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-green-600">Positive: {payload[0].value}%</p>
          <p className="text-yellow-600">Neutral: {payload[1].value}%</p>
          <p className="text-red-600">Negative: {payload[2].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Emotional Sentiment Timeline</h2>
      </div>

      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">How your audience feels</h3>
          <p className="text-sm text-gray-600">
            Your quotes are spreading joy and inspiration! The emotional response has been overwhelmingly positive this week.
          </p>
        </div>

        {/* Sentiment Chart */}
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sentimentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="positive" 
                stroke="#10b981" 
                strokeWidth={3}
                fill="url(#positiveGradient)"
                stackId="1"
              />
              <Area 
                type="monotone" 
                dataKey="neutral" 
                stroke="#f59e0b" 
                strokeWidth={3}
                fill="url(#neutralGradient)"
                stackId="1"
              />
              <Area 
                type="monotone" 
                dataKey="negative" 
                stroke="#ef4444" 
                strokeWidth={3}
                fill="url(#negativeGradient)"
                stackId="1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Emotion Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Emotion Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emotions.map((emotion, index) => (
              <div
                key={emotion.name}
                className="bg-white/50 rounded-xl p-4 text-center border border-white/20 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center`}>
                  <emotion.icon className={`w-5 h-5 ${emotion.color}`} />
                </div>
                <div className="text-sm font-medium text-gray-700">{emotion.name}</div>
                <div className="text-lg font-bold text-gray-800">{emotion.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50/60 to-blue-50/60 rounded-xl border border-green-200/30">
          <div className="flex items-center gap-3">
            <Smile className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-gray-800">Positive Trend</div>
              <div className="text-sm text-gray-600">
                Your audience engagement is 15% more positive than last week. Keep sharing those inspiring quotes!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
