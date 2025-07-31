// Profile API Service Layer
// Handles all profile-related API calls with proper error handling and TypeScript types

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UserProfile {
  id: string
  name: string
  username: string
  bio: string
  location: string
  joinedDate: string
  avatar: string
  avatarColor: string
  pronouns: string
  level: number
  xp: number
  xpToNext: number
  externalLinks: Array<{ url: string; label: string }>
  stats: {
    echoes: number
    followers: number
    following: number
    totalInks: number
  }
}

export interface Achievement {
  id: number
  name: string
  icon: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earned: string
  category: string
  unlocked: boolean
}

export interface Ink {
  id: number
  content: string
  author: string
  avatarColor: string
  views: number
  reactionCount: number
  reflectionCount: number
  bookmarkCount: number
  readingTime: { text: string; minutes: number }
  echoCount: number
  echoUsers: Array<{ name: string; avatar: string }>
  isPinned: boolean
  tags: string[]
  createdAt: string
}

export interface Follower {
  id: string
  name: string
  username: string
  avatar: string
  avatarColor: string
  bio: string
  isFollowing: boolean
  followedAt: string
}

// API Response Types
export interface UserProfileResponse {
  success: boolean
  data: UserProfile
  message?: string
}

export interface FollowResponse {
  success: boolean
  isFollowing: boolean
  updatedStats: {
    followers: number
    following: number
  }
  message?: string
}

export interface AchievementsResponse {
  success: boolean
  data: {
    achievements: Achievement[]
    totalCount: number
  }
  message?: string
}

export interface InksResponse {
  success: boolean
  data: {
    inks: Ink[]
    hasMore: boolean
    totalCount: number
    currentPage: number
  }
  message?: string
}

export interface PinResponse {
  success: boolean
  pinnedInks: number[]
  message: string
}

export interface FollowersResponse {
  success: boolean
  data: {
    users: Follower[]
    hasMore: boolean
    totalCount: number
    currentPage: number
  }
  message?: string
}

export interface UpdateProfileRequest {
  name?: string
  bio?: string
  location?: string
  avatarColor?: string
  pronouns?: string
  externalLinks?: Array<{ url: string; label: string }>
}

// Error Types
export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

// Union types for API responses that can be either success or error
export type UserProfileResult = UserProfileResponse | ApiError
export type FollowResult = FollowResponse | ApiError
export type AchievementsResult = AchievementsResponse | ApiError
export type InksResult = InksResponse | ApiError
export type PinResult = PinResponse | ApiError
export type FollowersResult = FollowersResponse | ApiError

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const API_TIMEOUT = 10000 // 10 seconds

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generic API request function with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Add authentication header if available
      ...(typeof window !== 'undefined' && {
        'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`
      })
    },
    ...options
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
    
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
    throw new Error('Unknown error occurred')
  }
}

/**
 * Handle API errors consistently
 */
function handleApiError(error: any): ApiError {
  console.error('API Error:', error)
  
  if (error.message?.includes('timeout')) {
    return {
      success: false,
      error: {
        code: 'TIMEOUT',
        message: 'Request timed out. Please try again.'
      }
    }
  }
  
  if (error.message?.includes('401')) {
    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Please log in to continue.'
      }
    }
  }
  
  if (error.message?.includes('403')) {
    return {
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You don\'t have permission to perform this action.'
      }
    }
  }
  
  if (error.message?.includes('404')) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.'
      }
    }
  }
  
  return {
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred.'
    }
  }
}

// ============================================================================
// PROFILE API CLASS
// ============================================================================

