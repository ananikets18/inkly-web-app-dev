"use client"

import { Copy, Linkedin, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import ToastPortal from "./ToastPortal"
import { CheckCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSoundEffects } from "../hooks/useSoundEffects"

export default function ShareModal({
  open,
  onClose,
  url,
}: {
  open: boolean
  onClose: () => void
  url: string
}) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("Link copied to clipboard!")
  const [copyLocked, setCopyLocked] = useState(false)
  const { playSound } = useSoundEffects()

  // Play modal open sound when modal opens
  useEffect(() => {
    if (open) {
      playSound("modalOpen");
    }
  }, [open, playSound]);

  const handleCopy = () => {
    if (copyLocked) return;

    navigator.clipboard.writeText(url);
    setShowToast(true);
    playSound("share");

    setCopyLocked(true);

    setTimeout(() => {
        setCopyLocked(false);
        onClose(); // 🔒 auto-close modal
    }, 1500); // enough time for toast animation
  };

  const handleSocialShare = (platform: string) => {
    const encoded = encodeURIComponent(url);
    const links: Record<string, string> = {
        twitter: `https://x.com/intent/tweet?url=${encoded}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encoded}`,
    };

    window.open(links[platform], "_blank");
    setShowToast(true);
    playSound("share");

    setTimeout(() => {
        setShowToast(false);
        onClose(); // ✅ auto-close modal after share
    }, 1500);
  };

  const handleClose = () => {
    playSound("modalClose");
    onClose();
  };

  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(timeout)
    }
  }, [showToast])

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="fixed left-1/2 top-1/2 z-50 grid w-[92%] sm:max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-7 shadow-2xl transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out"
        >
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-center text-zinc-900 dark:text-white mb-6">
            Share this Ink ✨
          </DialogTitle>

          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center gap-2 justify-center text-sm font-medium rounded-lg border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </Button>

          <TooltipProvider>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* X */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleSocialShare("twitter")}
                    className="group flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black dark:text-white group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span className="text-[12px] sm:text-sm font-medium text-black dark:text-white tracking-tight">
                      X
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Share on X</TooltipContent>
              </Tooltip>

              {/* LinkedIn */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleSocialShare("linkedin")}
                    className="group flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-[#e8f4f9] dark:bg-zinc-800 hover:bg-[#d0e7f3] dark:hover:bg-[#004471] transition"
                  >
                    <Linkedin className="w-5 h-5 text-[#0077B5] group-hover:scale-110 transition" />
                    <span className="text-[12px] sm:text-sm text-[#0077B5] dark:text-blue-300 font-medium">
                      LinkedIn
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Share on LinkedIn</TooltipContent>
              </Tooltip>

              {/* WhatsApp */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleSocialShare("whatsapp")}
                    className="group flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-green-50 dark:bg-zinc-800 hover:bg-green-100 dark:hover:bg-green-900 transition"
                  >
                    <Send className="w-5 h-5 text-green-600 group-hover:scale-110 transition" />
                    <span className="text-[12px] sm:text-sm text-green-700 dark:text-green-400 font-medium">
                      WhatsApp
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Share on WhatsApp</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </DialogContent>
      </Dialog>

      {/* Single Toast */}
      {showToast && (
        <ToastPortal>
          <div className="fixed bottom-6 right-6 z-[9999] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 animate-fade-in-up">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {toastMessage}
            </span>
          </div>
        </ToastPortal>
      )}
    </>
  )
}
