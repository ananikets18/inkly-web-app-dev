import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Getting user notification settings...')
    
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

    // Get user and their notification settings
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
      hasNotificationSettings: !!user.notifications
    })

    return NextResponse.json({
      success: true,
      notificationSettings: user.notifications || {
        pushEnabled: false,
        newFollower: true,
        newReaction: true,
        trendingInks: true,
        followedUserInks: true,
        permissionStatus: 'default',
        lastUpdated: new Date()
      }
    })

  } catch (error) {
    console.error('❌ Error getting notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to get notification settings' },
      { status: 500 }
    )
  }
} 