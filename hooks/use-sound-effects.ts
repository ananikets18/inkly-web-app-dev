"use client"

import { useCallback, useRef, useEffect, useState } from "react"

type SoundType = "click" | "hover" | "like" | "modalOpen" | "modalClose" | "follow" | "bookmark"

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initAudioContext = () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        setIsInitialized(true)
      } catch (error) {
        console.warn("Web Audio API not supported")
        setIsInitialized(false)
      }
    }

    const savedPreference = localStorage.getItem("inkly-sounds-enabled")
    if (savedPreference !== null) {
      setIsEnabled(JSON.parse(savedPreference))
    }

    const savedMutePreference = localStorage.getItem("inkly-sounds-muted")
    if (savedMutePreference !== null) {
      setIsMuted(JSON.parse(savedMutePreference))
    }

    const handleFirstInteraction = () => {
      if (!isInitialized) {
        initAudioContext()
      }
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("touchstart", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
    }
  }, [isInitialized])

  const generateSound = useCallback(
    (soundType: SoundType) => {
      if (!audioContextRef.current || !isInitialized) return

      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      const now = ctx.currentTime

      switch (soundType) {
        case "click":
          oscillator.frequency.setValueAtTime(800, now)
          oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
          oscillator.type = "square"
          break

        case "hover":
          oscillator.frequency.setValueAtTime(600, now)
          oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.05)
          gainNode.gain.setValueAtTime(0.03, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
          oscillator.type = "sine"
          break

        case "like":
          oscillator.frequency.setValueAtTime(523, now)
          oscillator.frequency.setValueAtTime(659, now + 0.1)
          oscillator.frequency.setValueAtTime(784, now + 0.2)
          gainNode.gain.setValueAtTime(0.15, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
          oscillator.type = "sine"
          break

        case "bookmark":
          oscillator.frequency.setValueAtTime(440, now)
          oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.15)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
          oscillator.type = "triangle"
          break

        case "follow":
          oscillator.frequency.setValueAtTime(330, now)
          oscillator.frequency.setValueAtTime(415, now + 0.1)
          oscillator.frequency.setValueAtTime(523, now + 0.2)
          gainNode.gain.setValueAtTime(0.12, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
          oscillator.type = "sine"
          break

        case "modalOpen":
          oscillator.frequency.setValueAtTime(200, now)
          oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.3)
          gainNode.gain.setValueAtTime(0.08, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
          oscillator.type = "sawtooth"
          break

        case "modalClose":
          oscillator.frequency.setValueAtTime(600, now)
          oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2)
          gainNode.gain.setValueAtTime(0.08, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
          oscillator.type = "sawtooth"
          break
      }

      try {
        oscillator.start(now)
        oscillator.stop(now + 0.5)
      } catch (error) {
        // Silently handle any audio errors
      }
    },
    [isInitialized],
  )

  const playSound = useCallback(
    (soundType: SoundType) => {
      if (!isEnabled || isMuted || !isInitialized) return
      generateSound(soundType)
    },
    [isEnabled, isMuted, isInitialized, generateSound],
  )

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    localStorage.setItem("inkly-sounds-muted", JSON.stringify(newMutedState))
  }, [isMuted])

  const toggleSounds = useCallback(() => {
    const newEnabledState = !isEnabled
    setIsEnabled(newEnabledState)
    localStorage.setItem("inkly-sounds-enabled", JSON.stringify(newEnabledState))
  }, [isEnabled])

  return {
    playSound,
    isMuted,
    isEnabled,
    isInitialized,
    toggleMute,
    toggleSounds,
  }
}
