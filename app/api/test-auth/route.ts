import { NextResponse } from "next/server"

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const nextAuthSecret = process.env.NEXTAUTH_SECRET
  const nextAuthUrl = process.env.NEXTAUTH_URL

  return NextResponse.json({
    googleClientId: googleClientId ? "✅ Set" : "❌ Missing",
    googleClientSecret: googleClientSecret ? "✅ Set" : "❌ Missing",
    nextAuthSecret: nextAuthSecret ? "✅ Set" : "❌ Missing",
    nextAuthUrl: nextAuthUrl || "❌ Missing",
  })
} 