"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import ToastPortal from "./ToastPortal"
import {
  Copy,
  Linkedin,
  Twitter,
  Share2,
  Send,
  CheckCircle,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function ShareButton({  url, onShared }: {  url: string; onShared?: () => void }) {
  const [showToast, setShowToast] = useState(false)
  const [isCopyLocked, setIsCopyLocked] = useState(false)
  const encodedURL = encodeURIComponent(url || window.location.href)

  const handleShare = (platform: string) => {
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedURL}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedURL}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedURL}`,
    }

    if (platform === "copy") {
      if (isCopyLocked) return // 🚫 Prevent spam tap
      navigator.clipboard.writeText(url || window.location.href)
      setShowToast(true)
      onShared?.() // trigger callback
        const audio = new Audio("/sound/share_blip.mp3")
        audio.volume = 0.3 // adjust for subtle feedback
        audio.play()
         setIsCopyLocked(true)
        setTimeout(() => setIsCopyLocked(false), 3000) // ⏳ unlock after 3s

    } else {
      window.open(links[platform], "_blank")
      
    }
  }

  // Auto-hide toast
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
            className="text-gray-500 hover:text-blue-600 w-8 h-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          align="end"
          className="w-48 z-50"
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleShare("copy")
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Copy className="w-4 h-4 text-gray-600" />
            <span>Copy Link</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleShare("twitter")
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
            <span>Share on X</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleShare("linkedin")
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Linkedin className="w-4 h-4 text-[#0077B5]" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleShare("whatsapp")
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-green-500" />
            <span>WhatsApp</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🔔 Toast Notification */}
        {showToast && (
        <ToastPortal>
            <div className="fixed bottom-6 right-6 z-[9999] bg-white border rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 animate-fade-in-up">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-800">Ink link copied to clipboard!</span>
            </div>
        </ToastPortal>
        )}

    </>
  )
}
