"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name?: string
  image?: string
  username?: string
  bio?: string
  location?: string
  onboardingCompleted?: boolean
  onboardingStep?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  signUpWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  needsOnboarding: boolean
  refreshUserData: () => Promise<void>
  isNewUser: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const router = useRouter()

  // Function to fetch user data from database
  const fetchUserData = async () => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    if (session?.user?.email) {
      try {
        console.log('🔍 Fetching user data from database...')
        const response = await fetch('/api/user/onboarding-status')
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ User data fetched:', data.user)
          setUser(data.user)
          setIsNewUser(false)
        } else {
          console.log('❌ Failed to fetch user data:', response.status)
          // Fallback to session data
          setUser({
            id: (session.user as any).id || "",
            email: session.user.email || "",
            name: session.user.name || "",
            image: session.user.image || "",
            onboardingCompleted: false,
            onboardingStep: "username",
          })
          setIsNewUser(true)
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error)
        // Fallback to session data
        setUser({
          id: (session.user as any).id || "",
          email: session.user.email || "",
          name: session.user.name || "",
          image: session.user.image || "",
          onboardingCompleted: false,
          onboardingStep: "username",
        })
        setIsNewUser(true)
      }
    } else {
      setUser(null)
      setIsNewUser(false)
    }

    setIsLoading(false)
  }

  // Function to refresh user data (can be called from other components)
  const refreshUserData = async () => {
    console.log('🔄 Refreshing user data...')
    await fetchUserData()
  }

  // Fetch user data from database when session changes
  useEffect(() => {
    fetchUserData()
  }, [session, status])

  const signInWithGoogle = async () => {
    try {
      console.log('🔐 Initiating Google sign-in...')
      await signIn("google", { 
        callbackUrl: "/onboarding",
        redirect: true 
      })
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUpWithGoogle = async () => {
    try {
      console.log('🆕 Initiating Google sign-up...')
      await signIn("google", { 
        callbackUrl: "/onboarding",
        redirect: true 
      })
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log('🚪 Logging out...')
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const needsOnboarding = user ? !user.onboardingCompleted : false

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signUpWithGoogle,
    logout,
    needsOnboarding,
    refreshUserData,
    isNewUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 