"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Clock, Hash, Trash2 } from "lucide-react"
import FloatingToast from "@/components/FloatingToast"
import { AnimatePresence } from "framer-motion"

interface DraftData {
  id: string
  text: string
  tags: string[]
  visibility: string
  theme: number
  font: string
  mood: string
  timestamp: string
  wordCount: number
  lastModified: string
  title?: string
}

export default function DraftsPage() {
  const [savedDrafts, setSavedDrafts] = useState<DraftData[]>([])
  const router = useRouter()

  // Nudge/Toast states
  const [showFloatingToast, setShowFloatingToast] = useState(false)
  const [floatingToastMessage, setFloatingToastMessage] = useState<React.ReactNode>("")
  const floatingToastTimeout = React.useRef<NodeJS.Timeout | null>(null)

  // Function to show a floating toast
  const showToast = (message: React.ReactNode, duration = 2500) => {
    if (floatingToastTimeout.current) {
      clearTimeout(floatingToastTimeout.current)
    }
    setFloatingToastMessage(message)
    setShowFloatingToast(true)
    floatingToastTimeout.current = setTimeout(() => {
      setShowFloatingToast(false)
    }, duration)
  }

  useEffect(() => {
    loadDrafts()
  }, [])

  const loadDrafts = () => {
    try {
      const drafts = localStorage.getItem("inkly-drafts")
      if (drafts) {
        setSavedDrafts(JSON.parse(drafts))
      }
    } catch (error) {
      console.error("Error loading drafts:", error)
      showToast(<span>Failed to load drafts.</span>)
    }
  }

  const handleLoadDraft = (draft: DraftData) => {
    // Store the draft in sessionStorage to be picked up by the /create page
    sessionStorage.setItem("inkly-loaded-draft", JSON.stringify(draft))
    router.push("/create")
  }

  const handleDeleteDraft = (draftId: string, draftTitle: string) => {
    const updatedDrafts = savedDrafts.filter((d) => d.id !== draftId)
    setSavedDrafts(updatedDrafts)
    localStorage.setItem("inkly-drafts", JSON.stringify(updatedDrafts))
    showToast(<span>Draft '{draftTitle}' deleted.🗑️</span>)
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 w-full h-full">
        <nav className="hidden md:block w-max flex-shrink-0">
          <SideNav />
        </nav>
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-56px)] bg-white dark:bg-gray-900 p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#9333ea]" />
              Your Drafts ({savedDrafts.length})
            </h1>
            <Button onClick={() => router.push("/create")} className="bg-[#9333ea] hover:bg-[#7e22ce]">
              <Plus className="w-4 h-4 mr-2" />
              New Ink
            </Button>
          </div>

          {savedDrafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 dark:text-gray-400">
              <FileText className="w-24 h-24 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No drafts yet</p>
              <p className="text-sm mb-4">Start writing to save your first draft.</p>
              <Button onClick={() => router.push("/create")} className="bg-[#9333ea] hover:bg-[#7e22ce]">
                Create New Ink
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col justify-between hover:border-[#9333ea]/40 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 truncate">
                      {draft.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                      {draft.text || "No content preview available."}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(draft.lastModified).toLocaleDateString()}
                    </span>
                    <span>{draft.wordCount} words</span>
                    {draft.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {draft.tags.length} tags
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadDraft(draft)}
                      className="flex-1 border-[#9333ea] text-[#9333ea] hover:bg-[#9333ea] hover:text-white"
                    >
                      Load Draft
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteDraft(draft.id, draft.title || "Untitled Draft")}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <AnimatePresence>
        {showFloatingToast && <FloatingToast message={floatingToastMessage} duration={2500} />}
      </AnimatePresence>
    </div>
  )
}
