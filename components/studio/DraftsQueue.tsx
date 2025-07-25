"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Edit, Send, Trash2, Eye, MoreHorizontal, Grid3X3, List } from "lucide-react"
import { formatTimeAgo } from "@/utils/formatTimeAgo"
import { truncate } from "@/utils/truncate"
import { ModalSystem, useModalSystem } from "./modals/ModalSystem"
import { useToast } from "@/hooks/use-toast"

export default function DraftsQueue() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const { isOpen, modalData, openModal, closeModal } = useModalSystem()
  const { toast } = useToast()

  // Mock data for drafts
  const [drafts, setDrafts] = useState([
    {
      id: "1",
      content:
        "As we navigate the post-pandemic world, remote work has become more than just a temporary solution. It's fundamentally changing how we think about productivity, work-life balance, and human connection in professional settings. The implications are far-reaching and will shape the future of work for generations to come.",
      wordCount: 847,
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "draft",
      readingTime: { minutes: 4, seconds: 15, text: "4 min read" },
    },
    {
      id: "2",
      content:
        "Boundaries aren't walls, they're gates with selective entry. Here's how I learned to protect my time and energy while still being available for the people and opportunities that matter most. The journey wasn't easy, but it was necessary.",
      wordCount: 623,
      lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "draft",
      readingTime: { minutes: 3, seconds: 30, text: "3 min read" },
    },
    {
      id: "3",
      content:
        "In our noisy world, the ability to truly listen has become a superpower. Here's what I've learned about the art of deep listening and how it can transform your relationships, both personal and professional.",
      wordCount: 1205,
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "draft",
      readingTime: { minutes: 6, seconds: 0, text: "6 min read" },
    },
    {
      id: "4",
      content:
        "The morning ritual that changed everything. How 15 minutes of intentional silence transformed my entire approach to creativity and problem-solving.",
      wordCount: 456,
      lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "draft",
      readingTime: { minutes: 2, seconds: 30, text: "2 min read" },
    },
  ])

  const handleDeleteDraft = (draftId: string) => {
    const draft = drafts.find((d) => d.id === draftId)
    if (!draft) return

    openModal({
      type: "delete-confirmation",
      title: "Delete Draft",
      description: "This draft will be permanently deleted and cannot be recovered.",
      onConfirm: () => {
        setDrafts((prev) => prev.filter((d) => d.id !== draftId))
        toast({
          title: "Draft deleted",
          description: "Your draft has been successfully deleted.",
        })
      },
    })
  }

  const handleEditDraft = (draftId: string) => {
    const draft = drafts.find((d) => d.id === draftId)
    if (!draft) return

    openModal({
      type: "edit-content",
      title: "Edit Draft",
      content: draft.content,
      onSave: (newContent: string) => {
        setDrafts((prev) =>
          prev.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  content: newContent,
                  wordCount: newContent.split(" ").length,
                  lastModified: new Date(),
                }
              : d,
          ),
        )
        toast({
          title: "Draft updated",
          description: "Your changes have been saved successfully.",
        })
      },
    })
  }

  const handlePreviewDraft = (draftId: string) => {
    const draft = drafts.find((d) => d.id === draftId)
    if (!draft) return

    openModal({
      type: "preview-content",
      content: draft.content,
      wordCount: draft.wordCount,
    })
  }

  const handlePublishDraft = (draftId: string) => {
    const draft = drafts.find((d) => d.id === draftId)
    if (!draft) return

    openModal({
      type: "publish-confirmation",
      onConfirm: () => {
        setDrafts((prev) => prev.filter((d) => d.id !== draftId))
        toast({
          title: "Draft published",
          description: "Your draft has been successfully published as an ink.",
        })
      },
    })
  }

  const CompactDraftCard = ({ draft }: { draft: (typeof drafts)[0] }) => {
    const [isHovered, setIsHovered] = useState(false)
    const displayContent = truncate(draft.content, 280)
    const timeAgo = formatTimeAgo(draft.lastModified)

    return (
      <motion.div
        className={`group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-lg dark:shadow-slate-900/20 transition-all duration-300 cursor-pointer overflow-hidden ${
          isHovered ? "scale-[1.005] shadow-xl dark:shadow-slate-900/40" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handlePreviewDraft(draft.id)}
      >
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-amber-500 dark:bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            Draft
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Header with meta info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Modified {timeAgo}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <span>{draft.readingTime.text}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3 h-3" />
                <span className="font-medium">{draft.wordCount} words</span>
              </div>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  // Could open a dropdown menu here
                }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-5">
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base font-normal">
              {displayContent}
            </p>
            {draft.content.length > 280 && (
              <button className="text-violet-600 dark:text-violet-400 text-sm font-medium mt-3 hover:underline transition-colors">
                Read more
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Last saved automatically</span>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditDraft(draft.id)
                }}
              >
                <Edit className="w-3 h-3 mr-1.5" />
                Edit
              </Button>
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePublishDraft(draft.id)
                }}
              >
                <Send className="w-3 h-3 mr-1.5" />
                Publish
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreviewDraft(draft.id)
                }}
              >
                <Eye className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteDraft(draft.id)
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const GridDraftCard = ({ draft }: { draft: (typeof drafts)[0] }) => {
    const [isHovered, setIsHovered] = useState(false)
    const displayContent = truncate(draft.content, 200)
    const timeAgo = formatTimeAgo(draft.lastModified)

    return (
      <motion.div
        className={`group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-lg dark:shadow-slate-900/20 transition-all duration-300 cursor-pointer overflow-hidden ${
          isHovered ? "scale-[1.01] shadow-xl dark:shadow-slate-900/40" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handlePreviewDraft(draft.id)}
      >
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-amber-500 dark:bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            Draft
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Header with meta info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Modified {timeAgo}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <span>{draft.readingTime.text}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span className="font-medium">{draft.wordCount}</span>
              </div>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  // Could open a dropdown menu here
                }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-5">
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm font-normal">
              {displayContent}
            </p>
            {draft.content.length > 200 && (
              <button className="text-violet-600 dark:text-violet-400 text-sm font-medium mt-3 hover:underline transition-colors">
                Read more
              </button>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 mb-5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Auto-saved</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{draft.wordCount} words</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation()
                handleEditDraft(draft.id)
              }}
            >
              <Edit className="w-3 h-3 mr-1.5" />
              Edit
            </Button>
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={(e) => {
                e.stopPropagation()
                handlePublishDraft(draft.id)
              }}
            >
              <Send className="w-3 h-3 mr-1.5" />
              Publish
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation()
                handlePreviewDraft(draft.id)
              }}
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteDraft(draft.id)
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Drafts
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                {drafts.length} drafts • {drafts.reduce((acc, draft) => acc + draft.wordCount, 0).toLocaleString()}{" "}
                total words
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-9 px-4 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-9 px-4 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Drafts</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{drafts.length}</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Words</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {drafts.reduce((acc, draft) => acc + draft.wordCount, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                      <Edit className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Avg. Length</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {Math.round(drafts.reduce((acc, draft) => acc + draft.wordCount, 0) / drafts.length)}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                      <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Ready to Publish</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {drafts.filter((d) => d.wordCount > 300).length}
                      </p>
                    </div>
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                      <Send className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Drafts Display */}
          <div className="relative">
            {viewMode === "list" ? (
              <div className="space-y-4 sm:space-y-6">
                {drafts.map((draft, index) => (
                  <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CompactDraftCard draft={draft} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {drafts.map((draft, index) => (
                  <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GridDraftCard draft={draft} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Empty state */}
          {drafts.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No drafts yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Start writing to create your first draft.</p>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">Start Writing</Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal System */}
      <ModalSystem isOpen={isOpen} modalData={modalData} onClose={closeModal} />
    </div>
  )
}
