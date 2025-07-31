import { useState, useEffect } from 'react'

export interface TopicUniverse {
  id: string
  name: string
  emoji: string
  gradient: string
  count: number
  description: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface TopicContent {
  id: string
  topicId: string
  inks: TopicInk[]
  totalInks: number
  totalReactions: number
  totalViews: number
  trendingInks: TopicInk[]
  featuredInks: TopicInk[]
  lastUpdated: string
}

export interface TopicInk {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    avatarColor: string
  }
  tags: string[]
  reactions: number
  views: number
  createdAt: string
  readingTime: string
  isFeatured: boolean
  isTrending: boolean
}

export interface TopicAnalytics {
  topicId: string
  clicks: number
  views: number
  engagement: number
  growthRate: number
  popularTags: string[]
  userDemographics: {
    ageGroups: Record<string, number>
    interests: string[]
  }
}

// Mock data for fallback when API is unavailable
const mockTopics: TopicUniverse[] = [
  {
    id: "philosophy",
    name: "Philosophy",
    emoji: "🧘",
    gradient: "from-purple-500 to-indigo-600",
    count: 2847,
    description: "Deep thoughts and existential musings",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "healing",
    name: "Healing",
    emoji: "🧠",
    gradient: "from-emerald-500 to-teal-600",
    count: 3456,
    description: "Mental health and emotional wellness",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "feminism",
    name: "Feminism",
    emoji: "✊",
    gradient: "from-pink-500 to-rose-600",
    count: 1923,
    description: "Empowerment and equality voices",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "creativity",
    name: "Creativity",
    emoji: "🧪",
    gradient: "from-orange-500 to-red-600",
    count: 2134,
    description: "Artistic expression and innovation",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "spirituality",
    name: "Spirituality",
    emoji: "🔮",
    gradient: "from-violet-500 to-purple-600",
    count: 1678,
    description: "Soul searching and inner wisdom",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "love",
    name: "Love",
    emoji: "💕",
    gradient: "from-rose-500 to-pink-600",
    count: 4567,
    description: "Romance, relationships, and connection",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "nature",
    name: "Nature",
    emoji: "🌿",
    gradient: "from-green-500 to-emerald-600",
    count: 1845,
    description: "Earth wisdom and natural beauty",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    emoji: "🕯️",
    gradient: "from-amber-500 to-orange-600",
    count: 2789,
    description: "Present moment awareness",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "dreams",
    name: "Dreams",
    emoji: "🌙",
    gradient: "from-blue-500 to-indigo-600",
    count: 1234,
    description: "Aspirations and night visions",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "resilience",
    name: "Resilience",
    emoji: "💪",
    gradient: "from-cyan-500 to-blue-600",
    count: 2456,
    description: "Strength through adversity",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

// Mock topic content for fallback
const mockTopicContent: TopicContent = {
  id: "mock-content-123",
  topicId: "philosophy",
  inks: [
    {
      id: "ink-1",
      content: "The unexamined life is not worth living.",
      author: {
        id: "user-1",
        name: "Socrates",
        avatar: "/avatars/socrates.jpg",
        avatarColor: "from-purple-500 to-pink-500",
      },
      tags: ["#wisdom", "#philosophy"],
      reactions: 847,
      views: 2340,
      createdAt: "2024-01-15T10:30:00Z",
      readingTime: "30s",
      isFeatured: true,
      isTrending: false,
    },
    {
      id: "ink-2",
      content: "I think, therefore I am.",
      author: {
        id: "user-2",
        name: "Descartes",
        avatar: "/avatars/descartes.jpg",
        avatarColor: "from-blue-500 to-cyan-500",
      },
      tags: ["#philosophy", "#existence"],
      reactions: 623,
      views: 1890,
      createdAt: "2024-01-14T15:20:00Z",
      readingTime: "25s",
      isFeatured: false,
      isTrending: true,
    },
  ],
  totalInks: 2847,
  totalReactions: 45678,
  totalViews: 123456,
  trendingInks: [],
  featuredInks: [],
  lastUpdated: "2024-01-15T12:00:00Z",
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.inkly.com'

export class TopicsAPI {
  private static async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    try {
      const token = localStorage.getItem('inkly-auth-token')
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.warn(`API call failed for ${endpoint}, using mock data:`, error)
      throw error
    }
  }

  /**
   * Fetch all available topics with their metadata
   */
  static async getTopics(): Promise<TopicUniverse[]> {
    try {
      const data = await this.fetchWithAuth('/topics')
      return data.topics.map((topic: any) => ({
        id: topic.id,
        name: topic.name,
        emoji: topic.emoji,
        gradient: topic.gradient,
        count: topic.inkCount,
        description: topic.description,
        isActive: topic.isActive,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,
      }))
    } catch (error) {
      console.warn('Using mock topics data due to API unavailability')
      return mockTopics
    }
  }

  /**
   * Get topic-specific content including inks, analytics, and metadata
   */
  static async getTopicContent(topicId: string, options: {
    page?: number
    limit?: number
    sortBy?: 'recent' | 'popular' | 'trending'
    includeAnalytics?: boolean
  } = {}): Promise<TopicContent> {
    try {
      const { page = 1, limit = 20, sortBy = 'recent', includeAnalytics = false } = options
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        includeAnalytics: includeAnalytics.toString(),
      })

      const data = await this.fetchWithAuth(`/topics/${topicId}/content?${queryParams}`)
      
      return {
        id: data.id,
        topicId: data.topicId,
        inks: data.inks.map((ink: any) => ({
          id: ink.id,
          content: ink.content,
          author: {
            id: ink.author.id,
            name: ink.author.name,
            avatar: ink.author.avatar,
            avatarColor: ink.author.avatarColor,
          },
          tags: ink.tags,
          reactions: ink.reactions,
          views: ink.views,
          createdAt: ink.createdAt,
          readingTime: ink.readingTime,
          isFeatured: ink.isFeatured,
          isTrending: ink.isTrending,
        })),
        totalInks: data.totalInks,
        totalReactions: data.totalReactions,
        totalViews: data.totalViews,
        trendingInks: data.trendingInks || [],
        featuredInks: data.featuredInks || [],
        lastUpdated: data.lastUpdated,
      }
    } catch (error) {
      console.warn('Using mock topic content due to API unavailability')
      // Return mock content with the requested topic ID
      return {
        ...mockTopicContent,
        topicId,
        inks: mockTopicContent.inks.map(ink => ({
          ...ink,
          id: `${topicId}-${ink.id}`,
        })),
      }
    }
  }

  /**
   * Track topic click for analytics
   */
  static async trackTopicClick(topicId: string, userId: string, metadata?: {
    source?: string
    timestamp?: string
    userAgent?: string
  }): Promise<void> {
    try {
      await this.fetchWithAuth('/topics/analytics/clicks', {
        method: 'POST',
        body: JSON.stringify({
          topicId,
          userId,
          metadata: {
            source: metadata?.source || 'explore_page',
            timestamp: metadata?.timestamp || new Date().toISOString(),
            userAgent: metadata?.userAgent || navigator.userAgent,
          },
        }),
      })
    } catch (error) {
      console.warn('Analytics tracking failed, continuing without tracking:', error)
      // Don't throw error for analytics tracking failures
    }
  }

  /**
   * Get topic analytics and insights
   */
  static async getTopicAnalytics(topicId: string, timeRange: string = '30d'): Promise<TopicAnalytics> {
    try {
      const data = await this.fetchWithAuth(`/topics/${topicId}/analytics?timeRange=${timeRange}`)
      
      return {
        topicId: data.topicId,
        clicks: data.clicks,
        views: data.views,
        engagement: data.engagement,
        growthRate: data.growthRate,
        popularTags: data.popularTags,
        userDemographics: {
          ageGroups: data.userDemographics.ageGroups,
          interests: data.userDemographics.interests,
        },
      }
    } catch (error) {
      console.warn('Using mock analytics due to API unavailability')
      return {
        topicId,
        clicks: 1234,
        views: 5678,
        engagement: 85,
        growthRate: 12.5,
        popularTags: ["#wisdom", "#philosophy", "#life"],
        userDemographics: {
          ageGroups: { "18-25": 30, "26-35": 45, "36-45": 25 },
          interests: ["philosophy", "self-improvement", "mindfulness"],
        },
      }
    }
  }

  /**
   * Get trending topics based on current engagement
   */
  static async getTrendingTopics(limit: number = 10): Promise<TopicUniverse[]> {
    try {
      const data = await this.fetchWithAuth(`/topics/trending?limit=${limit}`)
      return data.topics.map((topic: any) => ({
        id: topic.id,
        name: topic.name,
        emoji: topic.emoji,
        gradient: topic.gradient,
        count: topic.inkCount,
        description: topic.description,
      }))
    } catch (error) {
      console.warn('Using mock trending topics due to API unavailability')
      return mockTopics.slice(0, limit)
    }
  }

  /**
   * Get personalized topic recommendations for a user
   */
  static async getRecommendedTopics(userId: string, limit: number = 10): Promise<TopicUniverse[]> {
    try {
      const data = await this.fetchWithAuth(`/topics/recommendations?userId=${userId}&limit=${limit}`)
      return data.topics.map((topic: any) => ({
        id: topic.id,
        name: topic.name,
        emoji: topic.emoji,
        gradient: topic.gradient,
        count: topic.inkCount,
        description: topic.description,
      }))
    } catch (error) {
      console.warn('Using mock recommended topics due to API unavailability')
      return mockTopics.slice(0, limit)
    }
  }
}

