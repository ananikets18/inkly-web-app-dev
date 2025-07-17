"use client"

import type React from "react"

import { Home, Search, Plus, Bell, Settings } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSoundEffects } from "@/hooks/use-sound-effects"

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
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

  const navItems = [
    {
      icon: Home,
      label: "Home",
      id: "home",
      href: "/",
      ariaLabel: "Navigate to home page",
    },
    {
      icon: Search,
      label: "Explore",
      id: "explore",
      href: "/explore",
      ariaLabel: "Explore and discover new content",
    },
    {
      icon: Plus,
      label: "Create",
      id: "create",
      href: "/create",
      ariaLabel: "Create new ink post",
      isSpecial: true,
    },
    {
      icon: Bell,
      label: "Notifications",
      id: "notifications",
      href: "/notifications",
      ariaLabel: "View your notifications",
    },
    {
      icon: Settings,
      label: "Settings",
      id: "settings",
      href: "/settings",
      ariaLabel: "Access app settings",
    },
  ]

  // Get active nav based on current pathname
  const getActiveId = () => {
    if (pathname === "/") return "home"
    if (pathname.startsWith("/explore")) return "explore"
    if (pathname.startsWith("/create")) return "create"
    if (pathname.startsWith("/notifications")) return "notifications"
    if (pathname.startsWith("/settings")) return "settings"
    if (pathname.startsWith("/test-nav")) return "home" // For testing
    return "home"
  }

  const activeId = getActiveId()

  const handleButtonClick = (item: (typeof navItems)[0]) => {
    // Play sound and navigate for Create button
    if (item.id === "create") {
      playSound("click")
      router.push("/create")
      return
    }
    // Navigate to the route for others
    if (item.href) {
      router.push(item.href)
    }
    // Log for testing
    console.log(`Navigating to ${item.label}`)
  }

  const handleKeyDown = (event: React.KeyboardEvent, item: (typeof navItems)[0]) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleButtonClick(item)
    }
  }

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[0_-4px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_-4px_32px_rgba(0,0,0,0.32)] border-t border-gray-100/50 dark:border-gray-800/70 px-4 py-1 flex justify-between items-center sm:hidden transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map(({ icon: Icon, label, id, ariaLabel, isSpecial, ...item }) => (
        <button
          key={id}
          aria-label={ariaLabel}
          className={`group relative flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 min-h-[40px] min-w-[44px] w-20 ${
            isSpecial
              ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white shadow-lg hover:shadow-xl dark:shadow-purple-900/30 dark:hover:shadow-purple-900/50 active:scale-95"
              : activeId === id
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 active:scale-95"
          }`}
          onClick={() => handleButtonClick({ icon: Icon, label, id, ariaLabel, isSpecial, ...item })}
          onKeyDown={(e) => handleKeyDown(e, { icon: Icon, label, id, ariaLabel, isSpecial, ...item })}
          title={`${label} - ${ariaLabel}`}
          aria-current={activeId === id ? "page" : undefined}
          tabIndex={0}
        >
          <Icon
            className={`transition-all duration-200 ${
              isSpecial ? "w-6 h-6" : activeId === id ? "w-5 h-5 scale-110" : "w-5 h-5 group-hover:scale-105"
            }`}
            aria-hidden="true"
          />

          {/* Show label for active item */}
          {activeId === id && !isSpecial && (
            <span className="text-[10px] font-medium leading-none transition-all duration-200 mt-0.5 text-purple-600 dark:text-purple-400">{label}</span>
          )}

          {/* Active indicator dot */}
          {activeId === id && !isSpecial && (
            <div
              className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-400 transition-all duration-200"
              aria-hidden="true"
            />
          )}

          {/* Hover effect for non-special buttons */}
          {!isSpecial && (
            <div className="absolute inset-0 rounded-xl bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
          )}
        </button>
      ))}
    </nav>
  )
}
