"use client"

import { useCallback, useRef, useEffect, useState } from "react"

type SoundType = "click" | "hover" | "like" | "modalOpen" | "modalClose" | "follow" | "bookmark" | "hashtagHover" | "inkify" | "reflection" | "notification" | "share" | "error" | "success"

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})
  const [isMuted, setIsMuted] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isAudioContextResumed, setIsAudioContextResumed] = useState(false)

  // Resume audio context on first user interaction
  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume()
        setIsAudioContextResumed(true)
      } catch (error) {
        console.warn("Failed to resume audio context:", error)
      }
    }
  }, [])

  // Initialize audio context and preload audio files
  useEffect(() => {
    // --- AUDIO SYSTEM WARM-UP FOR INSTANT FEEDBACK ---
    const initAudioContext = () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        setIsInitialized(true)
        // Check if audio context is suspended and needs to be resumed
        if (audioContextRef.current.state === 'suspended') {
          setIsAudioContextResumed(false)
        } else {
          setIsAudioContextResumed(true)
        }
      } catch (error) {
        console.warn("Web Audio API not supported")
        setIsInitialized(false)
      }
    }

    // Preload audio files
    const audioFiles: Record<string, string> = {
      notification: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zip-blob/inkly_ui/public/sound/notification-DWLeDvswKbB4IJrEp6P2ZrVQXI9VtJ.wav',
      success: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zip-blob/inkly_ui/public/sound/success-NDsUJUMG9rBCHxfMVTUH6KZPD8WfKX.mp3',
      share: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zip-blob/inkly_ui/public/sound/share_blip-smvg7yYNNcoep8wBCdTgCNbunZHcKQ.mp3',
    }

    Object.entries(audioFiles).forEach(([key, path]) => {
      const audio = new Audio(path)
      audio.preload = 'auto'
      audioRefs.current[key] = audio
    })

    // Resume AudioContext and play a silent sound to warm up the system
    initAudioContext()
    if (audioContextRef.current) {
      resumeAudioContext().then(() => {
        // Play a silent sound to reduce first-play latency
        const ctx = audioContextRef.current!
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        gainNode.gain.value = 0.0001
        oscillator.start()
        oscillator.stop(ctx.currentTime + 0.05)
      })
    }

    // Check user preferences
    const savedPreference = localStorage.getItem("inkly-sounds-enabled")
    if (savedPreference !== null) {
      setIsEnabled(JSON.parse(savedPreference))
    }

    const savedMutePreference = localStorage.getItem("inkly-sounds-muted")
    if (savedMutePreference !== null) {
      setIsMuted(JSON.parse(savedMutePreference))
    }

    // Also keep first interaction fallback for browsers that require it
    const handleFirstInteraction = async () => {
      if (!isInitialized) {
        initAudioContext()
      }
      await resumeAudioContext()
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("touchstart", handleFirstInteraction)
    document.addEventListener("keydown", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }
  }, [isInitialized, resumeAudioContext])

  // Lazy-load audio files only when needed
  const loadAudioFile = useCallback((audioKey: string, path: string) => {
    if (!audioRefs.current[audioKey]) {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audioRefs.current[audioKey] = audio;
    }
  }, []);

  // Play audio file
  const playAudioFile = useCallback((audioKey: string) => {
    if (!isEnabled || isMuted) return;
    const audioFiles: Record<string, string> = {
      notification: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zip-blob/inkly_ui/public/sound/notification-DWLeDvswKbB4IJrEp6P2ZrVQXI9VtJ.wav',
      success: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zip-blob/inkly_ui/public/sound/success-NDsUJUMG9rBCHxfMVTUH6KZPD8WfKX.mp3',
      share: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zip-blob/inkly_ui/public/sound/share_blip-smvg7yYNNcoep8wBCdTgCNbunZHcKQ.mp3',
    };
    if (!audioRefs.current[audioKey] && audioFiles[audioKey]) {
      loadAudioFile(audioKey, audioFiles[audioKey]);
    }
    const audio = audioRefs.current[audioKey];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
          resumeAudioContext().then(() => {
            audio.play().catch(() => {});
          });
        }
      });
    }
  }, [isEnabled, isMuted, resumeAudioContext, loadAudioFile]);

  // Generate different sound effects
  const generateSound = useCallback(
    (soundType: SoundType) => {
      if (!audioContextRef.current || !isInitialized) return

      // Ensure audio context is resumed before generating sounds
      if (audioContextRef.current.state === 'suspended') {
        resumeAudioContext().then(() => {
          generateSound(soundType)
        })
        return
      }

      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      const now = ctx.currentTime

      switch (soundType) {
        case "click":
          // Sharp click sound
          oscillator.frequency.setValueAtTime(800, now)
          oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
          oscillator.type = "square"
          break

        case "hover":
          // Subtle hover sound
          oscillator.frequency.setValueAtTime(600, now)
          oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.05)
          gainNode.gain.setValueAtTime(0.03, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
          oscillator.type = "sine"
          break

        case "hashtagHover":
          // Very subtle hashtag hover sound
          oscillator.frequency.setValueAtTime(500, now)
          oscillator.frequency.exponentialRampToValueAtTime(700, now + 0.03)
          gainNode.gain.setValueAtTime(0.02, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
          oscillator.type = "sine"
          break

        case "like":
          // Pleasant like sound
          oscillator.frequency.setValueAtTime(523, now) // C5
          oscillator.frequency.setValueAtTime(659, now + 0.1) // E5
          oscillator.frequency.setValueAtTime(784, now + 0.2) // G5
          gainNode.gain.setValueAtTime(0.15, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
          oscillator.type = "sine"
          break

        case "bookmark":
          // Bookmark save sound
          oscillator.frequency.setValueAtTime(440, now) // A4
          oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.15) // A5
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
          oscillator.type = "triangle"
          break

        case "follow":
          // Follow button sound
          oscillator.frequency.setValueAtTime(330, now) // E4
          oscillator.frequency.setValueAtTime(415, now + 0.1) // G#4
          oscillator.frequency.setValueAtTime(523, now + 0.2) // C5
          gainNode.gain.setValueAtTime(0.12, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
          oscillator.type = "sine"
          break

        case "inkify":
          // Magical swirling sound for inkify
          oscillator.frequency.setValueAtTime(200, now)
          oscillator.frequency.setValueAtTime(400, now + 0.1)
          oscillator.frequency.setValueAtTime(300, now + 0.2)
          oscillator.frequency.setValueAtTime(500, now + 0.3)
          gainNode.gain.setValueAtTime(0.08, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
          oscillator.type = "sine"
          break

        case "reflection":
          // Gentle chime for reflection
          oscillator.frequency.setValueAtTime(523, now) // C5
          oscillator.frequency.setValueAtTime(659, now + 0.1) // E5
          oscillator.frequency.setValueAtTime(784, now + 0.2) // G5
          oscillator.frequency.setValueAtTime(1047, now + 0.3) // C6
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
          oscillator.type = "sine"
          break

        case "modalOpen":
          // Modal open swoosh
          oscillator.frequency.setValueAtTime(200, now)
          oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.3)
          gainNode.gain.setValueAtTime(0.08, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
          oscillator.type = "sawtooth"
          break

        case "modalClose":
          // Modal close swoosh
          oscillator.frequency.setValueAtTime(600, now)
          oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2)
          gainNode.gain.setValueAtTime(0.08, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
          oscillator.type = "sawtooth"
          break

        case "error":
          // Error/warning sound
          oscillator.frequency.setValueAtTime(400, now)
          oscillator.frequency.setValueAtTime(300, now + 0.1)
          oscillator.frequency.setValueAtTime(350, now + 0.2)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
          oscillator.type = "square"
          break
      }

      try {
        oscillator.start(now)
        oscillator.stop(now + 0.5)
      } catch (error) {
        // Silently handle any audio errors
      }
    },
    [isInitialized, resumeAudioContext],
  )

  const playSound = useCallback(
    (soundType: SoundType) => {
      if (!isEnabled || isMuted) return
      
      // Ensure audio context is resumed before playing any sound
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        resumeAudioContext().then(() => {
          // Retry playing the sound after resuming
          setTimeout(() => playSound(soundType), 50)
        })
        return
      }
      
      // Play audio files for specific sounds
      if (soundType === "notification") {
        playAudioFile("notification")
        return
      }
      
      if (soundType === "share") {
        playAudioFile("share")
        return
      }

      if (soundType === "success") {
        playAudioFile("success")
        return
      }
      
      // Generate sounds for other types
      if (isInitialized) {
        generateSound(soundType)
      }
    },
    [isEnabled, isMuted, isInitialized, generateSound, playAudioFile, resumeAudioContext],
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
    isAudioContextResumed,
    toggleMute,
    toggleSounds,
    resumeAudioContext,
  }
}
