import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Onboarding complete API called')
    
    // Get the current session
    const session = await getServerSession(authOptions)
    console.log('📋 Session:', session ? 'Found' : 'Not found')
    console.log('📧 User email:', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('❌ No session or email found')
      return NextResponse.json(
        { error: 'Unauthorized - User not authenticated' },
        { status: 401 }
      )
    }

    // Get onboarding data from request body
    const onboardingData = await request.json()
    console.log('📊 Complete onboarding data:', onboardingData)
    
    // Update user with onboarding data
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username: onboardingData.username,
        name: onboardingData.name,
        bio: onboardingData.bio,
        location: onboardingData.location,
        image: onboardingData.avatar, // Use 'image' field for avatar
        onboardingCompleted: true,
        onboardingStep: 'complete',
        updatedAt: new Date()
      }
    })

    // Save notification settings to database if they exist
    if (onboardingData.notifications) {
      console.log('🔔 Saving final notification settings:', onboardingData.notifications)
      
      await prisma.notificationSettings.upsert({
        where: { userId: updatedUser.id },
        update: {
          pushEnabled: onboardingData.notifications.pushEnabled,
          newFollower: onboardingData.notifications.newFollower,
          newReaction: onboardingData.notifications.newReaction,
          trendingInks: onboardingData.notifications.trendingInks,
          followedUserInks: onboardingData.notifications.followedUserInks,
          permissionStatus: onboardingData.notifications.permissionStatus || 'default',
          lastUpdated: new Date()
        },
        create: {
          userId: updatedUser.id,
          pushEnabled: onboardingData.notifications.pushEnabled,
          newFollower: onboardingData.notifications.newFollower,
          newReaction: onboardingData.notifications.newReaction,
          trendingInks: onboardingData.notifications.trendingInks,
          followedUserInks: onboardingData.notifications.followedUserInks,
          permissionStatus: onboardingData.notifications.permissionStatus || 'default',
          lastUpdated: new Date()
        }
      })
      console.log('✅ Final notification settings saved to database')
    }

    // Save community data to database if it exists
    if (onboardingData.community) {
      console.log('👥 Saving final community data:', onboardingData.community)
      
      await prisma.onboardingCommunity.upsert({
        where: { userId: updatedUser.id },
        update: {
          followingSuggestions: onboardingData.community.followingSuggestions || ["inkly_official", "aniket_founder"],
          interests: onboardingData.community.interests || [],
          updatedAt: new Date()
        },
        create: {
          userId: updatedUser.id,
          followingSuggestions: onboardingData.community.followingSuggestions || ["inkly_official", "aniket_founder"],
          interests: onboardingData.community.interests || []
        }
      })
      console.log('✅ Final community data saved to database')
    }

    console.log('✅ Onboarding completed successfully for user:', updatedUser.id)

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        bio: updatedUser.bio,
        location: updatedUser.location,
        onboardingCompleted: updatedUser.onboardingCompleted
      }
    })

  } catch (error) {
    console.error('❌ Error completing onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
} 