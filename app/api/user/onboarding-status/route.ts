import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Getting user onboarding status...')
    
    // Get the current session
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('❌ No session found')
      return NextResponse.json(
        { error: 'Unauthorized - User not authenticated' },
        { status: 401 }
      )
    }

    console.log('📧 User email:', session.user.email)

    // Get user from database with notification settings
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        notifications: true
      }
    })

    if (!user) {
      console.log('❌ User not found in database')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted,
      onboardingStep: user.onboardingStep,
      hasNotificationSettings: !!user.notifications
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        bio: user.bio,
        location: user.location,
        image: user.image,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        notificationSettings: user.notifications
      }
    })

  } catch (error) {
    console.error('❌ Error getting onboarding status:', error)
    return NextResponse.json(
      { error: 'Failed to get onboarding status' },
      { status: 500 }
    )
  }
} 