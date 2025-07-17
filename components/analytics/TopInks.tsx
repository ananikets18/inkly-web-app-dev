import React from "react";
import { TrendingUp, Heart, Bookmark, MessageCircle, Eye, Share2 } from "lucide-react";

export default function TopInks() {
  const topInks = [
    {
      id: 1,
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela",
      reactions: 1247,
      bookmarks: 89,
      reflections: 156,
      views: 15420,
      shares: 234,
      performance: "viral",
      color: "from-red-400 to-pink-500",
      story: "This quote resonated deeply with your audience, becoming your most shared ink."
    },
    {
      id: 2,
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      reactions: 892,
      bookmarks: 67,
      reflections: 98,
      views: 12340,
      shares: 156,
      performance: "trending",
      color: "from-blue-400 to-indigo-500",
      story: "Your audience finds motivation in these words of resilience."
    },
    {
      id: 3,
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      reactions: 756,
      bookmarks: 45,
      reflections: 78,
      views: 9870,
      shares: 123,
      performance: "popular",
      color: "from-green-400 to-emerald-500",
      story: "This quote inspires your community to pursue their passions."
    },
    {
      id: 4,
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
      reactions: 634,
      bookmarks: 38,
      reflections: 67,
      views: 7650,
      shares: 89,
      performance: "steady",
      color: "from-purple-400 to-pink-500",
      story: "A reminder that life's beauty lies in unexpected moments."
    }
  ];

  const getPerformanceBadge = (performance: string) => {
    const badges = {
      viral: { text: "Viral", color: "bg-red-100 text-red-700" },
      trending: { text: "Trending", color: "bg-blue-100 text-blue-700" },
      popular: { text: "Popular", color: "bg-green-100 text-green-700" },
      steady: { text: "Steady", color: "bg-purple-100 text-purple-700" }
    };
    return badges[performance as keyof typeof badges];
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Top Performing Inks</h2>
      </div>

      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your most impactful quotes</h3>
          <p className="text-sm text-gray-600">
            These are the quotes that resonated most with your audience. Each one tells a story of connection and inspiration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topInks.map((ink, index) => {
            const badge = getPerformanceBadge(ink.performance);
            return (
              <div
                key={ink.id}
                className="bg-white dark:bg-indigo-950 rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${ink.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">#{index + 1}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                    {badge.text}
                  </div>
                </div>

                {/* Quote */}
                <div className="mb-4">
                  <blockquote className="text-foreground font-medium leading-relaxed mb-2">
                    "{ink.text}"
                  </blockquote>
                  <cite className="text-sm text-muted-foreground">— {ink.author}</cite>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-foreground">{ink.reactions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-foreground">{ink.bookmarks.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-foreground">{ink.reflections.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-foreground">{ink.views.toLocaleString()}</span>
                  </div>
                </div>

                {/* Story */}
                <div className="p-3 bg-gradient-to-r from-gray-50/60 to-gray-100/60 dark:from-indigo-900 dark:to-indigo-950 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">{ink.story}</p>
                </div>

                {/* Engagement Rate */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Engagement Rate: {Math.round(((ink.reactions + ink.bookmarks + ink.reflections) / ink.views) * 100 * 100) / 100}%
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Share2 className="w-3 h-3" />
                    {ink.shares.toLocaleString()} shares
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-indigo-900 dark:to-pink-950 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground">Performance Summary</div>
              <div className="text-sm text-muted-foreground">
                Total engagement across top inks: {topInks.reduce((sum, ink) => sum + ink.reactions + ink.bookmarks + ink.reflections, 0).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(topInks.reduce((sum, ink) => sum + ink.views, 0) / 1000)}K
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
