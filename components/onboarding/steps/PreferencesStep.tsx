"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Heart, BookOpen, PenTool } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { OnboardingData } from "@/hooks/use-onboarding"

interface PreferencesStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
}

const interestCategories = [
  { id: "philosophy", name: "Philosophy", icon: "🧠" },
  { id: "poetry", name: "Poetry", icon: "📝" },
  { id: "creativity", name: "Creativity", icon: "🎨" },
  { id: "healing", name: "Healing", icon: "🌱" },
  { id: "spirituality", name: "Spirituality", icon: "🕯️" },
  { id: "feminism", name: "Feminism", icon: "✊" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "nature", name: "Nature", icon: "🌿" },
  { id: "relationships", name: "Relationships", icon: "💕" },
  { id: "mental-health", name: "Mental Health", icon: "🧘" },
  { id: "social-justice", name: "Social Justice", icon: "⚖️" },
  { id: "personal-growth", name: "Personal Growth", icon: "📈" }
]

const contentTypes = [
  { id: "personal-reflections", name: "Personal Reflections", description: "Share your thoughts and experiences" },
  { id: "poetry", name: "Poetry", description: "Creative writing and verse" },
  { id: "quotes", name: "Quotes", description: "Inspirational and meaningful quotes" },
  { id: "stories", name: "Stories", description: "Narrative and storytelling" },
  { id: "philosophy", name: "Philosophy", description: "Deep thinking and analysis" },
  { id: "advice", name: "Advice", description: "Helpful tips and guidance" }
]

const writingStyles = [
  { id: "personal", name: "Personal", description: "Intimate and authentic" },
  { id: "creative", name: "Creative", description: "Artistic and imaginative" },
  { id: "academic", name: "Academic", description: "Thoughtful and analytical" },
  { id: "conversational", name: "Conversational", description: "Friendly and approachable" }
]

export default function PreferencesStep({ data, onUpdate }: PreferencesStepProps) {
  const [interests, setInterests] = useState<string[]>(data.community?.interests || [])
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([])
  const [writingStyle, setWritingStyle] = useState("personal")
  const isMounted = useRef(true)

  // Update parent data when fields change (without onUpdate dependency)
  useEffect(() => {
    if (isMounted.current) {
      onUpdate({ 
        community: {
          ...data.community,
          interests
        }
      })
    }
  }, [interests]) // Removed onUpdate from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const toggleInterest = (interestId: string) => {
    setInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId)
      } else {
        // Only allow 7 selections maximum
        if (prev.length >= 7) {
          return prev
        }
        return [...prev, interestId]
      }
    })
  }

  const toggleContentType = (typeId: string) => {
    setSelectedContentTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-4 w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center"
        >
          <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          What Interests You?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Help us personalize your experience
        </motion.p>
      </div>

      {/* Interests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Topics of Interest
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select exactly 7 topics that resonate with you
        </p>
        <p className="text-xs text-purple-600 dark:text-purple-400">
          {interests?.length || 0}/7 selected
        </p>
        <div className="flex flex-wrap gap-2">
          {interestCategories.map((interest) => (
            <Badge
              key={interest.id}
              variant={interests?.includes(interest.id) ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                interests?.includes(interest.id)
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
              onClick={() => toggleInterest(interest.id)}
            >
              <span className="mr-1">{interest.icon}</span>
              {interest.name}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Content Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Content You Enjoy
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          What type of content do you like to read and create?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contentTypes.map((type) => (
            <div
              key={type.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedContentTypes.includes(type.id)
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
              }`}
              onClick={() => toggleContentType(type.id)}
            >
              <h4 className="font-medium text-gray-900 dark:text-white">
                {type.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Writing Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Writing Style
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          How would you describe your writing approach?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {writingStyles.map((style) => (
            <div
              key={style.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                writingStyle === style.id
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
              }`}
              onClick={() => setWritingStyle(style.id)}
            >
              <h4 className="font-medium text-gray-900 dark:text-white">
                {style.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {style.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
} 