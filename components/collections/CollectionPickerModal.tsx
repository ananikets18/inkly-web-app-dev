"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { BookOpen, Plus, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import CreateCollectionModal from "./CreateCollectionModal"

interface Collection {
  id: string
  name: string
  description?: string
  inkCount: number
  coverColor: string
  createdAt: string
}

interface CollectionPickerModalProps {
  isOpen: boolean
  onClose: () => void
  inkId: number
  inkTitle: string
  isMobile?: boolean
}

// Mock collections data
const mockCollections: Collection[] = [
  {
    id: "saved-inks",
    name: "Saved Inks",
    description: "Your default collection",
    inkCount: 42,
    coverColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    createdAt: "2024-01-01",
  },
  {
    id: "inspiration",
    name: "Daily Inspiration",
    description: "Quotes and thoughts that motivate me",
    inkCount: 18,
    coverColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    createdAt: "2024-01-15",
  },
  {
    id: "philosophy",
    name: "Philosophy & Wisdom",
    description: "Deep thoughts and philosophical insights",
    inkCount: 25,
    coverColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    createdAt: "2024-01-20",
  },
]

export default function CollectionPickerModal({
  isOpen,
  onClose,
  inkId,
  inkTitle,
  isMobile = false,
}: CollectionPickerModalProps) {
  const { toast } = useToast()
  const [collections] = useState<Collection[]>(mockCollections)
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set())
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleCollectionToggle = (collectionId: string) => {
    const newSelected = new Set(selectedCollections)
    if (newSelected.has(collectionId)) {
      newSelected.delete(collectionId)
    } else {
      newSelected.add(collectionId)
    }
    setSelectedCollections(newSelected)
  }

  const handleSave = async () => {
    if (selectedCollections.size === 0) {
      toast({
        title: "No collections selected",
        description: "Please select at least one collection to save to.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const collectionNames = Array.from(selectedCollections)
      .map((id) => collections.find((c) => c.id === id)?.name)
      .filter(Boolean)

    toast({
      title: "Saved to collections! 🎉",
      description: `Added to ${collectionNames.join(", ")}`,
    })

    setSaving(false)
    onClose()
  }

  const handleCreateCollection = (newCollection: Omit<Collection, "id" | "inkCount" | "createdAt">) => {
    // In real app, this would make an API call
    console.log("Creating collection:", newCollection)
    setCreateModalOpen(false)

    toast({
      title: "Collection created! ✨",
      description: `"${newCollection.name}" has been created successfully.`,
    })
  }

  const content = (
    <div className="space-y-4">
      {/* Create New Collection Button */}
      <Button onClick={() => setCreateModalOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        <Plus className="w-4 h-4 mr-2" />
        Create New Collection
      </Button>

      {/* Collections List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {collections.map((collection) => {
            const isSelected = selectedCollections.has(collection.id)

            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCollectionToggle(collection.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {/* Collection Cover */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ background: collection.coverColor }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>

                {/* Collection Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{collection.name}</h3>
                    {collection.id === "saved-inks" && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{collection.inkCount} inks</p>
                  {collection.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate mt-1">{collection.description}</p>
                  )}
                </div>

                {/* Selection Indicator */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? "border-purple-500 bg-purple-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={saving}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || selectedCollections.size === 0}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          {saving
            ? "Saving..."
            : `Save to ${selectedCollections.size} collection${selectedCollections.size !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side="bottom" className="h-[80vh] bg-white dark:bg-gray-900">
            <SheetHeader>
              <SheetTitle className="text-left">Save to Collection</SheetTitle>
            </SheetHeader>
            <div className="mt-6">{content}</div>
          </SheetContent>
        </Sheet>

        <CreateCollectionModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreateCollection}
        />
      </>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Save to Collection</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>

      <CreateCollectionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateCollection}
      />
    </>
  )
}
