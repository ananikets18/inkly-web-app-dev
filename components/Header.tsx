'use client'

import { useRouter, usePathname } from "next/navigation"
import { Plus, Search, Volume2, VolumeX, UserPlus, Home, Compass, User, HelpCircle, Info, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/logo"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import { useEffect, useRef, useState } from "react"

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
  const pathname = usePathname();
  const { playSound, isMuted, isInitialized, toggleMute } = useSoundEffects()

  // Smart show/hide on scroll (like BottomNav)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < 32) {
        setVisible(true)
      } else if (currentY > lastScrollY.current) {
        setVisible(false) // scrolling down
      } else {
        setVisible(true) // scrolling up
      }
      lastScrollY.current = currentY
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleButtonClick = (soundType: "click" | "like" | "follow" | "bookmark") => {
    playSound(soundType)
  }

  const handleButtonHover = () => {
    playSound("hover")
  }

  // Only show back button on inkfull page
  const isInkFullPage = /^\/ink\/[\w-]+$/.test(pathname || "");

  return (
    <header
      className={`sticky top-0 z-40 bg-white border-b border-gray-200 px-3 py-1 md:px-4 md:py-3 h-[73px] flex items-center justify-between transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-24'}`}
      role="banner"
      aria-label="Main navigation"
    >
      <div className="flex items-center w-full md:gap-3 gap-2">
        {isInkFullPage && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2 text-purple-600 hover:text-purple-700 focus-visible:ring-purple-500"
            title="Back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <Logo />
        <div className="hidden lg:flex flex-1 ml-4">
          <Input
            type="text"
            placeholder="Search for an inspiration..."
            className="w-full pl-4 pr-10 py-2 bg-gray-100 border-0 rounded-full focus:bg-white focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus:outline-none"
            aria-label="Search for an inspiration"
            title="Search for inks and inspiration"
            role="searchbox"
            aria-describedby="search-description"
          />
          <div id="search-description" className="sr-only">Search through all inks and content on Inkly</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto" role="group" aria-label="Account actions">
          <Button className="px-2.5 py-1.5 md:px-4 md:py-2 flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white border border-purple-600" aria-label="Create Ink" title="Create new ink">
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs md:text-sm lg:text-base">Create</span>
          </Button>
          <Button variant="outline" className="px-2 py-2 text-sm ml-1 flex items-center gap-2 rounded-full" aria-label="Join Inkly" title="Join Inkly community">
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs md:text-sm lg:text-base">Join</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
