"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { getInkById } from "@/lib/api" // Your API client method

export default function InkPreviewModal({
  inkId,
  onClose,
}: {
  inkId: string
  onClose: () => void
}) {
  const [ink, setInk] = useState<any>(null)

  useEffect(() => {
    const fetchInk = async () => {
      const res = await getInkById(inkId)
      setInk(res)
    }
    fetchInk()
  }, [inkId])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Share this Ink</h2>
        {ink ? (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="border p-3 rounded-lg bg-white">{ink.content}</div>
            <div className="text-xs text-gray-500">
              — {ink.author || "Anonymous"}
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
