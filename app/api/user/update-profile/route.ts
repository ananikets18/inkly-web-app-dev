import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Updating user profile...')
    
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

    // Get profile data from request body
    const { name, bio, location, avatar } = await request.json()
    console.log('📊 Profile data to update:', { name, bio, location, avatar })

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || undefined,
        bio: bio || undefined,
        location: location || undefined,
        image: avatar || undefined,
        updatedAt: new Date()
      }
    })

    console.log('✅ Profile updated successfully:', {
      id: updatedUser.id,
      name: updatedUser.name,
      bio: updatedUser.bio,
      location: updatedUser.location,
      image: updatedUser.image
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        bio: updatedUser.bio,
        location: updatedUser.location,
        image: updatedUser.image
      }
    })

  } catch (error) {
    console.error('❌ Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
} 