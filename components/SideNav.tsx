"use client"

import {
  Home,
  Zap,
  Heart,
  Bookmark,
  Settings,
  Compass,
  User,
  HelpCircle,
  Info,
  Bell,
  BarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"

// Main navigation items (top, grouped)
const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
]
// Support items (bottom)
const supportItems = [
  { icon: HelpCircle, label: "Help", href: "/help" },
  { icon: Info, label: "About", href: "/about" },
]

export default function SideNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      // Only apply on screens where SideNav is visible
      if (window.innerWidth < 640) return
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

  const handleButtonHover = () => {}

  const handleNavClick = (href: string) => {
    if (href !== pathname) {
      router.push(href)
    }
  }

  return (
    <aside
      className={`isolate z-50 sticky top-[73px] hidden sm:block w-16 bg-white border-r border-gray-200 h-[calc(100vh-73px)] transition-transform duration-300 ${visible ? 'translate-x-0' : '-translate-x-24'}`}
      role="complementary"
      aria-label="Side navigation"
    >
      {/* Main nav group (no extra spacing) */}
      <nav className="flex flex-col items-center py-6 space-y-7" role="navigation" aria-label="Main navigation">
        {navItems.map(({ icon: Icon, label, href }, i) => (
          <div key={i} className="relative group last:mb-0">
            <Button
              variant="ghost"
              size="icon"
              aria-describedby={`tooltip-${label.toLowerCase()}`}
              aria-label={label}
              className={`w-10 h-10 text-gray-400 hover:text-purple-600 hover:bg-purple-50 ${pathname === href ? 'bg-purple-50 text-purple-600' : ''}`}
              onMouseEnter={handleButtonHover}
              onClick={() => handleNavClick(href)}
              {...(pathname === href ? { 'aria-current': 'page' } : {})}
            >
              <Icon className="w-10 h-10" aria-hidden="true" />
            </Button>
            {/* Tooltip */}
            <span id={`tooltip-${label.toLowerCase()}`} className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none" role="tooltip">
              {label}
            </span>
          </div>
        ))}
      </nav>
      {/* Support nav at the bottom */}
      <nav className="flex flex-col items-center absolute bottom-6 left-0 w-full space-y-0" role="navigation" aria-label="Support navigation">
        {supportItems.map(({ icon: Icon, label, href }, i) => (
          <div key={i} className="relative group mb-4 last:mb-0">
            <Button
              variant="ghost"
              size="icon"
              aria-describedby={`tooltip-${label.toLowerCase()}`}
              aria-label={label}
              className={`w-10 h-10 text-gray-400 hover:text-purple-600 hover:bg-purple-50 ${pathname === href ? 'bg-purple-50 text-purple-600' : ''}`}
              onMouseEnter={handleButtonHover}
              onClick={() => handleNavClick(href)}
              {...(pathname === href ? { 'aria-current': 'page' } : {})}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
            </Button>
            {/* Tooltip */}
            <span id={`tooltip-${label.toLowerCase()}`} className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none" role="tooltip">
              {label}
            </span>
          </div>
        ))}
      </nav>
    </aside>
  )
}

// TODO: Animate main content area on route change using framer-motion in layout or page components.
