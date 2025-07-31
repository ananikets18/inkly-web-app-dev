"use client"

import { motion } from "framer-motion"
import { Check, ChevronRight } from "lucide-react"
import { OnboardingStep } from "@/hooks/use-onboarding"

interface OnboardingProgressProps {
  steps: OnboardingStep[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  showStepTitles?: boolean
}

export default function OnboardingProgress({ 
  steps, 
  currentStep, 
  onStepClick,
  showStepTitles = true 
}: OnboardingProgressProps) {
  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100)

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {progressPercentage}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isCompleted = step.isCompleted
          const isCurrent = index === currentStep
          const isPast = index < currentStep
          const isClickable = onStepClick && (isCompleted || isPast)

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                  ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  ${isCompleted 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : isCurrent 
                    ? 'bg-purple-500 text-white shadow-lg ring-4 ring-purple-200 dark:ring-purple-800' 
                    : isPast 
                    ? 'bg-purple-300 dark:bg-purple-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>

              {/* Step Title (Desktop) */}
              {showStepTitles && (
                <div className="hidden md:block ml-3">
                  <h3 className={`text-sm font-medium ${
                    isCurrent 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : isCompleted || isPast
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs ${
                    isCurrent 
                      ? 'text-purple-500 dark:text-purple-300' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
              )}

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 h-0.5 bg-gray-200 dark:bg-gray-700 relative">
                  {isPast && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="absolute inset-0 bg-purple-300 dark:bg-purple-600"
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Step Title */}
      {showStepTitles && (
        <div className="md:hidden text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {steps[currentStep].title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {steps[currentStep].description}
          </p>
        </div>
      )}
    </div>
  )
} 