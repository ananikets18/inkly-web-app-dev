  "use client"

  import {
    Home,
    Zap,
    Heart,
    Bookmark,
    TrendingUp,
    Users,
    Settings,
  } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { useSoundEffects } from "../hooks/use-sound-effects"
  import { cn } from "@/lib/utils" 

  const navItems = [
    { icon: Home, label: "Home" },
    { icon: Zap, label: "Explore" },
    { icon: Heart, label: "Liked" },
    { icon: Bookmark, label: "Saved" },
    { icon: TrendingUp, label: "Trending" },
    { icon: Users, label: "Community" },
  ]

  export default function SideNav() {
    const { playSound } = useSoundEffects()

    const handleButtonHover = () => {
      playSound("hover")
    }

    const handleButtonClick = () => {
      playSound("click")
    }

    return (
        <aside className="isolate z-50 sticky top-[73px] hidden sm:block w-16 bg-white border-r border-gray-200 h-[calc(100vh-73px)]">
            <nav className="flex flex-col items-center py-6 space-y-6">
              {navItems.map(({ icon: Icon, label }, i) => (
                <div key={i} className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-describedby={`tooltip-${label.toLowerCase()}`}
                  className="w-10 h-10 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                  onMouseEnter={handleButtonHover}
                  onClick={handleButtonClick}
                >
                  <Icon className="w-5 h-5" />
                </Button>

                {/* Tooltip */}
                <span className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none">
                  {label}
                </span>
              </div>
              ))}
            </nav>


          {/* ✅ Fixed settings icon wrapper — made sure positioning doesn't break */}
                <div className="group relative flex justify-center items-center mt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                    onMouseEnter={handleButtonHover}
                    onClick={handleButtonClick}
                  >
                    <Settings className="w-5 h-5" />
                  </Button>

                  {/* Tooltip for Settings */}
                  <span 
                   id="tooltip-settings"
                    role="tooltip"
                  className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none">
                    Settings
                  </span>
                </div>
      </aside>
    )
  }
