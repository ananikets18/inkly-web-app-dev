"use client"

import { Home, Compass, User, PenTool, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSoundEffects } from "../hooks/use-sound-effects"
import { useEffect, useRef, useState } from "react"

export default function BottomNav() {
  const { playSound } = useSoundEffects()
  // Smart show/hide on scroll
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

  // Always show signed-in nav
  const nav = [
    { icon: Home, label: "Home" },
    { icon: Compass, label: "Explore" },
    { icon: User, label: "Profile" },
    { icon: Bell, label: "Notifications" },
  ]

  // Simulate active nav (replace with router logic)
  const activeLabel = "Home"

  const handleButtonHover = () => {
    playSound("hover")
  }

  const handleButtonClick = (label: string) => {
    playSound("click")
    // TODO: Add navigation or modal logic here
    alert(label + " clicked!")
  }

  return (
    <nav
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-md rounded-2xl bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-md shadow-lg border border-gray-100 px-1.5 py-1 flex justify-between items-center sm:hidden transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-24"}`}
    >
      {/* Left nav items (Home, Explore) */}
      <div className="flex gap-1 flex-1 justify-start items-center">
        {nav.slice(0, 2).map(({ icon: Icon, label }) => (
          <button
            key={label}
            aria-label={label}
            className={`flex flex-col items-center justify-center px-1 py-1 rounded-lg transition-all duration-150 ${activeLabel === label ? "text-purple-600 font-bold" : "text-gray-600 hover:text-purple-500 font-normal"}`}
            onMouseEnter={handleButtonHover}
            onClick={() => handleButtonClick(label)}
          >
            <Icon className="w-6 h-6 mb-0" />
            <span className="text-[10px] leading-none mt-0">{label}</span>
            {activeLabel === label && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1" />}
          </button>
        ))}
      </div>

      {/* Center FAB (Create) */}
      <div className="relative flex-1 flex justify-center items-center">
        <button
          aria-label="Create"
          className="absolute -top-4 shadow-[0_2px_12px_0_rgba(80,0,120,0.14)] bg-purple-600 hover:bg-purple-700 text-white w-11 h-11 z-20 flex items-center justify-center transition-transform duration-200 active:scale-95"
          onClick={() => handleButtonClick("Create")}
          style={{ borderRadius: "50%" }}
        >
          <PenTool className="w-5 h-5" />
        </button>
      </div>

      {/* Right nav items (Profile, Notifications) */}
      <div className="flex gap-1 flex-1 justify-end items-center">
        {nav.slice(2).map(({ icon: Icon, label }) => (
          <button
            key={label}
            aria-label={label}
            className={`flex flex-col items-center justify-center px-1 py-1 rounded-lg transition-all duration-150 ${activeLabel === label ? "text-purple-600 font-bold" : "text-gray-600 hover:text-purple-500 font-normal"}`}
            onMouseEnter={handleButtonHover}
            onClick={() => handleButtonClick(label)}
          >
            <Icon className="w-6 h-6 mb-0" />
            <span className="text-[10px] leading-none mt-0">{label}</span>
            {activeLabel === label && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1" />}
          </button>
        ))}
      </div>
    </nav>
  )
}
