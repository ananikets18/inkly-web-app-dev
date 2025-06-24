"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

type Author = { initials: string; color: string }

interface NewInksToastProps {
  visible: boolean
  authors: Author[]
  onClick: () => void
  onHover: () => void
}

export default function NewInksToast({ visible, authors, onClick, onHover }: NewInksToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-[90px] left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            onMouseEnter={onHover}
            className="bg-white border border-gray-300 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-purple-50 transition-all hover:shadow-xl"
          >
            <div className="flex -space-x-2">
              {authors.map((author, idx) => (
                <motion.div
                  key={author.initials}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className={`w-6 h-6 rounded-full text-white text-xs font-semibold flex items-center justify-center ring-2 ring-white ${author.color}`}
                >
                  {author.initials}
                </motion.div>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {authors.length} New Ink{authors.length > 1 ? "s" : ""}
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 bg-purple-600 rounded-full"
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
