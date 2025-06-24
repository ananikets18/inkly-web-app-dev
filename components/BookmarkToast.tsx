"use client"

import ToastPortal from "./ToastPortal"
import { useEffect, useState } from "react"

export default function BookmarkToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 1800)
    return () => clearTimeout(timeout)
  }, [])

  if (!visible) return null

  return (
    <ToastPortal>
      <div
        role="status"
        aria-live="polite" 
        className="fixed top-16 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-purple-600 text-white px-4 py-2 text-xs font-medium shadow-lg animate-fade-in-out">
        {message}
      </div>
    </ToastPortal>
  )
}
