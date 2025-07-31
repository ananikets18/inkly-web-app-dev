"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/create',
  '/studio',
  '/profile',
  '/settings',
  '/notifications',
  '/analytics',
  '/drafts',
  '/edit',
  '/account',
  '/my-inks',
  '/my-drafts',
  '/my-collections',
  '/my-bookmarks',
  '/my-likes',
  '/my-following',
  '/my-followers',
  '/messages',
  '/conversations',
  '/chat',
  '/insights',
  '/workspace',
  '/preferences',
  '/social',
  '/monetization',
  '/verification',
  '/support',
  '/admin'
]

// Special routes that have their own logic
const SPECIAL_ROUTES = [
  '/onboarding', // Requires authentication but has special onboarding logic
  '/auth/signin', // Public auth pages
  '/auth/signup',
  '/auth/signout'
]

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [showRedirect, setShowRedirect] = useState(false)

  // Check if current path is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if current path is a special route
  const isSpecialRoute = SPECIAL_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  useEffect(() => {
    // Only check after session and auth context are loaded
    if (status === 'loading' || isLoading) return

    const checkAuth = async () => {
      // Handle special routes
      if (isSpecialRoute) {
        if (pathname === '/onboarding') {
          // Onboarding requires authentication but has its own logic
          if (!isAuthenticated) {
            console.log('🛡️ AuthGuard: Unauthenticated user trying to access onboarding')
            router.push('/auth/signin')
            return
          }
          
          // Check if user has already completed onboarding
          const onboardingComplete = localStorage.getItem('inkly-onboarding-complete')
          if (onboardingComplete === 'true') {
            console.log('🛡️ AuthGuard: User already completed onboarding, redirecting to home')
            router.push('/')
            return
          }
          
          // If authenticated and onboarding not complete, allow access
          console.log('🛡️ AuthGuard: Authenticated user accessing onboarding')
          setIsChecking(false)
          return
        }
        
        // Auth pages are public
        if (pathname.startsWith('/auth/')) {
          setIsChecking(false)
          return
        }
      }

      // If it's a protected route and user is not authenticated
      if (isProtectedRoute && !isAuthenticated) {
        console.log('🛡️ AuthGuard: Unauthorized access to protected route:', pathname)
        console.log('👤 User status:', { isAuthenticated, user, session })
        
        // Show redirect animation
        setShowRedirect(true)
        
        // Redirect to home after a brief delay
        setTimeout(() => {
          router.push('/')
        }, 2000)
        
        return
      }

      // If user is authenticated or route is not protected, allow access
      setIsChecking(false)
    }

    checkAuth()
  }, [isProtectedRoute, isSpecialRoute, isAuthenticated, pathname, status, isLoading, router, user, session])

  // Show loading while checking authentication
  if (status === 'loading' || isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950 dark:via-background dark:to-orange-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="mx-auto mb-6 w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center"
          >
            <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Checking access...
          </h2>
        </div>
      </div>
    )
  }

  // Show redirect message for unauthorized access
  if (showRedirect) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950 dark:via-background dark:to-red-950 flex items-center justify-center"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto mb-6 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
              >
                <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Access Restricted
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This page requires authentication. Please sign in to continue.
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400"
              >
                <span className="text-sm">Redirecting to home...</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </motion.div>
              
              <Button
                onClick={() => router.push('/')}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    )
  }

  // If route is not protected or user is authenticated, show children
  return <>{children}</>
} 