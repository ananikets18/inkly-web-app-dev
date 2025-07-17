"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, Clock, Eye, Globe, Lock, UserCheck, Zap } from "lucide-react"

interface ReadyToInkModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  inkData: {
    content: string
    tags: string[]
    mood?: string
    type?: string
    visibility: string
  }
  xpPreview: number
  isSubmitting?: boolean
}

const VISIBILITY_CONFIG = {
  public: {
    icon: <Globe className="w-4 h-4" />,
    label: "Public",
    description: "Anyone can see this ink",
  },
  followers: {
    icon: <UserCheck className="w-4 h-4" />,
    label: "Followers",
    description: "Only your followers can see this ink",
  },
  private: {
    icon: <Lock className="w-4 h-4" />,
    label: "Private",
    description: "Only you can see this ink",
  },
}

export default function ReadyToInkModal({
  open,
  onClose,
  onConfirm,
  inkData,
  xpPreview,
  isSubmitting = false,
}: ReadyToInkModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleConfirm = async () => {
    setIsAnimating(true)
    await onConfirm()
    setIsAnimating(false)
  }

  const visibilityConfig =
    VISIBILITY_CONFIG[inkData.visibility as keyof typeof VISIBILITY_CONFIG] || VISIBILITY_CONFIG.public

  const estimatedReadTime = Math.max(1, Math.ceil(inkData.content.split(" ").length / 200))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Ready to Ink?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Card */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                  You
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Your Name</p>
                <p className="text-sm text-gray-500">@username</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-900 leading-relaxed">
                {inkData.content.length > 200 ? `${inkData.content.substring(0, 200)}...` : inkData.content}
              </p>

              {/* Tags and Metadata */}
              <div className="flex flex-wrap gap-2">
                {inkData.type && (
                  <Badge variant="secondary" className="capitalize">
                    {inkData.type}
                  </Badge>
                )}
                {inkData.mood && (
                  <Badge variant="outline" className="capitalize">
                    {inkData.mood}
                  </Badge>
                )}
                {inkData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Publishing Details */}
          <div className="space-y-3">
            <h4 className="font-medium">Publishing Details</h4>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                {visibilityConfig.icon}
                <div>
                  <p className="font-medium">{visibilityConfig.label}</p>
                  <p className="text-gray-500 text-xs">{visibilityConfig.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium">{estimatedReadTime} min read</p>
                  <p className="text-gray-500 text-xs">Estimated reading time</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* XP Preview */}
          <motion.div
            className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">You'll earn</p>
                  <p className="text-sm text-gray-600">Experience points for this ink</p>
                </div>
              </div>
              <Badge className="bg-purple-600 text-white text-lg px-3 py-1">+{xpPreview} XP</Badge>
            </div>
          </motion.div>

          {/* Engagement Prediction */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Engagement Prediction
            </h5>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-semibold text-blue-600">12-18</p>
                <p className="text-gray-600">Expected views</p>
              </div>
              <div>
                <p className="font-semibold text-blue-600">2-5</p>
                <p className="text-gray-600">Potential likes</p>
              </div>
              <div>
                <p className="font-semibold text-blue-600">1-2</p>
                <p className="text-gray-600">Possible reposts</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Review Again
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
            {isSubmitting ? (
              <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                Publishing...
              </motion.div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Publish Ink
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
