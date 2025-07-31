"use client"

import { useState, useEffect, useCallback } from 'react'
// Authentication removed - using mock authentication
import { 
  ProfileAPI, 
  UserProfile, 
  Achievement, 
  Ink, 
  Follower,
  UserProfileResult,
  AchievementsResult,
  InksResult,
  FollowResult,
  FollowersResult,
  PinResult,
  mockProfileData,
  mockAchievements,
  mockInks,
  createMockResponse
} from '@/lib/api/profile'

interface UseProfileDataOptions {
  userId: string
  enableRealAPI?: boolean
  fallbackToMock?: boolean
}

interface ProfileDataState {
  userData: UserProfile | null
  achievements: Achievement[]
  createdInks: Ink[]
  reflectedInks: Ink[]
  bookmarkedInks: Ink[]
  pinnedInks: Ink[]
  followers: Follower[]
  following: Follower[]
  isFollowing: boolean
  isLoading: boolean
  error: string | null
  hasMore: {
    created: boolean
    reflected: boolean
    bookmarked: boolean
    followers: boolean
    following: boolean
  }
  currentPages: {
    created: number
    reflected: number
    bookmarked: number
    followers: number
    following: number
  }
}

export const useProfileData = ({ 
  userId, 
  enableRealAPI = false, 
  fallbackToMock = true 
}: UseProfileDataOptions) => {
  // Mock user for demo
  const authUser = {
    id: "demo-user-id",
    fullName: "Demo User",
    username: "demo_user",
    email: "demo@example.com"
  }
  
  const [state, setState] = useState<ProfileDataState>({
    userData: null,
    achievements: [],
    createdInks: [],
    reflectedInks: [],
    bookmarkedInks: [],
    pinnedInks: [],
    followers: [],
    following: [],
    isFollowing: false,
    isLoading: true,
    error: null,
    hasMore: {
      created: true,
      reflected: false,
      bookmarked: false,
      followers: true,
      following: true
    },
    currentPages: {
      created: 1,
      reflected: 1,
      bookmarked: 1,
      followers: 1,
      following: 1
    }
  })

  // Transform authenticated user data to profile format
  const createProfileFromAuthUser = useCallback((authUser: any): UserProfile => {
    if (!authUser) return mockProfileData
    
    return {
      id: authUser.id || "current-user-id",
      name: authUser.fullName || "User",
      username: authUser.username ? `@${authUser.username}` : "@user",
      bio: authUser.bio || "Share your thoughts and inspire others.",
      location: authUser.location || "Unknown",
      joinedDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }) : "Recently",
      avatar: authUser.avatarUrl || "",
      avatarColor: authUser.avatarColor || "#6BCB77",
      pronouns: authUser.pronouns || "",
      level: authUser.level || 1,
      xp: authUser.xp || 0,
      xpToNext: authUser.xpToNext || 100,
      externalLinks: authUser.externalLinks || [],
      stats: {
        echoes: authUser.stats?.echoes || 0,
        followers: authUser.stats?.followers || 0,
        following: authUser.stats?.following || 0,
        totalInks: authUser.stats?.totalInks || 0,
      }
    }
  }, [])

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const handleApiError = useCallback((error: any, fallbackData?: any) => {
    console.error('API Error:', error)
    
    if (fallbackToMock && fallbackData) {
      return fallbackData
    }
    
    setState(prev => ({
      ...prev,
      error: error.message || 'An error occurred while fetching data'
    }))
    
    return null
  }, [fallbackToMock])

  const updatePinnedInks = useCallback((inks: Ink[]) => {
    const pinned = inks.filter(ink => ink.isPinned)
    setState(prev => ({ ...prev, pinnedInks: pinned }))
  }, [])

  // ============================================================================
  // API CALLS WITH FALLBACK
  // ============================================================================

  const fetchUserProfile = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      if (enableRealAPI) {
        const response = await ProfileAPI.getUserProfile(userId)
        if (response.success) {
          setState(prev => ({ 
            ...prev, 
            userData: response.data,
            isLoading: false 
          }))
          return response.data
        } else {
          return handleApiError(response, mockProfileData)
        }
      } else {
        // Use real authenticated user data or fallback to mock
        const realProfileData = createProfileFromAuthUser(authUser)
        const profileData = await createMockResponse(realProfileData, 800)
        setState(prev => ({ 
          ...prev, 
          userData: profileData,
          isLoading: false 
        }))
        return profileData
      }
    } catch (error) {
      return handleApiError(error, mockProfileData)
    }
  }, [userId, enableRealAPI, handleApiError, authUser, createProfileFromAuthUser])

  const fetchAchievements = useCallback(async () => {
    try {
      if (enableRealAPI) {
        const response = await ProfileAPI.getAchievements(userId)
        if (response.success) {
          setState(prev => ({ 
            ...prev, 
            achievements: response.data.achievements 
          }))
          return response.data.achievements
        } else {
          return handleApiError(response, mockAchievements)
        }
      } else {
        const mockData = await createMockResponse(mockAchievements, 600)
        setState(prev => ({ 
          ...prev, 
          achievements: mockData 
        }))
        return mockData
      }
    } catch (error) {
      return handleApiError(error, mockAchievements)
    }
  }, [userId, enableRealAPI, handleApiError])

  const fetchInks = useCallback(async (
    type: 'created' | 'reflected' | 'bookmarked',
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      if (enableRealAPI) {
        const response = await ProfileAPI.getInks(userId, type, page, 10)
        if (response.success) {
          const newInks = response.data.inks
          setState(prev => {
            const currentInks = append ? prev[`${type}Inks` as keyof typeof prev] as Ink[] : []
            const updatedInks = append ? [...currentInks, ...newInks] : newInks
            
            return {
              ...prev,
              [`${type}Inks`]: updatedInks,
              hasMore: {
                ...prev.hasMore,
                [type]: response.data.hasMore
              },
              currentPages: {
                ...prev.currentPages,
                [type]: page
              }
            }
          })
          
          // Update pinned inks if this is created inks
          if (type === 'created') {
            updatePinnedInks(append ? [...state.createdInks, ...newInks] : newInks)
          }
          
          return newInks
        } else {
          return handleApiError(response, [])
        }
      } else {
        // Generate mock inks for different types
        const mockData = type === 'created' ? mockInks : 
                        type === 'reflected' ? mockInks.slice(0, 3) : 
                        mockInks.slice(0, 2)
        
        const delayedData = await createMockResponse(mockData, 700)
        
        setState(prev => {
          const currentInks = append ? prev[`${type}Inks` as keyof typeof prev] as Ink[] : []
          const updatedInks = append ? [...currentInks, ...delayedData] : delayedData
          
          return {
            ...prev,
            [`${type}Inks`]: updatedInks,
            hasMore: {
              ...prev.hasMore,
              [type]: page < 3 // Mock pagination
            },
            currentPages: {
              ...prev.currentPages,
              [type]: page
            }
          }
        })
        
        if (type === 'created') {
          updatePinnedInks(append ? [...state.createdInks, ...delayedData] : delayedData)
        }
        
        return delayedData
      }
    } catch (error) {
      return handleApiError(error, [])
    }
  }, [userId, enableRealAPI, handleApiError, state.createdInks, updatePinnedInks])

  const fetchFollowers = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (enableRealAPI) {
        const response = await ProfileAPI.getFollowers(userId, page, 20)
        if (response.success) {
          const newFollowers = response.data.users
          setState(prev => {
            const currentFollowers = append ? prev.followers : []
            const updatedFollowers = append ? [...currentFollowers, ...newFollowers] : newFollowers
            
            return {
              ...prev,
              followers: updatedFollowers,
              hasMore: {
                ...prev.hasMore,
                followers: response.data.hasMore
              },
              currentPages: {
                ...prev.currentPages,
                followers: page
              }
            }
          })
          return newFollowers
        } else {
          return handleApiError(response, [])
        }
      } else {
        // Mock followers data
        const mockFollowers: Follower[] = [
          {
            id: 'user1',
            name: 'Luna Moon',
            username: '@lunamoon',
            avatar: 'from-blue-400 to-cyan-400',
            avatarColor: '#3B82F6',
            bio: 'Night owl and dreamer',
            isFollowing: true,
            followedAt: '2024-01-10T12:00:00Z'
          },
          {
            id: 'user2',
            name: 'Sol Bright',
            username: '@solbright',
            avatar: 'from-yellow-400 to-orange-400',
            avatarColor: '#F59E0B',
            bio: 'Bringing light to dark places',
            isFollowing: false,
            followedAt: '2024-01-08T15:30:00Z'
          }
        ]
        
        const delayedData = await createMockResponse(mockFollowers, 500)
        
        setState(prev => {
          const currentFollowers = append ? prev.followers : []
          const updatedFollowers = append ? [...currentFollowers, ...delayedData] : delayedData
          
          return {
            ...prev,
            followers: updatedFollowers,
            hasMore: {
              ...prev.hasMore,
              followers: page < 2
            },
            currentPages: {
              ...prev.currentPages,
              followers: page
            }
          }
        })
        
        return delayedData
      }
    } catch (error) {
      return handleApiError(error, [])
    }
  }, [userId, enableRealAPI, handleApiError])

  const fetchFollowing = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (enableRealAPI) {
        const response = await ProfileAPI.getFollowing(userId, page, 20)
        if (response.success) {
          const newFollowing = response.data.users
          setState(prev => {
            const currentFollowing = append ? prev.following : []
            const updatedFollowing = append ? [...currentFollowing, ...newFollowing] : newFollowing
            
            return {
              ...prev,
              following: updatedFollowing,
              hasMore: {
                ...prev.hasMore,
                following: response.data.hasMore
              },
              currentPages: {
                ...prev.currentPages,
                following: page
              }
            }
          })
          return newFollowing
        } else {
          return handleApiError(response, [])
        }
      } else {
        // Mock following data
        const mockFollowing: Follower[] = [
          {
            id: 'user3',
            name: 'Zen Master',
            username: '@zenmaster',
            avatar: 'from-green-400 to-teal-400',
            avatarColor: '#10B981',
            bio: 'Finding peace in chaos',
            isFollowing: true,
            followedAt: '2024-01-12T09:15:00Z'
          }
        ]
        
        const delayedData = await createMockResponse(mockFollowing, 500)
        
        setState(prev => {
          const currentFollowing = append ? prev.following : []
          const updatedFollowing = append ? [...currentFollowing, ...delayedData] : currentFollowing
          
          return {
            ...prev,
            following: updatedFollowing,
            hasMore: {
              ...prev.hasMore,
              following: page < 2
            },
            currentPages: {
              ...prev.currentPages,
              following: page
            }
          }
        })
        
        return delayedData
      }
    } catch (error) {
      return handleApiError(error, [])
    }
  }, [userId, enableRealAPI, handleApiError])

  const checkFollowStatus = useCallback(async () => {
    try {
      if (enableRealAPI) {
        const response = await ProfileAPI.checkFollowStatus(userId)
        if (!('error' in response)) {
          setState(prev => ({ ...prev, isFollowing: response.isFollowing }))
          return response.isFollowing
        } else {
          return handleApiError(response, false)
        }
      } else {
        const mockStatus = await createMockResponse(false, 300)
        setState(prev => ({ ...prev, isFollowing: mockStatus }))
        return mockStatus
      }
    } catch (error) {
      return handleApiError(error, false)
    }
  }, [userId, enableRealAPI, handleApiError])

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  const handleFollow = useCallback(async () => {
    try {
      if (enableRealAPI) {
        const response = state.isFollowing 
          ? await ProfileAPI.unfollowUser(userId)
          : await ProfileAPI.followUser(userId)
        
        if (response.success) {
          setState(prev => ({ 
            ...prev, 
            isFollowing: response.isFollowing,
            userData: prev.userData ? {
              ...prev.userData,
              stats: {
                ...prev.userData.stats,
                ...response.updatedStats
              }
            } : null
          }))
          return response
        } else {
          return handleApiError(response)
        }
      } else {
        // Mock follow/unfollow
        const newStatus = !state.isFollowing
        const mockResponse = await createMockResponse({
          success: true,
          isFollowing: newStatus,
          updatedStats: {
            followers: newStatus ? state.userData?.stats.followers! + 1 : state.userData?.stats.followers! - 1,
            following: state.userData?.stats.following || 0
          }
        }, 800)
        
        setState(prev => ({ 
          ...prev, 
          isFollowing: newStatus,
          userData: prev.userData ? {
            ...prev.userData,
            stats: {
              ...prev.userData.stats,
              ...mockResponse.updatedStats
            }
          } : null
        }))
        
        return mockResponse
      }
    } catch (error) {
      return handleApiError(error)
    }
  }, [userId, enableRealAPI, state.isFollowing, state.userData?.stats, handleApiError])

  const handlePinInk = useCallback(async (inkId: number) => {
    try {
      if (enableRealAPI) {
        const response = await ProfileAPI.pinInk(userId, inkId)
        if (response.success) {
          setState(prev => ({
            ...prev,
            createdInks: prev.createdInks.map(ink => 
              ink.id === inkId ? { ...ink, isPinned: true } : ink
            )
          }))
          updatePinnedInks(state.createdInks.map(ink => 
            ink.id === inkId ? { ...ink, isPinned: true } : ink
          ))
          return response
        } else {
          return handleApiError(response)
        }
      } else {
        // Mock pin action
        const mockResponse = await createMockResponse({
          success: true,
          pinnedInks: [...state.pinnedInks.map(ink => ink.id), inkId],
          message: 'Ink pinned successfully'
        }, 500)
        
        setState(prev => ({
          ...prev,
          createdInks: prev.createdInks.map(ink => 
            ink.id === inkId ? { ...ink, isPinned: true } : ink
          )
        }))
        
        updatePinnedInks(state.createdInks.map(ink => 
          ink.id === inkId ? { ...ink, isPinned: true } : ink
        ))
        
        return mockResponse
      }
    } catch (error) {
      return handleApiError(error)
    }
  }, [userId, enableRealAPI, state.createdInks, state.pinnedInks, updatePinnedInks, handleApiError])

  const handleUnpinInk = useCallback(async (inkId: number) => {
    try {
      if (enableRealAPI) {
        const response = await ProfileAPI.unpinInk(userId, inkId)
        if (response.success) {
          setState(prev => ({
            ...prev,
            createdInks: prev.createdInks.map(ink => 
              ink.id === inkId ? { ...ink, isPinned: false } : ink
            )
          }))
          updatePinnedInks(state.createdInks.map(ink => 
            ink.id === inkId ? { ...ink, isPinned: false } : ink
          ))
          return response
        } else {
          return handleApiError(response)
        }
      } else {
        // Mock unpin action
        const mockResponse = await createMockResponse({
          success: true,
          pinnedInks: state.pinnedInks.filter(ink => ink.id !== inkId).map(ink => ink.id),
          message: 'Ink unpinned successfully'
        }, 500)
        
        setState(prev => ({
          ...prev,
          createdInks: prev.createdInks.map(ink => 
            ink.id === inkId ? { ...ink, isPinned: false } : ink
          )
        }))
        
        updatePinnedInks(state.createdInks.map(ink => 
          ink.id === inkId ? { ...ink, isPinned: false } : ink
        ))
        
        return mockResponse
      }
    } catch (error) {
      return handleApiError(error)
    }
  }, [userId, enableRealAPI, state.createdInks, state.pinnedInks, updatePinnedInks, handleApiError])

  const handleLoadMore = useCallback(async (type: string) => {
    const nextPage = state.currentPages[type as keyof typeof state.currentPages] + 1
    
    switch (type) {
      case 'created':
        return await fetchInks('created', nextPage, true)
      case 'reflected':
        return await fetchInks('reflected', nextPage, true)
      case 'bookmarked':
        return await fetchInks('bookmarked', nextPage, true)
      case 'followers':
        return await fetchFollowers(nextPage, true)
      case 'following':
        return await fetchFollowing(nextPage, true)
      default:
        return []
    }
  }, [state.currentPages, fetchInks, fetchFollowers, fetchFollowing])

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    const initializeProfile = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        // Fetch all data in parallel
        await Promise.all([
          fetchUserProfile(),
          fetchAchievements(),
          fetchInks('created', 1, false),
          fetchInks('reflected', 1, false),
          fetchInks('bookmarked', 1, false),
          fetchFollowers(1, false),
          fetchFollowing(1, false),
          checkFollowStatus()
        ])
        
        setState(prev => ({ ...prev, isLoading: false }))
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to load profile data' 
        }))
      }
    }

    if (userId) {
      initializeProfile()
    }
  }, [userId, fetchUserProfile, fetchAchievements, fetchInks, fetchFollowers, fetchFollowing, checkFollowStatus])

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    // State
    ...state,
    
    // Actions
    handleFollow,
    handlePinInk,
    handleUnpinInk,
    handleLoadMore,
    
    // Refresh functions
    refreshProfile: fetchUserProfile,
    refreshAchievements: fetchAchievements,
    refreshInks: fetchInks,
    refreshFollowers: fetchFollowers,
    refreshFollowing: fetchFollowing,
    
    // Utility
    clearError: () => setState(prev => ({ ...prev, error: null }))
  }
} 