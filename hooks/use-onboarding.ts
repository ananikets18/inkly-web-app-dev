import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface OnboardingData {
  username: string
  name: string // Changed from fullName
  bio: string
  location: string
  avatar: string // Changed from avatarUrl
  preferences: {
    theme: string
    language: string
    timezone: string
  }
  notifications: {
    pushEnabled: boolean
    newFollower: boolean
    newReaction: boolean
    trendingInks: boolean
    followedUserInks: boolean
    permissionStatus: 'default' | 'granted' | 'denied'
  }
  privacy: {
    profileVisibility: string
    contentVisibility: string
    allowMessages: boolean
  }
  community: {
    interests: string[]
    followingSuggestions: string[]
  }
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  isRequired: boolean
  isCompleted?: boolean
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'username',
    title: 'Choose Your Username',
    description: 'Pick a unique username for your profile',
    isRequired: true,
    isCompleted: false
  },
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Add your bio and location',
    isRequired: false,
    isCompleted: false
  },
  {
    id: 'preferences',
    title: 'Set Your Preferences',
    description: 'Choose your theme and language',
    isRequired: false,
    isCompleted: false
  },
  {
    id: 'privacy',
    title: 'Privacy & Notifications',
    description: 'Configure your privacy settings and notifications',
    isRequired: false,
    isCompleted: false
  },
  {
    id: 'community',
    title: 'Join the Community',
    description: 'Discover and follow other creators',
    isRequired: false,
    isCompleted: false
  },
  {
    id: 'tutorial',
    title: 'Quick Tutorial',
    description: 'Learn how to use Inkly',
    isRequired: false,
    isCompleted: false
  }
]

const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  username: '',
  name: '', // Changed from fullName
  bio: '',
  location: '',
  avatar: '', // Changed from avatarUrl
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'UTC'
  },
  notifications: {
    pushEnabled: false,
    newFollower: true,
    newReaction: true,
    trendingInks: true,
    followedUserInks: true,
    permissionStatus: 'default'
  },
  privacy: {
    profileVisibility: 'public',
    contentVisibility: 'public',
    allowMessages: true
  },
  community: {
    interests: [],
    followingSuggestions: ["inkly_official", "aniket_founder"] // Pre-select official accounts
  }
}

export const useOnboarding = () => {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(DEFAULT_ONBOARDING_DATA)
  const [steps, setSteps] = useState<OnboardingStep[]>(ONBOARDING_STEPS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('inkly-onboarding-data')
    let initialData = DEFAULT_ONBOARDING_DATA

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        initialData = { ...initialData, ...parsed }
        console.log('📦 Loaded saved onboarding data:', parsed)
      } catch (error) {
        console.error('❌ Failed to parse onboarding data:', error)
        // Clear corrupted data
        localStorage.removeItem('inkly-onboarding-data')
      }
    }

    if (session?.user) {
      const user = session.user
      initialData = {
        ...initialData,
        name: user.name || initialData.name,
        avatar: user.image || initialData.avatar,
        username: initialData.username || '',
        bio: initialData.bio || '',
        location: initialData.location || '',
      }
    }
    setOnboardingData(initialData)
  }, [session])

  // Save onboarding data to localStorage with error handling
  const saveOnboardingData = useCallback((data: Partial<OnboardingData>) => {
    console.log('💾 saveOnboardingData called with:', data)
    setOnboardingData(prevData => {
      const updatedData = { ...prevData, ...data }
      console.log('💾 Updated onboarding data:', updatedData)
      
      try {
        localStorage.setItem('inkly-onboarding-data', JSON.stringify(updatedData))
      } catch (error) {
        console.error('❌ Failed to save to localStorage:', error)
        setError('Failed to save progress. Please try again.')
      }
      
      return updatedData
    })
  }, [])

  // Retry mechanism for failed API calls
  const retryOperation = useCallback(async (operation: () => Promise<any>, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error)
        if (attempt === maxRetries) {
          throw error
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }, [])

  // Mark step as completed with improved error handling
  const completeStep = useCallback(async (stepId: string) => {
    try {
      console.log('🔄 Completing step:', stepId)
      setError(null)
      
      // Get the latest data from localStorage to ensure we have the most recent updates
      const savedData = localStorage.getItem('inkly-onboarding-data')
      let latestData = onboardingData
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          latestData = { ...onboardingData, ...parsed }
        } catch (error) {
          console.error('Failed to parse saved onboarding data:', error)
        }
      }
      
      console.log('📊 Current onboarding data:', onboardingData)
      console.log('📊 Latest onboarding data from localStorage:', latestData)
      
      const requestData = {
        onboardingData: latestData,
        stepId
      }
      console.log('📤 Sending to API:', requestData)
      
      // Use retry mechanism for API call
      const response = await retryOperation(async () => {
        const res = await fetch('/api/onboarding/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to save step data')
        }

        return res.json()
      })

      console.log('✅ Step saved successfully:', response)

      // Update local state
      setSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, isCompleted: true } : step
      ))
      
      setRetryCount(0) // Reset retry count on success
    } catch (error) {
      console.error('❌ Error completing step:', error)
      setError(error instanceof Error ? error.message : 'Failed to save progress')
      setRetryCount(prev => prev + 1)
    }
  }, [onboardingData, retryOperation])

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setError(null) // Clear errors when moving to next step
    }
  }, [currentStep, steps.length])

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setError(null) // Clear errors when moving to previous step
    }
  }, [currentStep])

  // Navigate to specific step
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex)
      setError(null) // Clear errors when navigating
    }
  }, [steps.length])

  // Check if onboarding is complete
  const isOnboardingComplete = useCallback(() => {
    return steps.every(step => step.isCompleted)
  }, [steps])

  // Get current step data
  const getCurrentStep = useCallback(() => {
    return steps[currentStep]
  }, [steps, currentStep])

  // Get progress percentage
  const getProgressPercentage = useCallback(() => {
    const completedSteps = steps.filter(step => step.isCompleted).length
    return Math.round((completedSteps / steps.length) * 100)
  }, [steps])

  // Complete onboarding with improved error handling
  const completeOnboarding = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🎯 Completing onboarding...')
      setError(null)
      
      const response = await retryOperation(async () => {
        const res = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(onboardingData),
        })
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        return res.json()
      })

      console.log('✅ Onboarding completed successfully:', response)
      
      // Mark onboarding as complete in localStorage
      try {
        localStorage.setItem('inkly-onboarding-complete', 'true')
        localStorage.removeItem('inkly-onboarding-data')
      } catch (localStorageError) {
        console.warn('⚠️ LocalStorage error:', localStorageError)
      }

      // Update steps to mark all as completed
      setSteps(prev => prev.map(step => ({ ...step, isCompleted: true })))
      
      return true
    } catch (error) {
      console.error('❌ Error completing onboarding:', error)
      setError(`Failed to complete onboarding: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    }
  }, [onboardingData, retryOperation])

  // Reset onboarding
  const resetOnboarding = useCallback(() => {
    setCurrentStep(0)
    setOnboardingData(DEFAULT_ONBOARDING_DATA)
    setSteps(ONBOARDING_STEPS)
    setError(null)
    setRetryCount(0)
    
    try {
      localStorage.removeItem('inkly-onboarding-data')
      localStorage.removeItem('inkly-onboarding-complete')
    } catch (error) {
      console.error('❌ Failed to clear localStorage:', error)
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
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
  }
} 