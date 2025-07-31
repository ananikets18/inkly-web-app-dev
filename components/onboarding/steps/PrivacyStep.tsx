"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Shield, Bell, Heart, TrendingUp, Star, Users, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { OnboardingData } from "@/hooks/use-onboarding"
import { useToast } from "@/components/ui/use-toast"
import { 
  requestNotificationPermission, 
  getNotificationPermission, 
  isNotificationSupported,
  getBrowserNotificationInstructions,
  saveNotificationSettings,
  type NotificationSettings
} from "@/utils/notificationUtils"

interface PrivacyStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
}

const notificationTypes = [
  {
    key: "newFollower" as const,
    icon: Users,
    title: "New Follower",
    description: "Get notified when someone follows you",
  },
  {
    key: "newReaction" as const,
    icon: Heart,
    title: "New Reaction",
    description: "Get notified when someone reacts to your Inks",
  },
  {
    key: "trendingInks" as const,
    icon: TrendingUp,
    title: "Trending Inks",
    description: "Popular Inks that are gaining traction",
  },
  {
    key: "followedUserInks" as const,
    icon: Star,
    title: "Followed User Inks",
    description: "New Inks from people you follow",
  },
]

export default function PrivacyStep({ data, onUpdate }: PrivacyStepProps) {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(data.notifications)
  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default')
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)
  const isMounted = useRef(true)

  // Check initial permission status
  useEffect(() => {
    setPermissionStatus(getNotificationPermission())
  }, [])

  // Update parent when notifications change (without onUpdate dependency)
  useEffect(() => {
    if (isMounted.current) {
      onUpdate({ notifications })
      
      // Save to localStorage for persistence
      const settings: NotificationSettings = {
        pushEnabled: notifications.pushEnabled,
        newFollower: notifications.newFollower,
        newReaction: notifications.newReaction,
        trendingInks: notifications.trendingInks,
        followedUserInks: notifications.followedUserInks,
        permissionStatus,
        lastUpdated: Date.now()
      }
      saveNotificationSettings(settings)
    }
  }, [notifications, permissionStatus]) // Removed onUpdate from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Handle permission request
  const handlePermissionRequest = async () => {
    if (!isNotificationSupported()) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive",
      })
      return false
    }

    setIsRequestingPermission(true)

    try {
      const result = await requestNotificationPermission()
      setPermissionStatus(result.permission)

      if (result.success) {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive push notifications from Inkly!",
        })
        
        // Enable push notifications and default notification types
        setNotifications(prev => ({
          ...prev,
          pushEnabled: true,
          newFollower: true,
          newReaction: true,
          trendingInks: true,
          followedUserInks: true
        }))

        return true
      } else {
        if (result.permission === 'denied') {
          toast({
            title: "Notifications Blocked",
            description: "You can enable notifications later in your browser settings.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Permission Required",
            description: "Please allow notifications to receive updates from Inkly.",
          })
        }
        
        // Keep push notifications disabled
        setNotifications(prev => ({
          ...prev,
          pushEnabled: false,
          newFollower: false,
          newReaction: false,
          trendingInks: false,
          followedUserInks: false
        }))

        return false
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      toast({
        title: "Error",
        description: "Failed to request notification permission. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsRequestingPermission(false)
    }
  }

  const toggleNotification = (key: keyof typeof notifications) => {
    // Don't allow individual toggles if push notifications are disabled
    if (!notifications.pushEnabled && key !== 'pushEnabled') {
      return
    }

    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const togglePushNotifications = async () => {
    if (notifications.pushEnabled) {
      // Disable push notifications
      setNotifications(prev => ({
        ...prev,
        pushEnabled: false,
        newFollower: false,
        newReaction: false,
        trendingInks: false,
        followedUserInks: false
      }))
    } else {
      // Enable push notifications and request permission
      const success = await handlePermissionRequest()
      if (!success) {
        // If permission request failed, keep push notifications disabled
        setNotifications(prev => ({
          ...prev,
          pushEnabled: false
        }))
      }
    }
  }

  const getActiveNotificationCount = () => {
    if (!notifications.pushEnabled) return 0
    return Object.entries(notifications).filter(([key, value]) => 
      key !== 'pushEnabled' && key !== 'permissionStatus' && value === true
    ).length
  }

  const getPermissionStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return "Permission Granted"
      case 'denied':
        return "Permission Denied"
      default:
        return "Permission Required"
    }
  }

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
          <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Privacy & Notifications
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Configure your privacy settings and notification preferences
        </motion.p>
      </div>

      {/* Push Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Push Notifications
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive notifications in your browser
            </p>
          </div>
          <Switch
            checked={notifications.pushEnabled}
            onCheckedChange={togglePushNotifications}
            disabled={isRequestingPermission}
          />
        </div>

        {/* Permission Status */}
        <div className="flex items-center gap-2 text-sm">
          {getPermissionStatusIcon()}
          <span className={`
            ${permissionStatus === 'granted' ? 'text-green-600' : 
              permissionStatus === 'denied' ? 'text-red-600' : 'text-yellow-600'}
          `}>
            {getPermissionStatusText()}
          </span>
          {isRequestingPermission && (
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Permission Instructions */}
        {permissionStatus === 'denied' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Notifications are blocked. {getBrowserNotificationInstructions()}
            </p>
          </div>
        )}

        {/* Warning when push notifications are disabled */}
        {!notifications.pushEnabled && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Individual notification types are disabled when push notifications are turned off.
            </p>
          </div>
        )}
      </motion.div>

      {/* Individual Notification Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notification Types
        </h3>
        
        <div className="space-y-3">
          {notificationTypes.map((type) => (
            <div
              key={type.key}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                !notifications.pushEnabled
                  ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <type.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {type.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {type.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications[type.key]}
                onCheckedChange={() => toggleNotification(type.key)}
                disabled={!notifications.pushEnabled}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">
              Notification Summary
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {notifications.pushEnabled 
                ? `${getActiveNotificationCount()} active notification types`
                : "Push notifications are disabled"
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Permission Status
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-300">
              {getPermissionStatusText()}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 