export class ProfileAPI {
  /**
   * Get user profile data
   */
  static async getUserProfile(userId: string): Promise<UserProfileResult> {
    try {
      return await apiRequest<UserProfileResponse>(`/users/${userId}/profile`)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Follow a user
   */
  static async followUser(userId: string): Promise<FollowResult> {
    try {
      return await apiRequest<FollowResponse>(`/users/${userId}/follow`, {
        method: 'POST'
      })
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(userId: string): Promise<FollowResult> {
    try {
      return await apiRequest<FollowResponse>(`/users/${userId}/follow`, {
        method: 'DELETE'
      })
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get user achievements
   */
  static async getAchievements(userId: string): Promise<AchievementsResult> {
    try {
      return await apiRequest<AchievementsResponse>(`/users/${userId}/achievements`)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get user inks with pagination
   */
  static async getInks(
    userId: string, 
    type: 'created' | 'reflected' | 'bookmarked',
    page: number = 1,
    limit: number = 10
  ): Promise<InksResult> {
    try {
      const params = new URLSearchParams({
        type,
        page: page.toString(),
        limit: limit.toString()
      })
      
      return await apiRequest<InksResponse>(`/users/${userId}/inks?${params}`)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Pin an ink to profile
   */
  static async pinInk(userId: string, inkId: number): Promise<PinResult> {
    try {
      return await apiRequest<PinResponse>(`/users/${userId}/pins`, {
        method: 'POST',
        body: JSON.stringify({ inkId })
      })
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Unpin an ink from profile
   */
  static async unpinInk(userId: string, inkId: number): Promise<PinResult> {
    try {
      return await apiRequest<PinResponse>(`/users/${userId}/pins/${inkId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string, 
    data: UpdateProfileRequest
  ): Promise<UserProfileResult> {
    try {
      return await apiRequest<UserProfileResponse>(`/users/${userId}/profile`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get user followers
   */
  static async getFollowers(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<FollowersResult> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      return await apiRequest<FollowersResponse>(`/users/${userId}/followers?${params}`)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get user following
   */
  static async getFollowing(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<FollowersResult> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      return await apiRequest<FollowersResponse>(`/users/${userId}/following?${params}`)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Check if current user is following another user
   */
  static async checkFollowStatus(userId: string): Promise<{ isFollowing: boolean } | ApiError> {
    try {
      return await apiRequest<{ isFollowing: boolean }>(`/users/${userId}/follow-status`)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get user profile view count (for analytics)
   */
  static async getProfileViews(userId: string): Promise<{ views: number; recentViews: number } | ApiError> {
    try {
      return await apiRequest<{ views: number; recentViews: number }>(`/users/${userId}/profile-views`)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// ============================================================================
// MOCK DATA FOR DEVELOPMENT
// ============================================================================

/**
 * Mock data for development/testing when API is not available
 */
export const mockProfileData: UserProfile = {
  id: "cosmic-ray",
  name: "Cosmic Ray",
  username: "@cosmicray",
  bio: "Collecting stardust and weaving words into constellations. ✨ Believer in the magic of midnight thoughts and morning coffee.",
  location: "San Francisco, CA",
  joinedDate: "March 2023",
  avatar: "from-purple-400 to-pink-400",
  avatarColor: "#6BCB77",
  pronouns: "they/them",
  level: 12,
  xp: 2847,
  xpToNext: 3200,
  externalLinks: [
    { url: "https://twitter.com/cosmicray", label: "Twitter" },
    { url: "https://instagram.com/cosmic.ray.art", label: "Instagram" },
  ],
  stats: {
    echoes: 15420,
    followers: 2847,
    following: 892,
    totalInks: 156,
  },
}

export const mockAchievements: Achievement[] = [
  {
    id: 1,
    name: "Wordsmith",
    icon: "✍️",
    description: "Created 50+ beautiful inks",
    rarity: "rare",
    earned: "2 weeks ago",
    category: "Creation",
    unlocked: true,
  },
  {
    id: 2,
    name: "Echo Master",
    icon: "🔄",
    description: "Received 100+ echoes",
    rarity: "epic",
    earned: "1 month ago",
    category: "Engagement",
    unlocked: true,
  },
  {
    id: 3,
    name: "Reflection Guru",
    icon: "💭",
    description: "Wrote 25+ reflections",
    rarity: "common",
    earned: "3 days ago",
    category: "Reflection",
    unlocked: true,
  },
]

export const mockInks: Ink[] = [
  {
    id: 1,
    content: "The stars don't compete with each other; they simply shine. Maybe that's the secret to finding peace in a world that constantly asks us to compare.",
    author: "Cosmic Ray",
    avatarColor: "#6BCB77",
    views: 4200,
    reactionCount: 89,
    reflectionCount: 23,
    bookmarkCount: 156,
    readingTime: { text: "30 sec", minutes: 0.5 },
    echoCount: 12,
    echoUsers: [
      { name: "Luna", avatar: "from-blue-400 to-cyan-400" },
      { name: "Sol", avatar: "from-yellow-400 to-orange-400" },
    ],
    isPinned: true,
    tags: ["wisdom", "mindfulness", "peace"],
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    content: "Sometimes the most profound insights come from the quietest moments. In the space between thoughts, we find clarity.",
    author: "Cosmic Ray",
    avatarColor: "#6BCB77",
    views: 3200,
    reactionCount: 67,
    reflectionCount: 18,
    bookmarkCount: 98,
    readingTime: { text: "20 sec", minutes: 0.33 },
    echoCount: 8,
    echoUsers: [
      { name: "Zen", avatar: "from-green-400 to-teal-400" },
    ],
    isPinned: true,
    tags: ["insight", "clarity", "meditation"],
    createdAt: "2024-01-14T15:45:00Z",
  },
]

// ============================================================================
// UTILITY FUNCTIONS FOR MOCK DATA
// ============================================================================

/**
 * Generate mock response with delay to simulate API
 */
export function createMockResponse<T>(data: T, delay: number = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

/**
 * Simulate API error
 */
export function createMockError(message: string): ApiError {
  return {
    success: false,
    error: {
      code: 'MOCK_ERROR',
      message
    }
  }
} 