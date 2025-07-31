"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

interface PerformanceMetrics {
  fps: number
  memoryUsage?: number
  renderTime: number
  cardCount: number
  loadTime: number
  apiCallCount: number
}

interface UseProfilePerformanceOptions {
  maxCards?: number
  memoryThreshold?: number
  enableMonitoring?: boolean
}

export const useProfilePerformance = (options: UseProfilePerformanceOptions = {}) => {
  const {
    maxCards = 100,
    memoryThreshold = 150, // Increased threshold to reduce false warnings
    enableMonitoring = process.env.NODE_ENV === 'development'
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    cardCount: 0,
    loadTime: 0,
    apiCallCount: 0
  })

  const [isMemoryWarning, setIsMemoryWarning] = useState(false)
  const [performanceWarnings, setPerformanceWarnings] = useState<string[]>([])

  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const renderStartTime = useRef(0)
  const apiCallCount = useRef(0)
  const loadStartTime = useRef(0)
  const memoryCheckInterval = useRef<NodeJS.Timeout | null>(null)

  // FPS Monitoring
  const measureFPS = useCallback(() => {
    frameCount.current++
    const currentTime = performance.now()
    
    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current))
      setMetrics(prev => ({ ...prev, fps }))
      
      // Performance warnings - More lenient thresholds
      if (fps < 20) { // Reduced from 30 to 20
        setPerformanceWarnings(prev => 
          prev.includes('Low FPS') ? prev : [...prev, 'Low FPS detected']
        )
      } else {
        setPerformanceWarnings(prev => prev.filter(w => w !== 'Low FPS'))
      }
      
      frameCount.current = 0
      lastTime.current = currentTime
    }
    
    if (enableMonitoring) {
      requestAnimationFrame(measureFPS)
    }
  }, [enableMonitoring])

  // Memory Monitoring
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
      
      setMetrics(prev => ({ ...prev, memoryUsage }))
      
      // Memory warning
      if (memoryUsage > memoryThreshold) {
        setIsMemoryWarning(true)
        setPerformanceWarnings(prev => 
          prev.includes('High Memory Usage') ? prev : [...prev, 'High Memory Usage']
        )
      } else {
        setIsMemoryWarning(false)
        setPerformanceWarnings(prev => prev.filter(w => w !== 'High Memory Usage'))
      }
    }
  }, [memoryThreshold])

  // Render Time Monitoring
  const measureRenderTime = useCallback(() => {
    renderStartTime.current = performance.now()
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStartTime.current
      setMetrics(prev => ({ ...prev, renderTime: Math.round(renderTime) }))
      
      // Render time warning - More lenient threshold
      if (renderTime > 50) { // Increased from 16 to 50ms
        setPerformanceWarnings(prev => 
          prev.includes('Slow Render') ? prev : [...prev, 'Slow Render detected']
        )
      } else {
        setPerformanceWarnings(prev => prev.filter(w => w !== 'Slow Render'))
      }
    })
  }, [])

  // Memory Cleanup
  const performMemoryCleanup = useCallback(() => {
    console.log('🔄 Performing memory cleanup...')
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc()
    }
    
    // Clear any cached data
    if (typeof window !== 'undefined') {
      // Clear any stored data that might be causing memory leaks
      sessionStorage.clear()
    }
    
    console.log('✅ Memory cleanup completed')
  }, [])

  // Start monitoring
  useEffect(() => {
    if (!enableMonitoring) return

    loadStartTime.current = performance.now()
    
    measureFPS()
    measureMemory()
    measureRenderTime()

    // Set up memory monitoring interval
    memoryCheckInterval.current = setInterval(measureMemory, 2000)

    // Set up render time monitoring
    const renderInterval = setInterval(measureRenderTime, 1000)

    return () => {
      if (memoryCheckInterval.current) {
        clearInterval(memoryCheckInterval.current)
      }
      clearInterval(renderInterval)
    }
  }, [enableMonitoring, measureFPS, measureMemory, measureRenderTime])

  // Auto-cleanup when memory usage is high
  useEffect(() => {
    if (isMemoryWarning && enableMonitoring) {
      performMemoryCleanup()
    }
  }, [isMemoryWarning, enableMonitoring, performMemoryCleanup])

  // Track API calls
  const trackApiCall = useCallback(() => {
    apiCallCount.current++
    setMetrics(prev => ({ ...prev, apiCallCount: apiCallCount.current }))
  }, [])

  // Update card count
  const updateCardCount = useCallback((count: number) => {
    setMetrics(prev => ({ ...prev, cardCount: count }))
    
    // Performance warning for too many cards
    if (count > maxCards) {
      setPerformanceWarnings(prev => 
        prev.includes('Too Many Cards') ? prev : [...prev, 'Too Many Cards']
      )
    } else {
      setPerformanceWarnings(prev => prev.filter(w => w !== 'Too Many Cards'))
    }
  }, [maxCards])

  // Calculate load time
  const finishLoading = useCallback(() => {
    const loadTime = performance.now() - loadStartTime.current
    setMetrics(prev => ({ ...prev, loadTime: Math.round(loadTime) }))
    
          // Load time warning - More lenient threshold
      if (loadTime > 5000) { // Increased from 3000 to 5000ms
        setPerformanceWarnings(prev => 
          prev.includes('Slow Load') ? prev : [...prev, 'Slow Load detected']
        )
      }
  }, [])

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    const { fps, memoryUsage, renderTime, loadTime, apiCallCount } = metrics
    
    return {
      isHealthy: fps >= 20 && renderTime <= 50 && (!memoryUsage || memoryUsage <= memoryThreshold),
      warnings: performanceWarnings,
      recommendations: [
        fps < 20 && 'Consider reducing content or optimizing animations',
        renderTime > 50 && 'Optimize component rendering or use virtualization',
        memoryUsage && memoryUsage > memoryThreshold && 'Implement memory cleanup or reduce data load',
        loadTime > 5000 && 'Optimize initial data loading or implement progressive loading'
      ].filter(Boolean) as string[]
    }
  }, [metrics, performanceWarnings, memoryThreshold])

  return {
    metrics,
    isMemoryWarning,
    performanceWarnings,
    trackApiCall,
    updateCardCount,
    finishLoading,
    performMemoryCleanup,
    getPerformanceSummary,
    isMonitoringEnabled: enableMonitoring
  }
} 