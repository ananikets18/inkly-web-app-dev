"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useOnboarding } from "@/hooks/use-onboarding"
import { validateUsername, validateFullName, validateOnboardingData } from "@/utils/authValidation"
import { useSession } from "next-auth/react"
import { useAuth } from "@/context/AuthContext"
import OnboardingLayout from "@/components/onboarding/OnboardingLayout"
import UsernameStep from "@/components/onboarding/steps/UsernameStep"
import ProfileStep from "@/components/onboarding/steps/ProfileStep"
import PreferencesStep from "@/components/onboarding/steps/PreferencesStep"
import PrivacyStep from "@/components/onboarding/steps/PrivacyStep"
import TutorialStep from "@/components/onboarding/steps/TutorialStep"
import CommunityStep from "@/components/onboarding/steps/CommunityStep"
import AuthGuard from "@/components/AuthGuard"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const { refreshUserData } = useAuth()
  const {
    currentStep,
    onboardingData,
    steps,
    isLoading,
    error,
    retryCount,
    saveOnboardingData,
    completeStep,
    nextStep,
    prevStep,
    goToStep,
    isOnboardingComplete,
    getCurrentStep,
    getProgressPercentage,
    completeOnboarding,
    resetOnboarding,
    clearError
  } = useOnboarding()

  // Redirect to home if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (session?.user) {
        await refreshUserData()
        
        // Check both localStorage and database status
        const onboardingComplete = localStorage.getItem('inkly-onboarding-complete')
        const userData = await fetch('/api/user/onboarding-status').then(res => res.ok ? res.json() : null)
        
        if (onboardingComplete === 'true' || userData?.user?.onboardingCompleted) {
          console.log('✅ Onboarding already completed, redirecting to home')
          router.push('/')
          return
        }
      }
    }
    
    checkOnboardingStatus()
  }, [session, router, refreshUserData])

  // Show welcome toast for new users
  useEffect(() => {
    if (session?.user && currentStep === 0) {
      toast({
        title: `Welcome to Inkly, ${session.user.name || 'there'}! 👋`,
        description: "Let's get you set up in just a few steps.",
        duration: 4000,
      })
    }
  }, [session, currentStep, toast])

  const handleNext = async () => {
    const currentStepData = getCurrentStep()
    
    let isValid = true
    let errorMessage = ""

    switch (currentStepData?.id) {
      case 'username':
        const usernameValidation = validateUsername(onboardingData.username)
        if (!usernameValidation.isValid) {
          isValid = false
          errorMessage = usernameValidation.errors[0] || "Invalid username"
        }
        break
      case 'profile':
        const nameValidation = validateFullName(onboardingData.name)
        if (!nameValidation.isValid) {
          isValid = false
          errorMessage = nameValidation.errors[0] || "Invalid name"
        }
        break
      default:
        break
    }

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }

    try {
      const currentStepData = getCurrentStep()
      if (currentStepData) {
        // Add a small delay to ensure state updates are processed
        await new Promise(resolve => setTimeout(resolve, 100))
        await completeStep(currentStepData.id)
      }
      nextStep()
    } catch (error) {
      console.error('Error completing step:', error)
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePrev = () => {
    prevStep()
  }

  const handleSkip = () => {
    nextStep()
  }

  const handleComplete = async () => {
    try {
      const success = await completeOnboarding()
      
      if (success) {
        // Refresh user data to update onboarding status
        await refreshUserData()
        
        toast({
          title: "Welcome to Inkly! 🎉",
          description: "Your profile is ready. Start creating amazing content!",
          duration: 5000,
        })
        
        // Redirect to home page
        router.push('/')
      } else {
        toast({
          title: "Error",
          description: "Failed to complete onboarding. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      })
    }
  }

  const canProceed = (): boolean => {
    const currentStepData = getCurrentStep()
    
    switch (currentStepData?.id) {
      case 'username':
        return validateUsername(onboardingData.username).isValid
      case 'profile':
        return validateFullName(onboardingData.name).isValid
      default:
        return true
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <UsernameStep
            data={onboardingData}
            onUpdate={(data) => saveOnboardingData(data)}
          />
        )
      case 1:
        return (
          <ProfileStep
            data={onboardingData}
            onUpdate={(data) => saveOnboardingData(data)}
          />
        )
      case 2:
        return (
          <PreferencesStep
            data={onboardingData}
            onUpdate={(data) => saveOnboardingData(data)}
          />
        )
      case 3:
        return (
          <PrivacyStep
            data={onboardingData}
            onUpdate={(data) => saveOnboardingData(data)}
          />
        )
      case 4:
        return (
          <CommunityStep
            data={onboardingData}
            onUpdate={(data) => saveOnboardingData(data)}
          />
        )
      case 5:
        return (
          <TutorialStep
            data={onboardingData}
            onUpdate={(data) => saveOnboardingData(data)}
          />
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950 dark:via-background dark:to-orange-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Setting up your profile...
          </h2>
        </div>
      </div>
    )
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      onNext={handleNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
      onComplete={handleComplete}
      canProceed={canProceed()}
      isLastStep={currentStep === steps.length - 1}
      error={error}
      retryCount={retryCount}
      onRetry={() => {
        // Retry the current step
        const currentStepData = getCurrentStep()
        if (currentStepData) {
          completeStep(currentStepData.id)
        }
      }}
      onClearError={clearError}
    >
      <AnimatePresence mode="wait">
        {renderCurrentStep()}
      </AnimatePresence>
    </OnboardingLayout>
  )
} 