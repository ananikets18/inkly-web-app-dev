"use client"

import { useEffect } from "react"
import { useNotifications } from "@/hooks/use-notifications"

// Mock data for demonstration - in real app, this would come from your API/state management
const mockEvents = {
  newFollower: { username: "sarah_writes", avatar: "/placeholder-user.jpg" },
  newReaction: { username: "mike_poet", inkTitle: "Midnight Thoughts", reaction: "❤️" },
  trendingInk: { title: "The Art of Letting Go", author: "emma_soul", reactions: 247 },
  followedUserInk: { username: "alex_creative", title: "Morning Reflections" },
  mostReacted: { title: "Life Lessons at 25", reactions: 189, author: "wisdom_seeker" },
  suggestion: { title: "Poetry for Beginners", reason: "based on your reading history" },
  editorsPick: { title: "Community Spotlight: Rising Voices", featured: true },
}

export default function NotificationService() {
  const { settings, sendNotification, isEnabled } = useNotifications()

  // Simulate notification events (in real app, these would be triggered by actual events)
  useEffect(() => {
    if (!isEnabled) return

    // Simulate random notifications for demo purposes
    const simulateNotifications = () => {
      const events = [
        {
          condition: settings.newFollower,
          title: "New Follower! 👥",
          body: `${mockEvents.newFollower.username} started following you. Welcome them to your community!`,
          tag: "new-follower",
        },
        {
          condition: settings.newReaction,
          title: "Your Ink got a reaction! ❤️",
          body: `${mockEvents.newReaction.username} reacted ${mockEvents.newReaction.reaction} to "${mockEvents.newReaction.inkTitle}"`,
          tag: "new-reaction",
        },
        {
          condition: settings.trendingInks,
          title: "🔥 Trending Now",
          body: `"${mockEvents.trendingInk.title}" by ${mockEvents.trendingInk.author} is trending with ${mockEvents.trendingInk.reactions} reactions!`,
          tag: "trending",
        },
        {
          condition: settings.followedUserInks,
          title: "New Ink from someone you follow ✨",
          body: `${mockEvents.followedUserInk.username} just posted "${mockEvents.followedUserInk.title}" - don't miss it!`,
          tag: "followed-user",
        },
        {
          condition: settings.mostReacted,
          title: "📈 Highly Reacted Ink",
          body: `"${mockEvents.mostReacted.title}" by ${mockEvents.mostReacted.author} has ${mockEvents.mostReacted.reactions} reactions. You'll want to see this!`,
          tag: "most-reacted",
        },
        {
          condition: settings.suggestions,
          title: "💡 Suggested for You",
          body: `Check out "${mockEvents.suggestion.title}" - ${mockEvents.suggestion.reason}`,
          tag: "suggestion",
        },
        {
          condition: settings.editorsPick,
          title: "🏆 Editor's Pick",
          body: `Don't miss our latest featured content: "${mockEvents.editorsPick.title}"`,
          tag: "editors-pick",
        },
      ]

      // Send a random notification every 30 seconds (for demo)
      const enabledEvents = events.filter((event) => event.condition)
      if (enabledEvents.length > 0) {
        const randomEvent = enabledEvents[Math.floor(Math.random() * enabledEvents.length)]
        sendNotification(randomEvent.title, randomEvent.body, { tag: randomEvent.tag })
      }
    }

    // Only run in development or demo mode
    if (process.env.NODE_ENV === "development") {
      const interval = setInterval(simulateNotifications, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [settings, sendNotification, isEnabled])

  // This component doesn't render anything - it's just for handling notification logic
  return null
}
