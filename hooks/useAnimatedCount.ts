import { useEffect, useRef, useState } from "react"

export function useAnimatedCount(target: number, duration = 400) {
  const [animatedValue, setAnimatedValue] = useState(target)
    const raf = useRef<number | null>(null)


  useEffect(() => {
    const start = animatedValue
    const diff = target - start
    if (diff === 0) return

    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const value = start + diff * easeOutCubic(progress)
      setAnimatedValue(Math.round(value))

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick)
      }
    }

    raf.current = requestAnimationFrame(tick)

    // return () => cancelAnimationFrame(raf.current!)
    return () => {
  if (raf.current !== null) cancelAnimationFrame(raf.current)
}
  }, [target])

  return animatedValue
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}
