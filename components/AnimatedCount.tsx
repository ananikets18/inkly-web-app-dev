// components/AnimatedCount.tsx
"use client"

import { useAnimatedCount } from "@/hooks/useAnimatedCount"
import { formatCount } from "@/utils/formatCount"
import { cn } from "@/lib/utils"

interface AnimatedCountProps {
  value: number
  className?: string
  animate?: boolean
}

export default function AnimatedCount({ value, className, animate = true }: AnimatedCountProps) {
  const animatedValue = useAnimatedCount(value)
  return (
    <span
      className={cn(
        "text-xs text-gray-500 ml-1 inline-block text-center tabular-nums transition-all duration-300",
        animate && "animate-pop-up-scale",
        className
      )}
    >
      {formatCount(animatedValue)}
    </span>
  )
}