/**
 * React hook for fetching topics with loading and error states
 */
export function useTopics() {
  const [data, setData] = useState<TopicUniverse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true)
        const topics = await TopicsAPI.getTopics()
        setData(topics)
        setError(null)
      } catch (err) {
        // Even if API fails, we should have mock data
        console.error('Failed to fetch topics:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch topics')
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  return { data, loading, error, refetch: () => setData([]) }
}

/**
 * React hook for fetching topic content
 */
export function useTopicContent(topicId: string, options: {
  page?: number
  limit?: number
  sortBy?: 'recent' | 'popular' | 'trending'
  includeAnalytics?: boolean
} = {}) {
  const [data, setData] = useState<TopicContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      if (!topicId) return
      
      try {
        setLoading(true)
        const content = await TopicsAPI.getTopicContent(topicId, options)
        setData(content)
        setError(null)
      } catch (err) {
        // Even if API fails, we should have mock data
        console.error('Failed to fetch topic content:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch topic content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [topicId, JSON.stringify(options)])

  return { data, loading, error, refetch: () => setData(null) }
}

/**
 * React hook for fetching trending topics
 */
export function useTrendingTopics(limit: number = 10) {
  const [data, setData] = useState<TopicUniverse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        setLoading(true)
        const topics = await TopicsAPI.getTrendingTopics(limit)
        setData(topics)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch trending topics:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch trending topics')
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingTopics()
  }, [limit])

  return { data, loading, error, refetch: () => setData([]) }
}

