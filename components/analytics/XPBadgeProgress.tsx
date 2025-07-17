'use client';

import React from "react";
import { Trophy, Star, Zap, Target } from "lucide-react";

export default function XPBadgeProgress() {
  const currentXP = 8470;
  const levelXP = 12000;
  const currentLevel = 12;
  const progress = (currentXP / levelXP) * 100;

  const badges = [
    { icon: Trophy, name: "First Echo", unlocked: true, color: "bg-yellow-400" },
    { icon: Star, name: "Viral Quote", unlocked: true, color: "bg-purple-400" },
    { icon: Zap, name: "Reflection Master", unlocked: false, color: "bg-gray-300" },
    { icon: Target, name: "Consistent Creator", unlocked: false, color: "bg-gray-300" }
  ];

  const nextMilestone = "Reflection Master";
  const xpToNext = levelXP - currentXP;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">XP & Badge Progress</h2>
      </div>

      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-800">Level {currentLevel}</div>
            <div className="text-sm text-gray-600">XP: {currentXP.toLocaleString()} / {levelXP.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-600">{xpToNext.toLocaleString()}</div>
            <div className="text-sm text-gray-500">XP to next level</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full h-4 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Level {currentLevel}</span>
            <span>Level {currentLevel + 1}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Badges & Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={badge.name}
                className={`${badge.unlocked ? 'bg-white/50' : 'bg-gray-100/50'} rounded-xl p-4 text-center border border-white/20 transition-all duration-300 hover:scale-105`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <badge.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-700">{badge.name}</div>
                <div className="text-xs text-gray-500">
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Milestone */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 rounded-xl border border-purple-200/30">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-semibold text-gray-800">Next Milestone: {nextMilestone}</div>
              <div className="text-sm text-gray-600">Keep creating reflections to unlock this badge!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
