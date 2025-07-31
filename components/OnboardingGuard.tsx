"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface OnboardingGuardProps {
  children: React.ReactNode
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { data: session, status } = useSession()
  const { user, needsOnboarding, isLoading } = useAuth()
  const router = useRouter()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Only check after session is loaded and user data is fetched
    if (status === 'loading' || isLoading) return

    // Add a small delay to prevent immediate redirects
    const timer = setTimeout(() => {
      // If user is authenticated but hasn't completed onboarding
      if (session?.user && needsOnboarding && !hasChecked) {
        console.log('🛡️ OnboardingGuard: User needs onboarding, redirecting...')
        console.log('👤 User:', session.user.email)
        console.log('📊 Onboarding status:', { needsOnboarding, user })
        
        // Check if we're not already on onboarding page
        if (window.location.pathname !== '/onboarding') {
          setHasChecked(true)
          router.push('/onboarding')
        }
      } else if (session?.user && !needsOnboarding && hasChecked) {
        // User has completed onboarding, allow access
        console.log('✅ OnboardingGuard: User has completed onboarding')
        setHasChecked(false)
      }
    }, 1000) // 1 second delay

    return () => clearTimeout(timer)
  }, [session, status, needsOnboarding, router, user, isLoading, hasChecked])

  // Show loading while checking session and user data
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950 dark:via-background dark:to-orange-950 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-purple-600 rounded-full" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Loading...
          </h2>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 