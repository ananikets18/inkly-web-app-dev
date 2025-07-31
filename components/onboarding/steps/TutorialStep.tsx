"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { PenTool, Sparkles, Heart, Share2, BookOpen, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OnboardingData } from "@/hooks/use-onboarding"

interface TutorialStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
}

const tutorialSteps = [
  {
    id: 1,
    title: "Write Your First Ink",
    description: "Share your thoughts, poetry, or ideas with the community",
    icon: PenTool,
    content: "Click the 'Create' button to start writing. You can format your text, add hashtags, and choose your mood before publishing.",
    tips: ["Be authentic", "Use relevant hashtags", "Choose the right mood"]
  },
  {
    id: 2,
    title: "Engage with Others",
    description: "React, share, and connect with fellow creators",
    icon: Heart,
    content: "Show appreciation for content you love by echoing (liking) it. You can also share inks that resonate with you.",
    tips: ["Echo content you love", "Leave thoughtful comments", "Share meaningful content"]
  },
  {
    id: 3,
    title: "Build Collections",
    description: "Organize and curate your favorite content",
    icon: BookOpen,
    content: "Create collections to organize inks by themes, moods, or topics. Share your collections with others.",
    tips: ["Group by themes", "Add descriptions", "Share collections"]
  },
  {
    id: 4,
    title: "Earn XP & Badges",
    description: "Grow your influence and unlock achievements",
    icon: Sparkles,
    content: "Earn experience points by creating quality content, engaging with others, and maintaining streaks.",
    tips: ["Post regularly", "Engage daily", "Maintain streaks"]
  }
]

export default function TutorialStep({ data, onUpdate }: TutorialStepProps) {
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)
  const [tutorialCompleted, setTutorialCompleted] = useState(false)
  const isMounted = useRef(true)

  // Update parent data when tutorial is completed (without onUpdate dependency)
  useEffect(() => {
    if (isMounted.current && tutorialCompleted) {
      // Mark tutorial as completed in localStorage
      localStorage.setItem('inkly-tutorial-completed', 'true')
    }
  }, [tutorialCompleted]) // Removed onUpdate from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const nextTutorialStep = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(prev => prev + 1)
    } else {
      setTutorialCompleted(true)
    }
  }

  const prevTutorialStep = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(prev => prev - 1)
    }
  }

  const currentStep = tutorialSteps[currentTutorialStep]

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
          <PenTool className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Create Your First Ink
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Learn the basics of creating and sharing content
        </motion.p>
      </div>

      {/* Tutorial Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <div className="flex gap-2">
          {tutorialSteps.map((step, index) => (
            <div
              key={step.id}
              className={`w-3 h-3 rounded-full transition-all ${
                index <= currentTutorialStep
                  ? "bg-purple-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Current Tutorial Step */}
      <motion.div
        key={currentTutorialStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <currentStep.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {currentStep.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {currentStep.description}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {currentStep.content}
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Pro Tips:
            </h4>
            <ul className="space-y-1">
              {currentStep.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between items-center"
      >
        <Button
          variant="outline"
          onClick={prevTutorialStep}
          disabled={currentTutorialStep === 0}
        >
          Previous
        </Button>
        
        <Button
          onClick={nextTutorialStep}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {currentTutorialStep === tutorialSteps.length - 1 ? "Complete" : "Next"}
        </Button>
      </motion.div>

      {/* Completion Message */}
      {tutorialCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Tutorial Complete!
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You're ready to start creating amazing content on Inkly
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 