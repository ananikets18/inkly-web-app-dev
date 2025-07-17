"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

export type NotificationPermission = "default" | "granted" | "denied"

export interface NotificationSettings {
  pushEnabled: boolean
  newFollower: boolean
  newReaction: boolean
  trendingInks: boolean
  followedUserInks: boolean
  mostReacted: boolean
  suggestions: boolean
  editorsPick: boolean
}

const DEFAULT_SETTINGS: NotificationSettings = {
  pushEnabled: false,
  newFollower: false,
  newReaction: false,
  trendingInks: false,
  followedUserInks: false,
  mostReacted: false,
  suggestions: false,
  editorsPick: false,
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize notification state
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission as NotificationPermission)

      // Load settings from localStorage
      const savedSettings = localStorage.getItem("inkly-notification-settings")
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings(parsed)
        } catch (error) {
          console.error("Failed to parse notification settings:", error)
        }
      }
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    localStorage.setItem("inkly-notification-settings", JSON.stringify(newSettings))
    setSettings(newSettings)
  }, [])

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast({
        title: "Not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      })
      return "denied"
    }

    setIsLoading(true)

    try {
      const result = await Notification.requestPermission()
      setPermission(result as NotificationPermission)

      if (result === "granted") {
        toast({
          title: "Notifications enabled!",
          description: "You'll now receive important updates from Inkly.",
        })
      } else if (result === "denied") {
        toast({
          title: "Notifications blocked",
          description: "You can enable them anytime in your browser settings.",
          variant: "destructive",
        })
        // Disable all notification settings if permission denied
        const disabledSettings = { ...DEFAULT_SETTINGS, pushEnabled: false }
        saveSettings(disabledSettings)
      }

      return result as NotificationPermission
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      toast({
        title: "Something went wrong",
        description: "We couldn't update your notification settings. Please try again.",
        variant: "destructive",
      })
      return "denied"
    } finally {
      setIsLoading(false)
    }
  }, [saveSettings])

  // Toggle push notifications (master toggle)
  const togglePushNotifications = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        if (permission === "default") {
          const newPermission = await requestPermission()
          if (newPermission !== "granted") {
            return false
          }
        } else if (permission === "denied") {
          toast({
            title: "Notifications blocked",
            description: "Please enable notifications in your browser settings first.",
            variant: "destructive",
          })
          return false
        }

        const newSettings = { ...settings, pushEnabled: true }
        saveSettings(newSettings)
        return true
      } else {
        // Disable all notification types when push is turned off
        const disabledSettings = {
          ...DEFAULT_SETTINGS,
          pushEnabled: false,
        }
        saveSettings(disabledSettings)

        toast({
          title: "Push notifications disabled",
          description: "You will no longer receive browser notifications from Inkly.",
        })
        return true
      }
    },
    [permission, settings, requestPermission, saveSettings],
  )

  // Toggle individual notification types
  const toggleNotificationType = useCallback(
    (type: keyof Omit<NotificationSettings, "pushEnabled">, enabled: boolean) => {
      if (!settings.pushEnabled || permission !== "granted") {
        toast({
          title: "Push notifications required",
          description: "Please enable push notifications first.",
          variant: "destructive",
        })
        return false
      }

      const newSettings = { ...settings, [type]: enabled }
      saveSettings(newSettings)

      const typeLabels = {
        newFollower: "New Follower notifications",
        newReaction: "New Reaction notifications",
        trendingInks: "Trending Inks notifications",
        followedUserInks: "Followed User Inks notifications",
        mostReacted: "Most Reacted notifications",
        suggestions: "Suggestions notifications",
        editorsPick: "Editor's Pick notifications",
      }

      toast({
        title: enabled ? "Enabled" : "Disabled",
        description: `${typeLabels[type]} ${enabled ? "enabled" : "disabled"}.`,
      })

      return true
    },
    [settings, permission, saveSettings],
  )

  // Send test notification
  const sendTestNotification = useCallback(() => {
    if (permission !== "granted") {
      toast({
        title: "Permission required",
        description: "Please enable notifications first to test them.",
        variant: "destructive",
      })
      return
    }

    const testMessages = [
      "🎉 This is how your notifications will look!",
      "✨ You have great taste! Here's a trending Ink.",
      "🔥 A new drop by someone you follow – don't miss it!",
      "📝 An Ink just hit 250 reactions. You'll want to see this!",
    ]

    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)]

    try {
      new Notification("Inkly", {
        body: randomMessage,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "inkly-test",
        requireInteraction: false,
        silent: false,
      })

      toast({
        title: "Test notification sent!",
        description: "Check your browser notifications to see how it looks.",
      })
    } catch (error) {
      console.error("Failed to send test notification:", error)
      toast({
        title: "Test failed",
        description: "Couldn't send test notification. Please check your browser settings.",
        variant: "destructive",
      })
    }
  }, [permission])

  // Send actual notification (for app events)
  const sendNotification = useCallback(
    (title: string, body: string, options?: NotificationOptions) => {
      if (permission !== "granted" || !settings.pushEnabled) {
        return
      }

      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          requireInteraction: false,
          silent: false,
          ...options,
        })
      } catch (error) {
        console.error("Failed to send notification:", error)
      }
    },
    [permission, settings.pushEnabled],
  )

  const canUseNotifications = typeof window !== "undefined" && "Notification" in window
  const isEnabled = settings.pushEnabled && permission === "granted"

  return {
    permission,
    settings,
    isLoading,
    canUseNotifications,
    isEnabled,
    togglePushNotifications,
    toggleNotificationType,
    sendTestNotification,
    sendNotification,
    requestPermission,
  }
}
