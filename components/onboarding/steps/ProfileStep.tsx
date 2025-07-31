"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { User, MapPin, Edit3, CheckCircle, XCircle, AlertTriangle, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { OnboardingData } from "@/hooks/use-onboarding"
import { useSession } from "next-auth/react"

interface ProfileStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
}

const avatarColors = [
  "bg-gradient-to-br from-purple-400 to-pink-400",
  "bg-gradient-to-br from-blue-400 to-cyan-400",
  "bg-gradient-to-br from-green-400 to-emerald-400",
  "bg-gradient-to-br from-orange-400 to-red-400",
  "bg-gradient-to-br from-indigo-400 to-purple-400",
  "bg-gradient-to-br from-pink-400 to-rose-400",
]

export default function ProfileStep({ data, onUpdate }: ProfileStepProps) {
  const { data: session } = useSession()
  const [name, setName] = useState(data.name)
  const [bio, setBio] = useState(data.bio)
  const [location, setLocation] = useState(data.location)
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(data.avatar || avatarColors[0])
  const [validation, setValidation] = useState<{
    name: { isValid: boolean; message: string; type: 'success' | 'error' | 'warning' }
    bio: { isValid: boolean; message: string; type: 'success' | 'error' | 'warning' }
    location: { isValid: boolean; message: string; type: 'success' | 'error' | 'warning' }
  }>({
    name: { isValid: true, message: '', type: 'success' },
    bio: { isValid: true, message: '', type: 'success' },
    location: { isValid: true, message: '', type: 'success' }
  })
  const isMounted = useRef(true)

  const isNameFromGoogle = session?.user?.name && name === session.user.name

  // Update parent data when fields change (without onUpdate dependency)
  useEffect(() => {
    if (isMounted.current) {
      const updateData = {
        name,
        bio,
        location,
        avatar: selectedAvatarColor
      }
      console.log('🔄 ProfileStep sending data:', updateData)
      console.log('📊 ProfileStep current state:', { name, bio, location, selectedAvatarColor })
      onUpdate(updateData)
    }
  }, [name, bio, location, selectedAvatarColor]) // Removed onUpdate from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const validateName = (value: string) => {
    if (!value.trim()) {
      return { isValid: false, message: 'Name is required', type: 'error' as const }
    }
    if (value.length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters', type: 'error' as const }
    }
    if (value.length > 50) {
      return { isValid: false, message: 'Name must be less than 50 characters', type: 'error' as const }
    }
    return { isValid: true, message: 'Name looks good!', type: 'success' as const }
  }

  const validateBio = (value: string) => {
    if (value.length > 200) {
      return { isValid: false, message: 'Bio must be less than 200 characters', type: 'error' as const }
    }
    return { isValid: true, message: '', type: 'success' as const }
  }

  const validateLocation = (value: string) => {
    if (value.length > 100) {
      return { isValid: false, message: 'Location must be less than 100 characters', type: 'error' as const }
    }
    return { isValid: true, message: '', type: 'success' as const }
  }

  const handleNameChange = (value: string) => {
    setName(value)
    setValidation(prev => ({ ...prev, name: validateName(value) }))
  }

  const handleBioChange = (value: string) => {
    setBio(value)
    setValidation(prev => ({ ...prev, bio: validateBio(value) }))
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
    setValidation(prev => ({ ...prev, location: validateLocation(value) }))
  }

  const getValidationIcon = (field: 'name' | 'bio' | 'location') => {
    const fieldValidation = validation[field]
    if (fieldValidation.type === 'success') {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    } else if (fieldValidation.type === 'error') {
      return <XCircle className="w-4 h-4 text-red-500" />
    } else if (fieldValidation.type === 'warning') {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us a bit about yourself
        </p>
      </div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Avatar Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Picture
          </label>
          <div className="flex justify-center">
            <Avatar className="w-20 h-20">
              <AvatarFallback className={`text-white text-lg font-semibold ${selectedAvatarColor}`}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-center gap-2">
            {avatarColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedAvatarColor(color)}
                className={`w-8 h-8 rounded-full ${color} ${
                  selectedAvatarColor === color ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name *
            </label>
            {isNameFromGoogle && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Check className="w-3 h-3" />
                From Google
              </Badge>
            )}
          </div>
          <div className="relative">
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`pr-10 ${
                validation.name.type === 'error' ? 'border-red-500' : 
                validation.name.type === 'success' ? 'border-green-500' : ''
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getValidationIcon('name')}
            </div>
          </div>
          {validation.name.message && (
            <p className={`text-xs ${
              validation.name.type === 'error' ? 'text-red-500' : 
              validation.name.type === 'success' ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {validation.name.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <div className="relative">
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => handleBioChange(e.target.value)}
              rows={3}
              className={`pr-10 ${
                validation.bio.type === 'error' ? 'border-red-500' : 
                validation.bio.type === 'success' ? 'border-green-500' : ''
              }`}
            />
            <div className="absolute right-3 top-3">
              {getValidationIcon('bio')}
            </div>
          </div>
          <div className="flex justify-between items-center">
            {validation.bio.message && (
              <p className={`text-xs ${
                validation.bio.type === 'error' ? 'text-red-500' : 
                validation.bio.type === 'success' ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {validation.bio.message}
              </p>
            )}
            <span className="text-xs text-gray-500">{bio.length}/200</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <div className="relative">
            <Input
              id="location"
              type="text"
              placeholder="Where are you based?"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className={`pr-10 ${
                validation.location.type === 'error' ? 'border-red-500' : 
                validation.location.type === 'success' ? 'border-green-500' : ''
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getValidationIcon('location')}
            </div>
          </div>
          {validation.location.message && (
            <p className={`text-xs ${
              validation.location.type === 'error' ? 'text-red-500' : 
              validation.location.type === 'success' ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {validation.location.message}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
} 