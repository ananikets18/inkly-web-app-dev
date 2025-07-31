import { useState, useEffect } from 'react'

export interface NetworkStatus {
  isOnline: boolean
  isSlow: boolean
  connectionType: 'wifi' | '4g' | '3g' | '2g' | 'unknown'
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    isSlow: false,
    connectionType: 'unknown',
    effectiveType: 'unknown'
  })

  useEffect(() => {
    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine
      
      // Get connection info if available
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      
      let connectionType: 'wifi' | '4g' | '3g' | '2g' | 'unknown' = 'unknown'
      let effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown' = 'unknown'
      let isSlow = false

      if (connection) {
        // Determine connection type
        if (connection.type === 'wifi') {
          connectionType = 'wifi'
        } else if (connection.effectiveType) {
          effectiveType = connection.effectiveType
          connectionType = connection.effectiveType as any
          
          // Determine if connection is slow
          isSlow = ['slow-2g', '2g', '3g'].includes(connection.effectiveType)
        }
      }

      setNetworkStatus({
        isOnline,
        isSlow,
        connectionType,
        effectiveType
      })
    }

    // Initial check
    updateNetworkStatus()

    // Listen for online/offline events
    const handleOnline = () => updateNetworkStatus()
    const handleOffline = () => updateNetworkStatus()

    // Listen for connection changes
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus)
      }
    }
  }, [])

  return networkStatus
} 