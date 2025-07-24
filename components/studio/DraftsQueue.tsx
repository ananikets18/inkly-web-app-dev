"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, Edit, Send, Trash2, Eye } from "lucide-react"
import { formatTimeAgo } from "@/utils/formatTimeAgo"

export default function DraftsQueue() {
  // Mock data for drafts
  const drafts = [
    {
      id: "1",
      title: "The Future of Remote Work",
      content:
        "As we navigate the post-pandemic world, remote work has become more than just a temporary solution...",
      wordCount: 847,
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ["remote-work", "productivity", "future"],
      status: "draft",
    },
    {
      id: "2",
      title: "Learning to Say No",
      content:
        "Boundaries aren't walls, they're gates with selective entry. Here's how I learned to protect my time and energy...",
      wordCount: 623,
      lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ["boundaries", "self-care", "productivity"],
      status: "draft",
    },
    {
      id: "3",
      title: "The Art of Deep Listening",
      content:
        "In our noisy world, the ability to truly listen has become a superpower. Here's what I've learned about...",
      wordCount: 1205,
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      tags: ["communication", "relationships", "mindfulness"],
      status: "draft",
    },
  ]

  const DraftCard = ({ item }: { item: any }) => (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1 mb-2">
              {item.title}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {item.content}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {item.wordCount} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Modified {formatTimeAgo(item.lastModified)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-3 h-3 mr-1" />
            Publish
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Drafts</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your unpublished content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Drafts
                </p>
                <p className="text-2xl font-bold">{drafts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Words
                </p>
                <p className="text-2xl font-bold">
                  {drafts.reduce((acc, draft) => acc + draft.wordCount, 0).toLocaleString()}
                </p>
              </div>
              <Edit className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drafts Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Drafts ({drafts.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} item={draft} />
          ))}
        </div>
      </div>
    </div>
  )
}
