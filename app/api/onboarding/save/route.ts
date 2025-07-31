import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Onboarding save API called')
    
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

    // Get onboarding data and step info from request body
    const { onboardingData, stepId } = await request.json()
    console.log('📝 Step ID:', stepId)
    console.log('📊 Onboarding data:', onboardingData)
    
    // Update user with onboarding data
    const updateData: any = {
      updatedAt: new Date()
    }

    // Update fields based on the step
    if (stepId === 'username') {
      updateData.username = onboardingData.username
      console.log('👤 Setting username:', onboardingData.username)
    } else if (stepId === 'profile') {
      updateData.name = onboardingData.name
      updateData.bio = onboardingData.bio
      updateData.location = onboardingData.location
      updateData.image = onboardingData.avatar
      console.log('👤 Setting profile data:', {
        name: onboardingData.name,
        bio: onboardingData.bio,
        location: onboardingData.location,
        avatar: onboardingData.avatar
      })
      console.log('📊 Full onboarding data for profile step:', onboardingData)
    } else if (stepId === 'privacy') {
      // Save notification settings to database
      console.log('🔔 Saving notification settings:', onboardingData.notifications)
      
      // Get user ID first
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      
      if (user) {
        // Upsert notification settings
        await prisma.notificationSettings.upsert({
          where: { userId: user.id },
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
            userId: user.id,
            pushEnabled: onboardingData.notifications.pushEnabled,
            newFollower: onboardingData.notifications.newFollower,
            newReaction: onboardingData.notifications.newReaction,
            trendingInks: onboardingData.notifications.trendingInks,
            followedUserInks: onboardingData.notifications.followedUserInks,
            permissionStatus: onboardingData.notifications.permissionStatus || 'default',
            lastUpdated: new Date()
          }
        })
        console.log('✅ Notification settings saved to database')
      }
    } else if (stepId === 'community') {
      // Save community data to database
      console.log('👥 Saving community data:', onboardingData.community)
      
      // Get user ID first
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      
      if (user) {
        // Upsert community data
        await prisma.onboardingCommunity.upsert({
          where: { userId: user.id },
          update: {
            followingSuggestions: onboardingData.community.followingSuggestions || ["inkly_official", "aniket_founder"],
            interests: onboardingData.community.interests || [],
            updatedAt: new Date()
          },
          create: {
            userId: user.id,
            followingSuggestions: onboardingData.community.followingSuggestions || ["inkly_official", "aniket_founder"],
            interests: onboardingData.community.interests || []
          }
        })
        console.log('✅ Community data saved to database')
      }
    }

    // Update onboarding step
    updateData.onboardingStep = stepId
    console.log('🔄 Final update data:', updateData)

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData
    })

    console.log('✅ User updated successfully:', updatedUser.id)
    console.log('📊 Updated user data:', {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      bio: updatedUser.bio,
      location: updatedUser.location,
      image: updatedUser.image,
      onboardingStep: updatedUser.onboardingStep
    })

    return NextResponse.json({
      success: true,
      message: 'Onboarding data saved successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        bio: updatedUser.bio,
        location: updatedUser.location,
        onboardingStep: updatedUser.onboardingStep
      }
    })

  } catch (error) {
    console.error('❌ Error saving onboarding data:', error)
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
} 