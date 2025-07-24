"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Palette } from "lucide-react"
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
  coverImage?: string
  coverColor?: string
  inkCount: number
  lastSavedInk?: {
    id: string
    content: string
    author: string
  }
  createdAt: string
  updatedAt: string
}

interface CreateCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateCollection: (collection: Omit<Collection, "id" | "inkCount" | "createdAt" | "updatedAt">) => void
  isMobile?: boolean
}

const colorOptions = [
  "from-purple-400 to-pink-400",
  "from-blue-400 to-cyan-400",
  "from-green-400 to-emerald-400",
  "from-orange-400 to-red-400",
  "from-indigo-400 to-purple-400",
  "from-pink-400 to-rose-400",
  "from-teal-400 to-blue-400",
  "from-yellow-400 to-orange-400",
  "from-violet-400 to-purple-400",
  "from-gray-400 to-gray-600",
]

export default function CreateCollectionModal({
  isOpen,
  onClose,
  onCreateCollection,
  isMobile = false,
}: CreateCollectionModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [nameError, setNameError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleNameChange = (value: string) => {
    setName(value)
    if (value.length > 50) {
      setNameError("Collection name must be 50 characters or less")
    } else if (value.trim().length === 0) {
      setNameError("Collection name is required")
    } else {
      setNameError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setNameError("Collection name is required")
      return
    }

    if (name.length > 50) {
      setNameError("Collection name must be 50 characters or less")
      return
    }

    if (description.length > 200) {
      toast({
        title: "Description too long",
        description: "Description must be 200 characters or less",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onCreateCollection({
        name: name.trim(),
        description: description.trim() || undefined,
        coverColor: selectedColor,
      })

      // Reset form
      setName("")
      setDescription("")
      setSelectedColor(colorOptions[0])
      setNameError("")
    } catch (error) {
      toast({
        title: "Failed to create collection",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setName("")
    setDescription("")
    setSelectedColor(colorOptions[0])
    setNameError("")
    onClose()
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center pb-2">
        <h2 className="text-lg font-semibold text-foreground">Create New Collection</h2>
        <p className="text-sm text-muted-foreground mt-1">Organize your saved inks</p>
      </div>

      {/* Preview */}
      <div className="flex justify-center">
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedColor} flex items-center justify-center shadow-lg`}
          >
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-xs text-white font-medium">0</span>
          </motion.div>
        </div>
      </div>

      {/* Collection Name */}
      <div className="space-y-2">
        <Label htmlFor="collection-name" className="text-sm font-medium">
          Collection Name *
        </Label>
        <Input
          id="collection-name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g., Daily Inspiration, Poetry Collection"
          className={nameError ? "border-red-500 focus:border-red-500" : ""}
          maxLength={60}
        />
        <div className="flex justify-between items-center">
          {nameError && <span className="text-xs text-red-500">{nameError}</span>}
          <span className="text-xs text-muted-foreground ml-auto">{name.length}/50</span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="collection-description" className="text-sm font-medium">
          Description (Optional)
        </Label>
        <Textarea
          id="collection-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What kind of inks will you save here?"
          className="resize-none h-20"
          maxLength={220}
        />
        <span className="text-xs text-muted-foreground">{description.length}/200</span>
      </div>

      {/* Color Picker */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Cover Color
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} border-2 transition-all ${
                selectedColor === color ? "border-purple-500 scale-110" : "border-transparent hover:scale-105"
              }`}
              aria-label={`Select color option ${index + 1}`}
            >
              {selectedColor === color && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-md flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          className="flex-1 bg-transparent"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={!name.trim() || !!nameError || isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </div>
          ) : (
            "Create Collection"
          )}
        </Button>
      </div>
    </form>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="max-h-[90vh]">
          <SheetHeader className="sr-only">
            <SheetTitle>Create New Collection</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
