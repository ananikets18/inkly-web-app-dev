'use client';

import React from "react";
import { Calendar, Star, Users, Zap, Target, Award } from "lucide-react";

export default function InkMilestones() {
  const milestones = [
    {
      id: 1,
      title: "First Ink",
      date: "Jan 15",
      description: "Your journey began with your first quote",
      icon: Star,
      unlocked: true,
      color: "from-yellow-400 to-orange-500",
      achievement: "First step taken"
    },
    {
      id: 2,
      title: "10 Followers",
      date: "Jan 28",
      description: "Building your first community",
      icon: Users,
      unlocked: true,
      color: "from-blue-400 to-indigo-500",
      achievement: "Community builder"
    },
    {
      id: 3,
      title: "Viral Quote",
      date: "Feb 12",
      description: "Your quote reached 1,000+ reactions",
      icon: Zap,
      unlocked: true,
      color: "from-purple-400 to-pink-500",
      achievement: "Viral sensation"
    },
    {
      id: 4,
      title: "100 Inks",
      date: "Mar 5",
      description: "Consistent creator milestone",
      icon: Target,
      unlocked: false,
      color: "from-gray-300 to-gray-400",
      achievement: "Coming soon"
    },
    {
      id: 5,
      title: "Top Creator",
      date: "Mar 20",
      description: "Ranked in top 10% of creators",
      icon: Award,
      unlocked: false,
      color: "from-gray-300 to-gray-400",
      achievement: "Future goal"
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Ink Journey Timeline</h2>
      </div>

      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your creative milestones</h3>
          <p className="text-sm text-gray-600">
            Every quote you share adds to your story. Here's how far you've come and what's ahead.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400"></div>
          
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`relative flex items-start gap-4 transition-all duration-500 ${
                  milestone.unlocked ? 'opacity-100' : 'opacity-60'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Milestone Dot */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${milestone.color} flex items-center justify-center shadow-lg border-2 border-white`}>
                    <milestone.icon className="w-8 h-8 text-white" />
                  </div>
                  {milestone.unlocked && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white/50 rounded-xl p-4 border border-white/20 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                    <span className="text-sm text-gray-500">{milestone.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-100/60 to-pink-100/60 rounded-full">
                      <span className="text-xs font-medium text-purple-700">{milestone.achievement}</span>
                    </div>
                    {milestone.unlocked && (
                      <div className="px-3 py-1 bg-green-100/60 rounded-full">
                        <span className="text-xs font-medium text-green-700">Unlocked</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 rounded-xl border border-purple-200/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800">Journey Progress</div>
              <div className="text-sm text-gray-600">
                {milestones.filter(m => m.unlocked).length} of {milestones.length} milestones completed
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((milestones.filter(m => m.unlocked).length / milestones.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
              style={{ 
                width: `${(milestones.filter(m => m.unlocked).length / milestones.length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Next Milestone */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 rounded-xl border border-blue-200/30">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-800">Next Milestone: 100 Inks</div>
              <div className="text-sm text-gray-600">
                You're 23 inks away from your next achievement. Keep creating!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
