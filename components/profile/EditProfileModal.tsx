"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Save, X, Palette } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
  userData: {
    name: string
    username: string
    bio: string
    location: string
    avatar: string
    coverGradient?: string
    pronouns?: string
  }
  onSave: (updatedData: any) => void
}

const gradientPresets = [
  { name: "Purple Dreams", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Sunset Glow", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Ocean Breeze", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Forest Path", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Golden Hour", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Cosmic Flow", value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
]

export default function EditProfileModal({ open, onClose, userData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: userData.name,
    username: userData.username,
    bio: userData.bio,
    location: userData.location,
    pronouns: userData.pronouns || "",
    coverGradient: userData.coverGradient || gradientPresets[0].value,
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-500" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cover Preview */}
          <div className="relative">
            <div
              className="h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700"
              style={{ background: formData.coverGradient }}
            />
            <div className="absolute -bottom-8 left-6">
              <div className="relative">
                <Avatar className="w-16 h-16 ring-4 ring-white dark:ring-gray-900 shadow-lg">
                  <AvatarFallback className={`bg-gradient-to-br ${userData.avatar} text-white text-lg font-bold`}>
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute -bottom-1 -right-1 rounded-full w-8 h-8">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Cover Gradient Selector */}
          <div className="pt-4">
            <Label className="text-sm font-medium mb-3 block">Cover Gradient</Label>
            <div className="grid grid-cols-3 gap-3">
              {gradientPresets.map((preset) => (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInputChange("coverGradient", preset.value)}
                  className={`h-16 rounded-lg border-2 transition-all ${
                    formData.coverGradient === preset.value
                      ? "border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                  style={{ background: preset.value }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Display Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your display name"
                maxLength={50}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-sm font-medium mb-2 block">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="@username"
                maxLength={30}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm font-medium mb-2 block">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={200}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.bio.length}/200 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country"
                maxLength={50}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="pronouns" className="text-sm font-medium mb-2 block">
                Pronouns (Optional)
              </Label>
              <Select
                value={formData.pronouns || 'none'}
                onValueChange={(value) => handleInputChange("pronouns", value === 'none' ? '' : value)}
              >
                <SelectTrigger id="pronouns" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Select pronouns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="they/them">they/them</SelectItem>
                  <SelectItem value="she/her">she/her</SelectItem>
                  <SelectItem value="he/him">he/him</SelectItem>
                  <SelectItem value="she/they">she/they</SelectItem>
                  <SelectItem value="he/they">he/they</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="text-purple-500 bg-purple-600 hover:bg-purple-700 dark:bg-purple-800 dark:text-white dark:border-purple-500 text-white "
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
