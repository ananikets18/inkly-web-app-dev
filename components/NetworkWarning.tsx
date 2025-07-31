"use client"

import { useState } from "react"
import { AlertCircle, Wifi, WifiOff, Signal, SignalHigh, SignalMedium, SignalLow, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { motion, AnimatePresence } from "framer-motion"

interface NetworkWarningProps {
  className?: string
  showConnectionType?: boolean
  variant?: 'banner' | 'toast' | 'inline'
  dismissible?: boolean
}

export function NetworkWarning({ 
  className = "", 
  showConnectionType = true,
  variant = 'banner',
  dismissible = true
}: NetworkWarningProps) {
  const { isOnline, isSlow, connectionType, effectiveType } = useNetworkStatus()
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show anything if online and not slow, or if dismissed
  if (isOnline && !isSlow || isDismissed) {
    return null
  }

  const getConnectionIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />
    if (connectionType === 'wifi') return <Wifi className="h-4 w-4" />
    
    switch (effectiveType) {
      case '4g':
        return <SignalHigh className="h-4 w-4" />
      case '3g':
        return <SignalMedium className="h-4 w-4" />
      case '2g':
      case 'slow-2g':
        return <SignalLow className="h-4 w-4" />
      default:
        return <Signal className="h-4 w-4" />
    }
  }

  const getConnectionText = () => {
    if (!isOnline) return "You're currently offline"
    if (isSlow) return "Slow connection detected"
    return "Connection issues detected"
  }

  const getConnectionDescription = () => {
    if (!isOnline) {
      return "Some features may not work until you're back online."
    }
    
    if (isSlow) {
      const typeText = showConnectionType ? ` (${effectiveType.toUpperCase()})` : ""
      return `You're on a slow connection${typeText}. Content may load slowly.`
    }
    
    return "Some features may not work properly."
  }

  const getAlertVariant = () => {
    if (!isOnline) return "destructive"
    if (isSlow) return "default"
    return "default"
  }

  const getAlertClassName = () => {
    const baseClasses = "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
    const offlineClasses = "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
    
    return !isOnline ? offlineClasses : baseClasses
  }

  const getTextColor = () => {
    if (!isOnline) return "text-red-800 dark:text-red-200"
    return "text-orange-800 dark:text-orange-200"
  }

  const getIconColor = () => {
    if (!isOnline) return "text-red-600"
    return "text-orange-600"
  }

  if (variant === 'toast') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}
        >
          <Alert className={`${getAlertClassName()} shadow-lg relative`} role="alert" aria-live="polite">
            <div className={`${getIconColor()}`}>
              {getConnectionIcon()}
            </div>
            <AlertDescription className={`${getTextColor()} font-medium pr-8`}>
              {getConnectionText()}
            </AlertDescription>
            {dismissible && (
              <button
                onClick={() => setIsDismissed(true)}
                className={`${getIconColor()} hover:opacity-70 transition-opacity absolute top-3 right-3`}
                aria-label="Dismiss network warning"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </Alert>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (variant === 'inline') {
    return (
      <Alert className={`${getAlertClassName()} ${className} relative`} role="alert" aria-live="polite">
        <div className={`${getIconColor()}`}>
          {getConnectionIcon()}
        </div>
        <AlertDescription className={`${getTextColor()} pr-8`}>
          <span className="font-medium">{getConnectionText()}</span>
          <span className="block text-sm mt-1">{getConnectionDescription()}</span>
        </AlertDescription>
        {dismissible && (
          <button
            onClick={() => setIsDismissed(true)}
            className={`${getIconColor()} hover:opacity-70 transition-opacity absolute top-3 right-3`}
            aria-label="Dismiss network warning"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </Alert>
    )
  }

  // Default banner variant
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className={`${className}`}
      >
        <Alert className={`${getAlertClassName()} mb-4 relative`} role="alert" aria-live="polite">
          <div className={`${getIconColor()}`}>
            {getConnectionIcon()}
          </div>
          <AlertDescription className={`${getTextColor()} pr-8`}>
            <span className="font-medium">{getConnectionText()}</span>
            <span className="block text-sm mt-1">{getConnectionDescription()}</span>
          </AlertDescription>
          {dismissible && (
            <button
              onClick={() => setIsDismissed(true)}
              className={`${getIconColor()} hover:opacity-70 transition-opacity absolute top-3 right-3`}
              aria-label="Dismiss network warning"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </Alert>
      </motion.div>
    </AnimatePresence>
  )
} 