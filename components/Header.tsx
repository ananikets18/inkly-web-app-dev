'use client'

import { useRouter } from "next/navigation"
import { Plus, Search, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/logo"
import { useSoundEffects } from "@/hooks/use-sound-effects"

export default function Header() {
  const router = useRouter()
  const { playSound, isMuted, isInitialized, toggleMute } = useSoundEffects()

  const handleButtonClick = (soundType: "click" | "like" | "follow" | "bookmark") => {
    playSound(soundType)
  }

  const handleButtonHover = () => {
    playSound("hover")
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 h-[73px]">
      <div className="flex items-center justify-between max-w-full">
        <Logo />

        <div className="hidden sm:flex flex-1 max-w-full mx-8">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search for an inspiration..."
              className="w-full pl-4 pr-10 py-2 bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              onMouseEnter={handleButtonHover}
              onClick={() => handleButtonClick("click")}
            >
              <Search className="w-6 h-6" />
            </Button>
          </div>

          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
            onMouseEnter={handleButtonHover}
            onClick={() => handleButtonClick("click")}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </Button>

          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-full"
            onClick={() => playSound("click")}
          >
            Sign In
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`w-10 h-10 text-gray-500 hover:text-gray-700 ${!isInitialized ? "opacity-50" : ""}`}
            onClick={toggleMute}
            title={!isInitialized ? "Click anywhere to enable sounds" : isMuted ? "Unmute sounds" : "Mute sounds"}
            disabled={!isInitialized}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
