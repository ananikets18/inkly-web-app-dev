"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import SideNav from "../components/SideNav"
import BottomNav from "../components/BottomNav"
import InkCard from "../components/InkCard"



import {
  Search,
  Home,
  Zap,
  Heart,
  Bookmark,
  TrendingUp,
  Users,
  PenLine,
  Plus,
  Settings,
  Share2,
  Eye,
  Volume2,
  VolumeX,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { reactions } from "../components/reaction-button"
import { useSoundEffects } from "../hooks/use-sound-effects"
import { calculateReadingTime } from "../utils/reading-time"

const sampleContents = [
  "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten.",
  "I am the storm I've been waiting for.",
  "Whisper to the universe what you seek and it shall echo back tenfold.",
  "A silent affirmation each morning shaped her every decision.",
  "'We meet again,' said destiny as she chose her path yet again.",
  "Hope was not a bird, but a fire quietly kept alive beneath her ribs.",
  "If pain is the price of growth, she was ready to bloom.",
  "These lines hold more truth than silence ever could.",
  "Manifest with intention. Trust the magic in your breath.",
  "Some stories aren't written. They're felt.",
  "I have often regretted my speech, never my silence.",
  "Every time your heart is broken, a doorway cracks open to a world full of new beginnings, new opportunities.",
  "She stood there, watching the world rush by, holding a quiet storm within her chest that neither asked to be seen nor feared to be known. Her eyes weren't just windows to her soul—they were kaleidoscopes of broken mirrors, reflecting every truth she never dared to speak aloud. In the silence of her solitude, she built kingdoms of resilience, wrapped in poetry only she could read.",
  "Every inhale carried a story, and every exhale was a release. Her mind was an ocean of metaphors—waves of unspoken words, thoughts crashing and forming verses in her bones. At midnight, she didn't sleep. She bled ink, inscribing dreams onto the fabric of her pillowcases, where no one but the stars bore witness.",
  "Pain taught her the alphabet of strength. From A for ache to Z for zen, she mastered her narrative. Each scar etched on her heart was a stanza, and each tear, punctuation. When she walked, she carried libraries within her, volumes waiting to be unlocked, one glance at a time.",
  "She wasn't soft because life was easy. She was soft like the sea—calm on the surface but carrying storms in the deep. Poetry didn't come from peace. It was born from her chaos, fed by her resilience, and shaped by every dawn she decided to rise again.",
]

const authorNames = ["Maya Chen", "Alex Rivera", "Jordan Kim", "Sam Taylor", "Riley Park"]

function truncate(text: string, maxLength: number) {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "..."
}

export default function HomePage() {
  const router = useRouter()
  const [visibleCount, setVisibleCount] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [postReactions, setPostReactions] = useState<{ [key: number]: { reaction: string; count: number } }>({})
  const [scrollDistance, setScrollDistance] = useState(0)
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false)




  const { playSound, isMuted, isInitialized, toggleMute } = useSoundEffects()

  const handleButtonClick = (soundType: "click" | "like" | "follow" | "bookmark") => {
    playSound(soundType)
  }

  const handleButtonHover = () => {
    playSound("hover")
  }

// const handleReaction = (postId: number, reactionId: string) => {
//   const selected = reactions.find((r) => r.id === reactionId)
//   if (selected) {
//     setBurstEmoji(<selected.icon />)
//     setBurstKey(Date.now().toString()) // triggers overlay reset
//   }

//   setPostReactions((prev) => ({
//     ...prev,
//     [postId]: {
//       reaction: reactionId,
//       count: (prev[postId]?.count || 0) + 1,
//     },
//   }))
// }
const handleReaction = (postId: number, reactionId: string) => {
  const selected = reactions.find((r) => r.id === reactionId)
  if (selected) {
    setPostReactions((prev) => ({
      ...prev,
      [postId]: {
        reaction: reactionId,
        count: (prev[postId]?.count || 0) + 1,
      },
    }))
    // handleReact(reactionId) // Trigger burst!
  }
}


  const handleInkClick = (inkId: number) => {
    playSound("click")
    router.push(`/ink/${inkId}`)
  }

  // Track scroll distance and show new inks notification after significant scrolling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollDistance(currentScrollY)

      //- *Future* Show new inks notification after scrolling at least 2000px (significant engagement)
 

      // Infinite scroll logic
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !isLoadingMore) {
        setIsLoadingMore(true)
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10)
          setIsLoadingMore(false)
        }, 1000)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoadingMore, hasScrolledEnough])



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
  
    <Header />
      <div className="flex sm:flex-row flex-col">
       <SideNav />
        <main className="flex-1 px-4 py-6 relative isolate z-0">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {Array.from({ length: visibleCount }).map((_, idx) => {
                const content = sampleContents[idx % sampleContents.length]
                const author = authorNames[idx % authorNames.length]
                const isLong = idx % 3 === 0
                const displayContent = isLong ? content.repeat(2) : content
                const postReaction = postReactions[idx]
                const readingTime = calculateReadingTime(displayContent)

                const avatarColors = [
                  "from-purple-500 to-pink-500",
                  "from-blue-500 to-cyan-500",
                  "from-green-500 to-teal-500",
                  "from-orange-500 to-red-500",
                  "from-indigo-500 to-purple-500",
                ]
                const avatarColor = avatarColors[idx % avatarColors.length]

                return (
                  <InkCard
                    key={idx}
                    id={idx}
                    content={displayContent}
                    author={author}
                    avatarColor={avatarColor}
                    isLong={isLong}
                    reaction={postReaction}
                    readingTime={readingTime}
                    onClick={() => handleInkClick(idx)}
                    onHover={handleButtonHover}
                    onReact={(reactionId) => handleReaction(idx, reactionId)}
                    onBookmark={() => handleButtonClick("bookmark")}
                    onShare={() => handleButtonClick("click")}
                    onFollow={() => handleButtonClick("follow")} shareUrl={""}                  />
                )
              })}

            {isLoadingMore &&
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="animate-pulse break-inside-avoid rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-gray-100 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
          </div>
        </main>
      </div>
    <BottomNav />
    </div>
  )
}
