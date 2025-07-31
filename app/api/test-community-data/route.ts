import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test community data API called')
    
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

    // Get user and their community data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        onboardingCommunity: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('✅ User found:', user.id)
    console.log('👥 Community data:', user.onboardingCommunity)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        onboardingStep: user.onboardingStep,
        onboardingCompleted: user.onboardingCompleted
      },
      communityData: user.onboardingCommunity
    })

  } catch (error) {
    console.error('❌ Error testing community data:', error)
    return NextResponse.json(
      { error: 'Failed to test community data' },
      { status: 500 }
    )
  }
} 