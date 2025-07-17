"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, Share2, Twitter, Facebook, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ShareProfileModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}

export default function ShareProfileModal({ isOpen, onClose, url, title }: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, "_blank")
  }

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, "_blank")
  }

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 dark:border-gray-800 shadow-2xl"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl shadow-lg mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Share Profile</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Share this profile with others</p>
            </div>

            {/* Copy Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Link</label>
              <div className="flex gap-2">
                <Input value={url} readOnly className="flex-1 bg-white/50 dark:bg-gray-800/60 border-white/30 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100" />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="icon"
                  className="bg-white/50 dark:bg-gray-800/60 border-white/30 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-700 flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 dark:text-green-400 text-sm mt-2"
                >
                  Link copied to clipboard!
                </motion.p>
              )}
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Share on social media</label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={shareToTwitter}
                  variant="outline"
                  className="bg-white/50 dark:bg-gray-800/60 border-white/30 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-200 dark:hover:border-blue-700 flex flex-col gap-2 h-auto py-4"
                >
                  <Twitter className="w-5 h-5 text-blue-500" />
                  <span className="text-xs">Twitter</span>
                </Button>
                <Button
                  onClick={shareToFacebook}
                  variant="outline"
                  className="bg-white/50 dark:bg-gray-800/60 border-white/30 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-200 dark:hover:border-blue-700 flex flex-col gap-2 h-auto py-4"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className="text-xs">Facebook</span>
                </Button>
                <Button
                  onClick={shareToWhatsApp}
                  variant="outline"
                  className="bg-white/50 dark:bg-gray-800/60 border-white/30 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900 hover:border-green-200 dark:hover:border-green-700 flex flex-col gap-2 h-auto py-4"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
