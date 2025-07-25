"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, XCircle, Info, Edit, Eye, Send, Pin, PinOff } from "lucide-react"

export type ModalType =
  | "delete-confirmation"
  | "edit-content"
  | "preview-content"
  | "success-feedback"
  | "error-feedback"
  | "info"
  | "publish-confirmation"
  | "analytics-preview"
  | "share-options"
  | "pin-confirmation"

export interface ModalData {
  type: ModalType
  title?: string
  description?: string
  content?: string
  wordCount?: number
  onConfirm?: () => void
  onCancel?: () => void
  onSave?: (content: string) => void
  data?: any
}

interface ModalSystemProps {
  isOpen: boolean
  modalData: ModalData | null
  onClose: () => void
}

export function ModalSystem({ isOpen, modalData, onClose }: ModalSystemProps) {
  const [editContent, setEditContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (modalData?.content) {
      setEditContent(modalData.content)
    }
  }, [modalData])

  const handleConfirm = async () => {
    if (!modalData?.onConfirm) return

    setIsLoading(true)
    try {
      await modalData.onConfirm()
      onClose()
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!modalData?.onSave) return

    setIsLoading(true)
    try {
      await modalData.onSave(editContent)
      onClose()
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderModalContent = () => {
    if (!modalData) return null

    switch (modalData.type) {
      case "delete-confirmation":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    {modalData.title || "Delete Item"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {modalData.description || "This action cannot be undone."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={onClose} disabled={isLoading} className="bg-transparent">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </>
        )

      case "edit-content":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    {modalData.title || "Edit Content"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Make changes to your content below.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="content" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Content
              </Label>
              <Textarea
                id="content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="mt-2 min-h-[200px] resize-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                placeholder="Write your content here..."
              />
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{editContent.length} characters</span>
                <span>~{Math.ceil(editContent.split(" ").length / 200)} min read</span>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={onClose} disabled={isLoading} className="bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading || !editContent.trim()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </>
        )

      case "preview-content":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Content Preview
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {modalData.wordCount &&
                      `${modalData.wordCount} words • ~${Math.ceil(modalData.wordCount / 200)} min read`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4 max-h-[400px] overflow-y-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {modalData.content}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose} className="bg-violet-600 hover:bg-violet-700">
                Close
              </Button>
            </DialogFooter>
          </>
        )

      case "success-feedback":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    {modalData.title || "Success!"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {modalData.description || "Your action was completed successfully."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                Continue
              </Button>
            </DialogFooter>
          </>
        )

      case "error-feedback":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    {modalData.title || "Error"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {modalData.description || "Something went wrong. Please try again."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={onClose} variant="outline" className="bg-transparent">
                Close
              </Button>
            </DialogFooter>
          </>
        )

      case "publish-confirmation":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                  <Send className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Publish Content
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Are you ready to publish this content? It will be visible to all users.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={onClose} disabled={isLoading} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isLoading} className="bg-violet-600 hover:bg-violet-700">
                {isLoading ? "Publishing..." : "Publish"}
              </Button>
            </DialogFooter>
          </>
        )

      case "pin-confirmation":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  {modalData.data?.isPinned ? (
                    <PinOff className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Pin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    {modalData.data?.isPinned ? "Unpin Content" : "Pin Content"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {modalData.data?.isPinned
                      ? "This content will no longer be pinned to the top."
                      : "This content will be pinned to the top of your profile."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={onClose} disabled={isLoading} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? "Updating..." : modalData.data?.isPinned ? "Unpin" : "Pin"}
              </Button>
            </DialogFooter>
          </>
        )

      default:
        return (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    {modalData.title || "Information"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {modalData.description}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={onClose} className="bg-violet-600 hover:bg-violet-700">
                Close
              </Button>
            </DialogFooter>
          </>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderModalContent()}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

// Hook for managing modal state
export function useModalSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)

  const openModal = (data: ModalData) => {
    setModalData(data)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setTimeout(() => setModalData(null), 200) // Delay to allow exit animation
  }

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
  }
}
