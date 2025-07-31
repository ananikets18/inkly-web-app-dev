import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Resetting user onboarding...')
    
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

    // Reset onboarding status
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        onboardingCompleted: false,
        onboardingStep: 'username',
        updatedAt: new Date()
      }
    })

    console.log('✅ Onboarding reset successfully:', {
      id: updatedUser.id,
      onboardingCompleted: updatedUser.onboardingCompleted,
      onboardingStep: updatedUser.onboardingStep
    })

    return NextResponse.json({
      success: true,
      message: 'Onboarding reset successfully',
      user: {
        id: updatedUser.id,
        onboardingCompleted: updatedUser.onboardingCompleted,
        onboardingStep: updatedUser.onboardingStep
      }
    })

  } catch (error) {
    console.error('❌ Error resetting onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to reset onboarding' },
      { status: 500 }
    )
  }
} 