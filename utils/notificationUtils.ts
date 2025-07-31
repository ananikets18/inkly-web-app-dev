export interface NotificationSettings {
  pushEnabled: boolean
  newFollower: boolean
  newReaction: boolean
  trendingInks: boolean
  followedUserInks: boolean
  permissionStatus: 'default' | 'granted' | 'denied'
  lastUpdated: number
}

export interface NotificationPermissionResult {
  success: boolean
  permission: 'default' | 'granted' | 'denied'
  message: string
}

/**
 * Check if the browser supports notifications
 */
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window
}

/**
 * Get current notification permission status
 */
export const getNotificationPermission = (): 'default' | 'granted' | 'denied' => {
  if (!isNotificationSupported()) {
    return 'denied'
  }
  return Notification.permission as 'default' | 'granted' | 'denied'
}

/**
 * Request notification permission from the browser
 */
export const requestNotificationPermission = async (): Promise<NotificationPermissionResult> => {
  if (!isNotificationSupported()) {
    return {
      success: false,
      permission: 'denied',
      message: 'Notifications are not supported in this browser'
    }
  }

  try {
    const permission = await Notification.requestPermission()
    
    return {
      success: permission === 'granted',
      permission: permission as 'default' | 'granted' | 'denied',
      message: permission === 'granted' 
        ? 'Notification permission granted' 
        : permission === 'denied' 
        ? 'Notification permission denied' 
        : 'Notification permission dismissed'
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return {
      success: false,
      permission: 'denied',
      message: 'Failed to request notification permission'
    }
  }
}

/**
 * Save notification settings to localStorage
 */
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem('inkly-notification-settings', JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving notification settings:', error)
  }
}

/**
 * Load notification settings from localStorage
 */
export const loadNotificationSettings = (): NotificationSettings | null => {
  try {
    const stored = localStorage.getItem('inkly-notification-settings')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading notification settings:', error)
  }
  return null
}

/**
 * Get default notification settings
 */
export const getDefaultNotificationSettings = (): NotificationSettings => {
  return {
    pushEnabled: false,
    newFollower: true,
    newReaction: true,
    trendingInks: true,
    followedUserInks: true,
    permissionStatus: getNotificationPermission(),
    lastUpdated: Date.now()
  }
}

/**
 * Send a test notification (for development/testing)
 */
export const sendTestNotification = (title: string = 'Test Notification', body: string = 'This is a test notification from Inkly'): void => {
  if (!isNotificationSupported() || getNotificationPermission() !== 'granted') {
    console.warn('Cannot send test notification: notifications not supported or permission not granted')
    return
  }

  try {
    new Notification(title, {
      body,
      icon: '/placeholder-logo.png', // Update with your actual icon path
      badge: '/placeholder-logo.png',
      tag: 'test-notification',
      requireInteraction: false
    })
  } catch (error) {
    console.error('Error sending test notification:', error)
  }
}

/**
 * Update notification settings and save to storage
 */
export const updateNotificationSettings = (
  currentSettings: NotificationSettings,
  updates: Partial<NotificationSettings>
): NotificationSettings => {
  const updatedSettings: NotificationSettings = {
    ...currentSettings,
    ...updates,
    lastUpdated: Date.now()
  }
  
  saveNotificationSettings(updatedSettings)
  return updatedSettings
}

/**
 * Check if notifications are fully enabled (permission granted + push enabled)
 */
export const areNotificationsFullyEnabled = (settings: NotificationSettings): boolean => {
  return settings.permissionStatus === 'granted' && settings.pushEnabled
}

/**
 * Get active notification count (excluding pushEnabled)
 */
export const getActiveNotificationCount = (settings: NotificationSettings): number => {
  if (!areNotificationsFullyEnabled(settings)) {
    return 0
  }
  
  return [
    settings.newFollower,
    settings.newReaction,
    settings.trendingInks,
    settings.followedUserInks
  ].filter(Boolean).length
}

/**
 * Get browser-specific instructions for enabling notifications
 */
export const getBrowserNotificationInstructions = (): string => {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (userAgent.includes('chrome')) {
    return 'Chrome: Settings > Privacy and security > Site Settings > Notifications > Add Inkly'
  } else if (userAgent.includes('firefox')) {
    return 'Firefox: Settings > Privacy & Security > Permissions > Notifications > Settings > Add Inkly'
  } else if (userAgent.includes('safari')) {
    return 'Safari: Safari > Preferences > Websites > Notifications > Add Inkly'
  } else if (userAgent.includes('edge')) {
    return 'Edge: Settings > Cookies and site permissions > Notifications > Add Inkly'
  } else {
    return 'Go to your browser settings > Site Settings > Notifications to enable notifications for Inkly'
  }
} 