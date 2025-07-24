"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Grid3X3,
  List,
  Eye,
  Heart,
  Bookmark,
  MessageCircle,
  Edit,
  Trash2,
  BarChart3,
  Pin,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
  Calendar,
  Clock,
} from "lucide-react"
import { formatTimeAgo } from "@/utils/formatTimeAgo"
import { formatCount } from "@/utils/formatCount"

export default function InksOverview() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  // Mock data for inks
  const inks = [
    {
      id: "1",
      title: "The Art of Mindful Writing",
      content:
        "In a world filled with distractions, finding moments of clarity through writing has become more important than ever...",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      views: 1247,
      reactions: 89,
      bookmarks: 34,
      reflections: 12,
      tags: ["mindfulness", "writing", "creativity"],
      isPinned: true,
      trend: "up" as const,
      readingTime: "3 min read",
    },
    {
      id: "2",
      title: "Building Better Habits",
      content:
        "Small changes compound over time. Here's how I transformed my daily routine and why consistency matters more than perfection...",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      views: 892,
      reactions: 67,
      bookmarks: 28,
      reflections: 8,
      tags: ["habits", "productivity", "self-improvement"],
      isPinned: false,
      trend: "stable" as const,
      readingTime: "5 min read",
    },
    {
      id: "3",
      title: "The Power of Vulnerability",
      content:
        "Sharing our struggles isn't weakness—it's courage. This post explores how vulnerability creates deeper connections...",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      views: 2156,
      reactions: 143,
      bookmarks: 67,
      reflections: 23,
      tags: ["vulnerability", "relationships", "growth"],
      isPinned: false,
      trend: "up" as const,
      readingTime: "4 min read",
    },
    {
      id: "4",
      title: "Digital Minimalism Journey",
      content:
        "After 30 days of digital detox, here's what I learned about our relationship with technology and social media...",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      views: 567,
      reactions: 34,
      bookmarks: 15,
      reflections: 6,
      tags: ["minimalism", "technology", "wellness"],
      isPinned: false,
      trend: "down" as const,
      readingTime: "6 min read",
    },
  ]

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />
      default:
        return <Minus className="w-3 h-3 text-gray-400" />
    }
  }

  const CompactInkCard = ({ ink }: { ink: (typeof inks)[0] }) => (
    <Card className="group hover:shadow-md transition-all duration-200 border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base line-clamp-1">
                {ink.title}
              </h3>
              {ink.isPinned && <Pin className="w-3 h-3 text-purple-500 fill-current flex-shrink-0" />}
              {getTrendIcon(ink.trend)}
            </div>

            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{ink.content}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {ink.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
              {ink.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{ink.tags.length - 2}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatTimeAgo(ink.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{ink.readingTime}</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Eye className="w-3 h-3" />
                <span className="font-medium">{formatCount(ink.views)}</span>
              </div>
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <Heart className="w-3 h-3" />
                <span className="font-medium">{formatCount(ink.reactions)}</span>
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <MessageCircle className="w-3 h-3" />
                <span className="font-medium">{formatCount(ink.reflections)}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <Bookmark className="w-3 h-3" />
                <span className="font-medium">{formatCount(ink.bookmarks)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <Edit className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <BarChart3 className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const GridInkCard = ({ ink }: { ink: (typeof inks)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-base lg:text-lg font-semibold line-clamp-1">{ink.title}</CardTitle>
              {ink.isPinned && <Pin className="w-4 h-4 text-purple-500 fill-current" />}
              {getTrendIcon(ink.trend)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{ink.content}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {ink.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{formatTimeAgo(ink.createdAt)}</span>
          <span>{ink.readingTime}</span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium">{formatCount(ink.views)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium">{formatCount(ink.reactions)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium">{formatCount(ink.reflections)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium">{formatCount(ink.bookmarks)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <BarChart3 className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Pin className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Your Inks</h2>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            {inks.length} published • Track performance and engagement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="bg-white dark:bg-gray-800"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="bg-white dark:bg-gray-800"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Inks Display */}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {inks.map((ink) => (
            <CompactInkCard key={ink.id} ink={ink} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {inks.map((ink) => (
            <GridInkCard key={ink.id} ink={ink} />
          ))}
        </div>
      )}
    </div>
  )
}
