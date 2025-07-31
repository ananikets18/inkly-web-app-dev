import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing session...')
    
    const session = await getServerSession(authOptions)
    
    console.log('📋 Session found:', !!session)
    console.log('📧 User email:', session?.user?.email)
    console.log('🆔 User ID:', session?.user?.id)
    
    return NextResponse.json({
      success: true,
      session: {
        exists: !!session,
        email: session?.user?.email,
        id: session?.user?.id,
        name: session?.user?.name
      }
    })
  } catch (error) {
    console.error('❌ Session test error:', error)
    return NextResponse.json(
      { error: 'Session test failed' },
      { status: 500 }
    )
  }
} 