// Example backend API response structures:

/*
GET /api/topics
Response:
{
  "topics": [
    {
      "id": "philosophy",
      "name": "Philosophy",
      "emoji": "🧘",
      "gradient": "from-purple-500 to-indigo-600",
      "inkCount": 2847,
      "description": "Deep thoughts and existential musings",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ]
}

GET /api/topics/{topicId}/content?page=1&limit=20&sortBy=recent
Response:
{
  "id": "topic-content-123",
  "topicId": "philosophy",
  "inks": [
    {
      "id": "ink-123",
      "content": "The unexamined life is not worth living.",
      "author": {
        "id": "user-123",
        "name": "Socrates",
        "avatar": "/avatars/socrates.jpg",
        "avatarColor": "from-purple-500 to-pink-500"
      },
      "tags": ["#wisdom", "#philosophy"],
      "reactions": 847,
      "views": 2340,
      "createdAt": "2024-01-15T10:30:00Z",
      "readingTime": "30s",
      "isFeatured": true,
      "isTrending": false
    }
  ],
  "totalInks": 2847,
  "totalReactions": 45678,
  "totalViews": 123456,
  "trendingInks": [...],
  "featuredInks": [...],
  "lastUpdated": "2024-01-15T12:00:00Z"
}

POST /api/topics/analytics/clicks
Request:
{
  "topicId": "philosophy",
  "userId": "user-123",
  "metadata": {
    "source": "explore_page",
    "timestamp": "2024-01-15T12:00:00Z",
    "userAgent": "Mozilla/5.0..."
  }
}
*/ 