import React from "react";
import { Network, Users, MessageCircle, Share2, TrendingUp } from "lucide-react";

export default function ReflectionSpread() {
  const reflectionData = [
    {
      id: 1,
      quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      reflections: 156,
      shares: 234,
      depth: 4,
      connections: 89,
      color: "from-red-400 to-pink-500",
      story: "This quote sparked a chain reaction of resilience stories across your community."
    },
    {
      id: 2,
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      reflections: 98,
      shares: 156,
      depth: 3,
      connections: 67,
      color: "from-blue-400 to-indigo-500",
      story: "Your audience found strength in these words, creating meaningful discussions."
    },
    {
      id: 3,
      quote: "The only way to do great work is to love what you do.",
      reflections: 78,
      shares: 123,
      depth: 2,
      connections: 45,
      color: "from-green-400 to-emerald-500",
      story: "This quote inspired career reflections and passion-finding conversations."
    }
  ];

  const networkStats = {
    totalReflections: 332,
    totalShares: 513,
    averageDepth: 3,
    totalConnections: 201,
    activeChains: 12
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Network className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Reflection Chains</h2>
      </div>

      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">How your quotes spread inspiration</h3>
          <p className="text-sm text-gray-600">
            Each reflection creates a ripple effect, connecting people through shared wisdom and experiences.
          </p>
        </div>

        {/* Network Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/50 rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-purple-600">{networkStats.totalReflections}</div>
            <div className="text-sm text-gray-600">Total Reflections</div>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-blue-600">{networkStats.totalShares}</div>
            <div className="text-sm text-gray-600">Total Shares</div>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-green-600">{networkStats.averageDepth}</div>
            <div className="text-sm text-gray-600">Avg. Depth</div>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-orange-600">{networkStats.totalConnections}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-pink-600">{networkStats.activeChains}</div>
            <div className="text-sm text-gray-600">Active Chains</div>
          </div>
        </div>

        {/* Radial Network Visualization */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-700 mb-4">Reflection Network</h4>
          <div className="relative h-80 bg-gradient-to-br from-purple-50/60 to-pink-50/60 rounded-xl border border-purple-200/30 overflow-hidden">
            {/* Center Node */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full">
              {/* First Ring */}
              <circle cx="50%" cy="50%" r="80" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
              <circle cx="50%" cy="50%" r="120" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
              <circle cx="50%" cy="50%" r="160" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
              
              {/* Connection Lines */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const x1 = 50 + 8 * Math.cos(angle);
                const y1 = 50 + 8 * Math.sin(angle);
                const x2 = 50 + 120 * Math.cos(angle);
                const y2 = 50 + 120 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                );
              })}
            </svg>

            {/* Outer Nodes */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45) * (Math.PI / 180);
              const x = 50 + 120 * Math.cos(angle);
              const y = 50 + 120 * Math.sin(angle);
              const colors = [
                "from-red-400 to-pink-500",
                "from-blue-400 to-indigo-500", 
                "from-green-400 to-emerald-500",
                "from-yellow-400 to-orange-500",
                "from-purple-400 to-pink-500",
                "from-indigo-400 to-purple-500",
                "from-pink-400 to-red-500",
                "from-emerald-400 to-teal-500"
              ];
              
              return (
                <div
                  key={i}
                  className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className={`w-full h-full bg-gradient-to-r ${colors[i]} rounded-full shadow-lg border-2 border-white`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Reflection Chains */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Top Reflection Chains</h4>
          <div className="space-y-4">
            {reflectionData.map((chain, index) => (
              <div
                key={chain.id}
                className="bg-white/50 rounded-xl p-4 border border-white/20 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${chain.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">#{index + 1}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">Depth: {chain.depth}</div>
                    <div className="text-xs text-gray-500">{chain.connections} connections</div>
                  </div>
                </div>

                <blockquote className="text-gray-800 font-medium leading-relaxed mb-3 text-sm">
                  "{chain.quote}"
                </blockquote>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{chain.reflections}</div>
                    <div className="text-xs text-gray-500">Reflections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{chain.shares}</div>
                    <div className="text-xs text-gray-500">Shares</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{chain.connections}</div>
                    <div className="text-xs text-gray-500">Connections</div>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-gray-50/60 to-gray-100/60 rounded-lg border border-gray-200/30">
                  <p className="text-sm text-gray-600 leading-relaxed">{chain.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 rounded-xl border border-purple-200/30">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-semibold text-gray-800">Viral Potential</div>
                <div className="text-sm text-gray-600">
                  Your quotes have an average reach depth of {networkStats.averageDepth} levels
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 rounded-xl border border-blue-200/30">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-800">Community Growth</div>
                <div className="text-sm text-gray-600">
                  {networkStats.totalConnections} new connections formed through reflections
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50/60 to-emerald-50/60 rounded-xl border border-green-200/30">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-gray-800">Growing Impact</div>
              <div className="text-sm text-gray-600">
                Your quotes are creating meaningful conversations across {networkStats.activeChains} active reflection chains. 
                Each share multiplies your impact, spreading inspiration far beyond your immediate audience.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
