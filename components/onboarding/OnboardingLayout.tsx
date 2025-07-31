  "use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OnboardingStep } from "@/hooks/use-onboarding"
import OnboardingProgress from "./OnboardingProgress"

interface OnboardingLayoutProps {
  children: React.ReactNode
  steps: OnboardingStep[]
  currentStep: number
  onNext?: () => void
  onPrev?: () => void
  onSkip?: () => void
  onComplete?: () => void
  isLoading?: boolean
  canProceed?: boolean
  isLastStep?: boolean
  showProgress?: boolean
  showNavigation?: boolean
  error?: string | null
  retryCount?: number
  onRetry?: () => void
  onClearError?: () => void
}

export default function OnboardingLayout({
  children,
  steps,
  currentStep,
  onNext,
  onPrev,
  onSkip,
  onComplete,
  isLoading = false,
  canProceed = true,
  isLastStep = false,
  showProgress = true,
  showNavigation = true,
  error = null,
  retryCount = 0,
  onRetry,
  onClearError
}: OnboardingLayoutProps) {
  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-950 dark:via-background dark:to-purple-950">
      {/* Progress Bar */}
      {showProgress && (
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 pt-5">
          <OnboardingProgress 
            steps={steps} 
            currentStep={currentStep}
            showStepTitles={false}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Content Container */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Content */}
            <div className="p-8">
              {children}
              
              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-400 text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                        {error}
                      </p>
                      {retryCount > 0 && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Retry attempt {retryCount}/3
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      {onRetry && retryCount < 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onRetry}
                          className="text-xs border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          Retry
                        </Button>
                      )}
                      {onClearError && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onClearError}
                          className="text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          Dismiss
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation */}
            {showNavigation && (
              <div className="px-8 pb-8">
                <div className="flex items-center justify-between">
                  {/* Back Button */}
                  <Button
                    variant="outline"
                    onClick={onPrev}
                    disabled={currentStep === 0 || isLoading}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  {/* Center Actions */}
                  <div className="flex items-center gap-3">
                    {/* Skip Button (if not last step and not required) */}
                    {!isLastStep && !currentStepData.isRequired && onSkip && (
                      <Button
                        variant="ghost"
                        onClick={onSkip}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        Skip
                      </Button>
                    )}

                    {/* Next/Complete Button */}
                    <Button
                      onClick={isLastStep ? onComplete : onNext}
                      disabled={!canProceed || isLoading}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {isLastStep ? "Completing..." : "Loading..."}
                        </>
                      ) : isLastStep ? (
                        <>
                          <Check className="w-4 h-4" />
                          Complete Setup
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Step Info */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentStepData.isRequired ? "Required" : "Optional"} • Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 