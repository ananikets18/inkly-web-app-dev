import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// Extend the JWT type to include our custom fields
declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    onboardingCompleted?: boolean
    onboardingStep?: string
  }
}

// Extend the Session type to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      onboardingCompleted?: boolean
      onboardingStep?: string
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'consent',
        },
      },
      httpOptions: {
        timeout: 15000, // 15 seconds timeout
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('🔐 SignIn callback triggered')
      console.log('👤 User:', { email: user.email, name: user.name })
      console.log('🔑 Account:', { provider: account?.provider, type: account?.type })
      
      // Check if this is a new user (first time signing in)
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! }
      })
      
      if (!existingUser) {
        console.log('🆕 New user detected - setting up onboarding')
        // This is a new user, they will need onboarding
        return true
      } else {
        console.log('👤 Existing user - checking onboarding status')
        // Update last login time for existing users
        await prisma.user.update({
          where: { email: user.email! },
          data: {
            lastLoginAt: new Date(),
            loginCount: { increment: 1 }
          }
        })
        return true
      }
    },
    
    async jwt({ token, user, account, trigger }) {
      console.log('🔄 JWT callback triggered')
      console.log('👤 User data:', { email: user?.email, id: user?.id })
      console.log('🔑 Account:', { provider: account?.provider, type: account?.type })
      console.log('🎯 Trigger:', trigger)
      
      // If user is available, update token with user data
      if (user) {
        console.log('👤 Updating JWT with user data:', { email: user.email })
        
        // Fetch fresh user data from database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { notifications: true }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.onboardingCompleted = Boolean(dbUser.onboardingCompleted)
          token.onboardingStep = String(dbUser.onboardingStep || 'username')
          
          console.log('✅ JWT updated with DB data:', {
            id: dbUser.id,
            onboardingCompleted: dbUser.onboardingCompleted,
            onboardingStep: dbUser.onboardingStep
          })
        } else {
          console.log('⚠️ User not found in database, using fallback data')
          token.id = user.id
          token.onboardingCompleted = false
          token.onboardingStep = 'username'
          
          // For new users, ensure we have a consistent state
          console.log('🆕 New user detected, setting onboarding status to false')
        }
      }
      
      console.log('🔑 Final token data:', {
        id: token.id,
        email: token.email,
        onboardingCompleted: token.onboardingCompleted,
        onboardingStep: token.onboardingStep
      })
      
      return token
    },
    
    async session({ session, token }) {
      console.log('📋 Session callback triggered')
      
      if (session.user) {
        session.user.id = token.id
        session.user.onboardingCompleted = token.onboardingCompleted
        session.user.onboardingStep = token.onboardingStep
        
        console.log('✅ Session updated with token data:', {
          id: session.user.id,
          onboardingCompleted: session.user.onboardingCompleted,
          onboardingStep: session.user.onboardingStep
        })
      }
      
      return session
    },
    
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect callback - URL:', url, 'Base URL:', baseUrl)
      
      // If the URL is already a full URL, return it
      if (url.startsWith('http')) return url
      
      // If the URL is relative, make it absolute
      if (url.startsWith('/')) return `${baseUrl}${url}`
      
      // Default redirect to home page
      return `${baseUrl}/`
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 