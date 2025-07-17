// Enhanced: Use localStorage for ink data if available, fallback to default mock data for SSR/ISR

import { getWordCount } from "@/utils/textFilters"

const defaultInks = [
  {
    id: "1",
    content: "The quiet hum of the city at dawn, a symphony of awakening dreams.",
    author: "Luna",
    username: "@luna_writes",
    createdAt: "2024-07-10T08:00:00Z",
    readingTime: "1 min",
    views: "1.2k",
    tags: ["city", "morning", "dreams"],
    mood: "Dreamy",
    type: "Thought",
    reactionsCount: 120,
    bookmarksCount: 50,
    reflectionsCount: 30,
    sharesCount: 15,
    theme: 3, // Midnight Sky
    font: "font-serif",
    visibility: "public",
  },
  {
    id: "2",
    content: "In every ending, there's a new beginning. Embrace the change, for it holds the seeds of growth.",
    author: "Solara",
    username: "@solara_ink",
    createdAt: "2024-07-09T14:30:00Z",
    readingTime: "45 sec",
    views: "800",
    tags: ["inspiration", "growth", "change"],
    mood: "Inspiring",
    type: "Affirmation",
    reactionsCount: 80,
    bookmarksCount: 30,
    reflectionsCount: 20,
    sharesCount: 10,
    theme: 1, // Sunset Glow
    font: "font-sans font-bold",
    visibility: "public",
  },
  {
    id: "3",
    content: "Why did the scarecrow win an award? Because he was outstanding in his field!",
    author: "Chuckles",
    username: "@chuckles_ink",
    createdAt: "2024-07-08T18:00:00Z",
    readingTime: "15 sec",
    views: "2.5k",
    tags: ["humor", "joke"],
    mood: "Witty",
    type: "Fact",
    reactionsCount: 250,
    bookmarksCount: 10,
    reflectionsCount: 5,
    sharesCount: 50,
    theme: 0, // Default
    font: "font-mono",
    visibility: "public",
  },
  {
    id: "4",
    content: "The ocean whispers secrets to the shore, tales of ancient currents and forgotten depths.",
    author: "Marina",
    username: "@marina_waves",
    createdAt: "2024-07-07T10:00:00Z",
    readingTime: "1 min",
    views: "950",
    tags: ["ocean", "nature", "mystery"],
    mood: "Dreamy",
    type: "Poem",
    reactionsCount: 90,
    bookmarksCount: 40,
    reflectionsCount: 25,
    sharesCount: 12,
    theme: 2, // Ocean Depths
    font: "font-serif",
    visibility: "public",
  },
  {
    id: "5",
    content: "A single act of kindness can send ripples through the universe, touching lives you may never know.",
    author: "Kindred Spirit",
    username: "@kindred_spirit",
    createdAt: "2024-07-06T22:00:00Z",
    readingTime: "50 sec",
    views: "1.1k",
    tags: ["kindness", "impact", "universe"],
    mood: "Thoughtful",
    type: "Affirmation",
    reactionsCount: 150,
    bookmarksCount: 60,
    reflectionsCount: 35,
    sharesCount: 20,
    theme: 5, // Mint
    font: "font-sans font-bold",
    visibility: "public",
  },
  {
    id: "6",
    content: "The best way to predict the future is to create it.",
    author: "Visionary",
    username: "@visionary_ink",
    createdAt: "2024-07-05T09:00:00Z",
    readingTime: "10 sec",
    views: "3.0k",
    tags: ["quote", "future", "motivation"],
    mood: "Bold",
    type: "Quote",
    reactionsCount: 300,
    bookmarksCount: 100,
    reflectionsCount: 50,
    sharesCount: 80,
    theme: 17, // Golden Hour
    font: "font-sans font-bold",
    visibility: "public",
  },
  {
    id: "7",
    content: "Lost in the labyrinth of thoughts, I found a thread of light leading me back to myself.",
    author: "Inner Explorer",
    username: "@inner_explorer",
    createdAt: "2024-07-04T16:00:00Z",
    readingTime: "1 min 10 sec",
    views: "750",
    tags: ["self-discovery", "mindfulness", "journey"],
    mood: "Reflective",
    type: "Thought",
    reactionsCount: 70,
    bookmarksCount: 25,
    reflectionsCount: 18,
    sharesCount: 8,
    theme: 15, // Slate Mist
    font: "font-serif",
    visibility: "public",
  },
  {
    id: "8",
    content: "The rain taps a rhythm on the windowpane, a lullaby for the weary soul.",
    author: "Rainy Day",
    username: "@rainy_day_poet",
    createdAt: "2024-07-03T11:00:00Z",
    readingTime: "40 sec",
    views: "600",
    tags: ["rain", "comfort", "poetry"],
    mood: "Dreamy",
    type: "Poem",
    reactionsCount: 60,
    bookmarksCount: 20,
    reflectionsCount: 10,
    sharesCount: 5,
    theme: 22, // Aqua Breeze
    font: "font-cursive",
    visibility: "public",
  },
  {
    id: "9",
    content: "If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.",
    author: "Albus Dumbledore",
    username: "@hogwarts_wisdom",
    createdAt: "2024-07-02T19:00:00Z",
    readingTime: "20 sec",
    views: "4.0k",
    tags: ["quote", "wisdom", "character"],
    mood: "Thoughtful",
    type: "Quote",
    reactionsCount: 400,
    bookmarksCount: 150,
    reflectionsCount: 80,
    sharesCount: 120,
    theme: 19, // Charcoal Ink
    font: "font-serif",
    visibility: "public",
  },
  {
    id: "10",
    content: "The sun always shines brightest after the rain. Keep going.",
    author: "Hopeful Heart",
    username: "@hopeful_heart",
    createdAt: "2024-07-01T07:00:00Z",
    readingTime: "15 sec",
    views: "1.8k",
    tags: ["hope", "motivation", "resilience"],
    mood: "Inspiring",
    type: "Affirmation",
    reactionsCount: 180,
    bookmarksCount: 70,
    reflectionsCount: 40,
    sharesCount: 25,
    theme: 1, // Sunset Glow
    font: "font-sans font-bold",
    visibility: "public",
  },
]

