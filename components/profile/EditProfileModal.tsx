"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Save, X, Palette, Plus, Trash2, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
  userData: {
    name: string
    username: string
    bio: string
    location: string
    avatar: string
    avatarColor?: string
    pronouns?: string
    externalLinks?: Array<{
      url: string
      label: string
    }>
  }
  onSave: (updatedData: any) => void
}

// Avatar color palette
const avatarColors = [
  "#FF6B6B", // Red
  "#FFD93D", // Yellow
  "#6BCB77", // Green
  "#4D96FF", // Blue
  "#FF9F1C", // Orange
  "#9333ea", // Purple (default)
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#8B5CF6", // Violet
  "#F59E0B", // Amber
]

// Helper function to get text color based on background
const getTextColor = (backgroundColor: string): string => {
  const hex = backgroundColor.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

// URL validation function
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export default function EditProfileModal({ open, onClose, userData, onSave }: EditProfileModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: userData.name,
    username: userData.username,
    bio: userData.bio,
    location: userData.location,
    pronouns: userData.pronouns || "",
    avatarColor: userData.avatarColor || "#9333ea",
    externalLinks: userData.externalLinks || [],
  })
  const [loading, setLoading] = useState(false)
  const [linkErrors, setLinkErrors] = useState<string[]>([])

  const handleSave = async () => {
    // Validate external links
    const errors: string[] = []
    formData.externalLinks.forEach((link, index) => {
      if (link.url && !isValidUrl(link.url)) {
        errors[index] = "Please enter a valid URL"
      }
    })

    if (errors.some((error) => error)) {
      setLinkErrors(errors)
      toast({
        title: "Invalid URLs",
        description: "Please fix the invalid URLs before saving.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Filter out empty links
      const validLinks = formData.externalLinks.filter((link) => link.url.trim() !== "")
      await onSave({
        ...formData,
        externalLinks: validLinks,
      })
      onClose()
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLinkChange = (index: number, field: "url" | "label", value: string) => {
    const newLinks = [...formData.externalLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setFormData((prev) => ({ ...prev, externalLinks: newLinks }))

    // Clear error for this field if it becomes valid
    if (field === "url" && value && isValidUrl(value)) {
      const newErrors = [...linkErrors]
      newErrors[index] = ""
      setLinkErrors(newErrors)
    }
  }

  const addLink = () => {
    if (formData.externalLinks.length < 2) {
      setFormData((prev) => ({
        ...prev,
        externalLinks: [...prev.externalLinks, { url: "", label: "" }],
      }))
    }
  }

  const removeLink = (index: number) => {
    const newLinks = formData.externalLinks.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, externalLinks: newLinks }))

    // Remove corresponding error
    const newErrors = linkErrors.filter((_, i) => i !== index)
    setLinkErrors(newErrors)
  }

  const textColor = getTextColor(formData.avatarColor)

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
          {/* Avatar Preview */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 shadow-lg">
              <AvatarFallback
                className="text-2xl font-bold"
                style={{
                  backgroundColor: formData.avatarColor,
                  color: textColor,
                }}
              >
                {formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label className="text-sm font-medium mb-2 block">Avatar Background Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {avatarColors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleInputChange("avatarColor", color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.avatarColor === color
                        ? "border-gray-900 dark:border-white ring-2 ring-purple-500"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
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
                value={formData.pronouns || "none"}
                onValueChange={(value) => handleInputChange("pronouns", value === "none" ? "" : value)}
              >
                <SelectTrigger
                  id="pronouns"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                >
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

          {/* External Links Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">External Links (Max 2)</Label>
              {formData.externalLinks.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLink}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {formData.externalLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="https://example.com"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                      className={`bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 ${
                        linkErrors[index] ? "border-red-500" : ""
                      }`}
                    />
                    {linkErrors[index] && <p className="text-xs text-red-500 mt-1">{linkErrors[index]}</p>}
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Label (optional)"
                      value={link.label}
                      onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      maxLength={20}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {formData.externalLinks.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                <ExternalLink className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No external links added yet
              </div>
            )}
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
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-800 dark:text-white text-white"
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
