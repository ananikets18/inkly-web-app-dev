'use client';

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Users, Globe, Clock, TrendingUp, MapPin } from "lucide-react";

export default function AudienceSnapshot() {
  const followerData = [
    { date: "Jan", followers: 120, new: 20 },
    { date: "Feb", followers: 180, new: 60 },
    { date: "Mar", followers: 250, new: 70 },
    { date: "Apr", followers: 320, new: 70 },
    { date: "May", followers: 410, new: 90 },
    { date: "Jun", followers: 520, new: 110 }
  ];

  const countries = [
    { name: "United States", followers: 234, percentage: 45, flag: "🇺🇸" },
    { name: "United Kingdom", followers: 89, percentage: 17, flag: "🇬🇧" },
    { name: "Canada", followers: 67, percentage: 13, flag: "🇨🇦" },
    { name: "Australia", followers: 45, percentage: 9, flag: "🇦🇺" },
    { name: "Germany", followers: 34, percentage: 7, flag: "🇩🇪" },
    { name: "Others", followers: 51, percentage: 9, flag: "🌍" }
  ];

  const timezones = [
    { name: "EST (UTC-5)", users: 156, percentage: 30 },
    { name: "PST (UTC-8)", users: 134, percentage: 26 },
    { name: "GMT (UTC+0)", users: 89, percentage: 17 },
    { name: "CET (UTC+1)", users: 67, percentage: 13 },
    { name: "AEST (UTC+10)", users: 45, percentage: 9 },
    { name: "Others", users: 29, percentage: 6 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">Total: {payload[0].value}</p>
          <p className="text-green-600">New: +{payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Audience Insights</h2>
      </div>

      <div className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 border border-border">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your growing community</h3>
          <p className="text-sm text-gray-600">
            Your audience spans across the globe, connecting through shared inspiration and wisdom.
          </p>
        </div>

        {/* Followers Growth Chart */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-700">Followers Over Time</h4>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">520</div>
              <div className="text-sm text-gray-500">Total Followers</div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={followerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="followersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
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
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="followers" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fill="url(#followersGradient)"
                />
                <Area 
                  type="monotone" 
                  dataKey="new" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#newGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Countries and Timezones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Countries */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-gray-600" />
              <h4 className="font-semibold text-gray-700">Top Countries</h4>
            </div>
            
            <div className="space-y-3">
              {countries.map((country, index) => (
                <div
                  key={country.name}
                  className="flex items-center justify-between p-3 bg-white dark:bg-indigo-900 rounded-lg border border-border"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{country.flag}</span>
                    <div>
                      <div className="font-medium text-foreground">{country.name}</div>
                      <div className="text-sm text-muted-foreground">{country.followers} followers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{country.percentage}%</div>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timezones */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-600" />
              <h4 className="font-semibold text-gray-700">Active Timezones</h4>
            </div>
            
            <div className="space-y-3">
              {timezones.map((tz, index) => (
                <div
                  key={tz.name}
                  className="flex items-center justify-between p-3 bg-white dark:bg-indigo-900 rounded-lg border border-border"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div>
                    <div className="font-medium text-foreground">{tz.name}</div>
                    <div className="text-sm text-muted-foreground">{tz.users} users</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{tz.percentage}%</div>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                        style={{ width: `${tz.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-indigo-900 dark:to-indigo-950 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-800">Growth Rate</div>
                <div className="text-sm text-gray-600">+18% this month</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-900 dark:to-emerald-950 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-semibold text-gray-800">Global Reach</div>
                <div className="text-sm text-gray-600">6 countries</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-indigo-900 dark:to-pink-950 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-semibold text-gray-800">Peak Activity</div>
                <div className="text-sm text-gray-600">8 PM EST</div>
              </div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50/60 to-orange-50/60 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="font-semibold text-gray-800">Global Community</div>
              <div className="text-sm text-gray-600">
                Your quotes are inspiring people across 6 countries! Your audience is most active in the evening hours, 
                perfect timing for reflection and inspiration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
