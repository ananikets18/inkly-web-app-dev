"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { User, CheckCircle, XCircle, AlertTriangle, Loader2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { validateUsername } from "@/utils/authValidation"
import { OnboardingData } from "@/hooks/use-onboarding"
import { useSession } from "next-auth/react"

interface UsernameStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
}

export default function UsernameStep({ data, onUpdate }: UsernameStepProps) {
  const { data: session } = useSession()
  const [username, setUsername] = useState(data.username)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [validation, setValidation] = useState<{
    isValid: boolean
    message: string
    type: 'success' | 'error' | 'warning'
    errors: string[]
    warnings: string[]
  } | null>(null)
  const isMounted = useRef(true)
  const suggestionsGenerated = useRef(false)

  // Generate username suggestions once when session is available
  useEffect(() => {
    if (suggestionsGenerated.current || !session?.user?.name) {
      return
    }
    
    const name = session.user.name
    const cleanName = name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8)
    if (!cleanName) return
    
    const newSuggestions: string[] = []
    
    // Basic variations
    newSuggestions.push(cleanName)
    newSuggestions.push(`${cleanName}${cleanName.length}`)
    newSuggestions.push(`${cleanName}${cleanName.length + 1}`)
    newSuggestions.push(`${cleanName}${cleanName.length + 2}`)
    
    // Add with common suffixes
    const suffixes = ['ink', 'writer', 'creator', 'inkly']
    suffixes.forEach(suffix => {
      newSuggestions.push(`${cleanName}${suffix}`)
    })
    
    setSuggestions(newSuggestions.slice(0, 4)) // Limit to 4 suggestions
    suggestionsGenerated.current = true
  }, [session?.user?.name]) // Only regenerate when the actual name changes

  // Debounced validation
  useEffect(() => {
    if (!username.trim()) {
      setValidation(null)
      return
    }

    const timeoutId = setTimeout(() => {
      setIsChecking(true)
      
      // Simulate API delay for availability check
      setTimeout(() => {
        if (!isMounted.current) return
        
        const result = validateUsername(username)
        
        if (!result.isValid) {
          setValidation({
            isValid: false,
            message: result.errors[0] || "Invalid username",
            type: 'error',
            errors: result.errors,
            warnings: result.warnings
          })
        } else if (result.warnings.length > 0) {
          setValidation({
            isValid: true,
            message: result.warnings[0],
            type: 'warning',
            errors: result.errors,
            warnings: result.warnings
          })
        } else {
          setValidation({
            isValid: true,
            message: "Username is available!",
            type: 'success',
            errors: result.errors,
            warnings: result.warnings
          })
        }
        
        setIsChecking(false)
      }, 500) // Simulate network delay
    }, 300) // Debounce delay

    return () => clearTimeout(timeoutId)
  }, [username])

  // Update parent data when username changes (without onUpdate dependency)
  useEffect(() => {
    if (isMounted.current) {
      onUpdate({ username })
    }
  }, [username]) // Removed onUpdate from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const getValidationIcon = () => {
    if (isChecking) {
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
    
    if (!validation) {
      return null
    }

    switch (validation.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getValidationColor = () => {
    if (!validation) return ''
    
    switch (validation.type) {
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center"
      >
        <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
      >
        Choose Your Username
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 dark:text-gray-400 mb-8"
      >
        Pick a unique username that represents you. This will be your identity on Inkly.
      </motion.p>

      {/* Username Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="relative">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className={`w-full pr-10 ${
              validation?.type === 'error' ? 'border-red-500' : 
              validation?.type === 'success' ? 'border-green-500' : ''
            }`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getValidationIcon()}
          </div>
        </div>

        {/* Validation Message */}
        {validation && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${getValidationColor()}`}
          >
            {validation.message}
          </motion.p>
        )}

        {/* Username Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>Suggestions based on your name:</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={`${suggestion}-${index}`}
                  variant="outline"
                  size="sm"
                  onClick={() => setUsername(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Username Rules */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-left space-y-2"
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Username Rules:
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 3-30 characters long</li>
            <li>• Letters, numbers, underscores, dots, and hyphens only</li>
            <li>• Cannot start or end with special characters</li>
            <li>• Must be unique</li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  )
} 