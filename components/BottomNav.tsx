"use client"

import { Home, Zap, Heart, Bookmark, TrendingUp, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSoundEffects } from "../hooks/use-sound-effects"

export default function BottomNav() {
  const { playSound } = useSoundEffects()

  const handleButtonHover = () => {
    playSound("hover")
  }

  const handleButtonClick = () => {
    playSound("click")
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center sm:hidden">
      {[Home, Zap, Heart, Bookmark, TrendingUp, Settings].map((Icon, i) => (
        <Button
          key={i}
          variant="ghost"
          size="icon"
          className="text-gray-400"
          onMouseEnter={handleButtonHover}
          onClick={handleButtonClick}
        >
          <Icon className="w-5 h-5" />
        </Button>
      ))}
    </nav>
  )
}
