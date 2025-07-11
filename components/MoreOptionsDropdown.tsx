"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  MoreVertical,
  Copy,
  Share2,
  Flag,
  CheckCircle,
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import ToastPortal from "./ToastPortal"
import ShareModal from "./ShareModal"
import { useSoundEffects } from "../hooks/use-sound-effects"

interface MoreOptionsDropdownProps {
  url: string
  onShared?: () => void
  onReportClick: () => void
}

export default function MoreOptionsDropdown({
  url,
  onShared,
  onReportClick,
}: MoreOptionsDropdownProps) {
  const [showToast, setShowToast] = useState(false)
  const [isCopyLocked, setIsCopyLocked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const { playSound } = useSoundEffects()

  const handleCopy = () => {
    if (isCopyLocked) return
    navigator.clipboard.writeText(url)
    setShowToast(true)
    onShared?.()
    // playSound("share")
    setIsCopyLocked(true)
    setTimeout(() => setIsCopyLocked(false), 3000)
  }

  const handleShareModalClose = useCallback(() => {
    setShowShareModal((prev) => (prev ? false : prev));
  }, []);

  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(timeout)
    }
  }, [showToast])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white w-8 h-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-[18px] h-[18px]" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="min-w-[160px] p-1 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 backdrop-blur-sm z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Copy Link */}
          <DropdownMenuItem
            onClick={handleCopy}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <Copy className="w-4 h-4 text-zinc-500 group-hover:text-purple-600 transition" />
            <span className="text-[13px] md:text-sm">Copy Link</span>
          </DropdownMenuItem>

          {/* Share */}
          <DropdownMenuItem
            onClick={() => setShowShareModal(true)}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <Share2 className="w-4 h-4 text-zinc-500 group-hover:text-blue-600 transition" />
            <span className="text-[13px] md:text-sm">Share</span>
          </DropdownMenuItem>

          {/* Report */}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onReportClick()
            }}
            className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg px-3 py-2 text-sm font-medium"
          >
            <Flag className="w-4 h-4" />
            <span>Report Content</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Toast */}
      {showToast && (
        <ToastPortal>
          <div className="fixed bottom-6 right-6 z-[9999] bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg px-4 py-3 shadow-xl flex items-center gap-2 animate-fade-in-up">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-800 dark:text-gray-200">
              Link copied to clipboard!
            </span>
          </div>
        </ToastPortal>
      )}

      {/* Share Modal */}
      <ShareModal
        open={showShareModal}
        onClose={handleShareModalClose}
        url={url}
      />
    </>
  )
}