// Mock user achievements data
const defaultAchievements = [
  { id: "first_ink", name: "First Ink", description: "Published your first ink", icon: "🖋️", unlocked: false },
  { id: "wordsmith", name: "Wordsmith", description: "Wrote 1000+ words across all inks", icon: "✍️", unlocked: false },
  { id: "tag_master", name: "Tag Master", description: "Used 50+ unique tags", icon: "🏷️", unlocked: false },
  {
    id: "vibe_creator",
    name: "Vibe Creator",
    description: "Published inks with 5+ different themes",
    icon: "🎨",
    unlocked: false,
  },
  {
    id: "daily_streak_3",
    name: "3-Day Streak",
    description: "Published an ink for 3 consecutive days",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Received 100 reactions on your inks",
    icon: "🦋",
    unlocked: false,
  },
  {
    id: "deep_thinker",
    name: "Deep Thinker",
    description: "Published 5 inks with 'Thoughtful' mood",
    icon: "🧠",
    unlocked: false,
  },
  { id: "explorer", name: "Explorer", description: "Used 10 unique tags", icon: "🗺️", unlocked: false },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Published an ink between 12 AM - 5 AM",
    icon: "🦉",
    unlocked: false,
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Published an ink between 5 AM - 8 AM",
    icon: "🌅",
    unlocked: false,
  },
]

// Function to get all inks
export async function getAllInks() {
  // In a real application, this would fetch from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(defaultInks)
    }, 500) // Simulate network delay
  })
}

// Function to get a single ink by ID
export async function getInkById(id: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ink = defaultInks.find((ink) => ink.id === id)
      resolve(ink || null)
    }, 300) // Simulate network delay
  })
}

// Function to publish a new ink
export async function publishNewInk(newInkData: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = (defaultInks.length + 1).toString()
      const now = new Date().toISOString()
      const wordCount = getWordCount(newInkData.content)
      const readingTimeMinutes = Math.ceil(wordCount / 200) // 200 words per minute
      const readingTimeText =
        readingTimeMinutes === 0 ? "less than 1 min" : `${readingTimeMinutes} min${readingTimeMinutes > 1 ? "s" : ""}`

      const ink = {
        id: newId,
        content: newInkData.content,
        author: newInkData.author || "Anonymous",
        username: newInkData.username || "@anonymous",
        createdAt: now,
        readingTime: readingTimeText,
        views: "0", // New inks start with 0 views
        tags: newInkData.tags || [],
        mood: newInkData.mood || "Thoughtful",
        type: newInkData.type || "Thought",
        reactionsCount: 0,
        bookmarksCount: 0,
        reflectionsCount: 0,
        sharesCount: 0,
        theme: newInkData.theme || 0,
        font: newInkData.font || "font-sans",
        visibility: newInkData.visibility || "public",
      }
      defaultInks.unshift(ink) // Add to the beginning of the array for feed refresh
      resolve(ink)
    }, 1000) // Simulate network delay for publishing
  })
}

// Function to update an existing ink
export async function updateInk(id: string, updatedInkData: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = defaultInks.findIndex((ink) => ink.id === id)
      if (index !== -1) {
        const oldInk = defaultInks[index]
        const now = new Date().toISOString()
        const wordCount = getWordCount(updatedInkData.content)
        const readingTimeMinutes = Math.ceil(wordCount / 200)
        const readingTimeText =
          readingTimeMinutes === 0 ? "less than 1 min" : `${readingTimeMinutes} min${readingTimeMinutes > 1 ? "s" : ""}`

        const updatedInk = {
          ...oldInk,
          content: updatedInkData.content,
          tags: updatedInkData.tags,
          visibility: updatedInkData.visibility,
          theme: updatedInkData.theme,
          font: updatedInkData.font,
          mood: updatedInkData.mood,
          editedAt: now, // Set edited timestamp
          readingTime: readingTimeText,
        }
        defaultInks[index] = updatedInk
        resolve(updatedInk)
      } else {
        resolve(null) // Ink not found
      }
    }, 1000) // Simulate network delay for updating
  })
}

// Mock function to get user achievements
export async function getUserAchievements() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Load from localStorage if available, otherwise use default
      const storedAchievements = localStorage.getItem("inkly-user-achievements")
      if (storedAchievements) {
        resolve(JSON.parse(storedAchievements))
      } else {
        resolve(defaultAchievements)
      }
    }, 200)
  })
}

// Mock function to update user achievements
export async function updateUserAchievements(updatedAchievements: any[]) {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("inkly-user-achievements", JSON.stringify(updatedAchievements))
      resolve(true)
    }, 100)
  })
}
