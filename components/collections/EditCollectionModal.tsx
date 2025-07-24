"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Palette, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Collection {
  id: string
  name: string
  description?: string
  coverColor?: string
  inkCount: number
  createdAt: string
  updatedAt: string
}

interface EditCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  collection: Collection
  onUpdateCollection: (updates: {
    name: string
    description?: string
    coverColor?: string
  }) => void
  isMobile?: boolean
}

const coverColors = [
  "from-purple-400 to-pink-400",
  "from-blue-400 to-cyan-400",
  "from-green-400 to-emerald-400",
  "from-orange-400 to-red-400",
  "from-yellow-400 to-orange-400",
  "from-indigo-400 to-purple-400",
  "from-pink-400 to-rose-400",
  "from-teal-400 to-blue-400",
  "from-gray-400 to-gray-600",
  "from-amber-400 to-orange-400",
]

export default function EditCollectionModal({
  isOpen,
  onClose,
  collection,
  onUpdateCollection,
  isMobile = false,
}: EditCollectionModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [nameError, setNameError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Initialize form with collection data
  useEffect(() => {
    if (collection) {
      setName(collection.name)
      setDescription(collection.description || "")
      setSelectedColor(collection.coverColor || coverColors[0])
    }
  }, [collection])

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Collection name is required")
      return false
    }
    if (value.length > 50) {
      setNameError("Collection name must be 50 characters or less")
      return false
    }
    setNameError("")
    return true
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (nameError) {
      validateName(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateName(name)) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      onUpdateCollection({
        name: name.trim(),
        description: description.trim() || undefined,
        coverColor: selectedColor,
      })

      toast({
        title: "Collection updated",
        description: `"${name}" has been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Failed to update collection",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center pb-2">
        <h2 className="text-lg font-semibold text-foreground">Edit Collection</h2>
        <p className="text-sm text-muted-foreground mt-1">Update your collection details</p>
      </div>

      {/* Collection Name */}
      <div className="space-y-2">
        <Label htmlFor="edit-collection-name" className="text-sm font-medium">
          Collection Name *
        </Label>
        <Input
          id="edit-collection-name"
          type="text"
          placeholder="e.g., Daily Inspiration, Poetry, Quotes..."
          value={name}
          onChange={handleNameChange}
          onBlur={() => validateName(name)}
          className={nameError ? "border-red-500 focus:border-red-500" : ""}
          maxLength={50}
          autoFocus={!isMobile}
        />
        {nameError && <p className="text-sm text-red-500">{nameError}</p>}
        <p className="text-xs text-muted-foreground">{name.length}/50 characters</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="edit-collection-description" className="text-sm font-medium">
          Description (Optional)
        </Label>
        <Textarea
          id="edit-collection-description"
          placeholder="What kind of inks will you save here?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none"
          rows={3}
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">{description.length}/200 characters</p>
      </div>

      {/* Cover Color */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Cover Color
        </Label>
        <div className="grid grid-cols-5 gap-3">
          {coverColors.map((color, index) => (
            <motion.button
              key={color}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} border-2 transition-all ${
                selectedColor === color
                  ? "border-foreground shadow-lg"
                  : "border-transparent hover:border-muted-foreground"
              }`}
              onClick={() => setSelectedColor(color)}
              aria-label={`Color option ${index + 1}`}
            >
              {selectedColor === color && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-md flex items-center justify-center"
                >
                  <BookOpen className="w-5 h-5 text-white drop-shadow-sm" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Preview</Label>
        <div className="p-3 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedColor} flex items-center justify-center`}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{name || "Collection Name"}</h3>
              {description && <p className="text-sm text-muted-foreground truncate">{description}</p>}
              <p className="text-xs text-muted-foreground">{collection.inkCount} inks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-transparent"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={!name.trim() || !!nameError || isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </div>
          ) : (
            "Update Collection"
          )}
        </Button>
      </div>
    </form>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="max-h-[90vh]">
          <SheetHeader className="sr-only">
            <SheetTitle>Edit Collection</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
