'use client'

import { useRouter } from "next/navigation"
import { Plus, Search, Volume2, VolumeX, UserPlus, Home, Compass, User, HelpCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/logo"
import { useSoundEffects } from "@/hooks/use-sound-effects"

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: User, label: "Profile" },
];

const supportItems = [
  { icon: HelpCircle, label: "Help" },
  { icon: Info, label: "About" },
];

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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 h-[73px] flex items-center justify-between" role="banner">
      <div className="flex items-center w-full gap-3">
        <Logo />
        <div className="hidden lg:flex flex-1 ml-4">
          <Input
            type="text"
            placeholder="Search for an inspiration..."
            className="w-full pl-4 pr-10 py-2 bg-gray-100 border-0 rounded-full focus:bg-white focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus:outline-none"
            aria-label="Search for an inspiration"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          <Button className="px-4 py-2 flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white border border-purple-600" aria-label="Create Ink">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Create
          </Button>
          <Button variant="outline" className="px-2 py-2 text-sm ml-1 flex items-center gap-2 rounded-full" aria-label="Join Inkly">
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            Join
          </Button>
        </div>
      </div>
    </header>
  )
}
