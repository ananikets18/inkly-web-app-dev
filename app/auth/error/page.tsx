"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error")

  const getErrorDetails = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Server Error",
          description: "There is a problem with the server configuration. Please try again later.",
        }
      case "AccessDenied":
        return {
          title: "Access Denied",
          description: "You do not have permission to sign in.",
        }
      case "Verification":
        return {
          title: "Verification Error",
          description: "The verification token has expired or has already been used.",
        }
      case "OAuthSignin":
        return {
          title: "OAuth Error",
          description: "Error occurred during OAuth sign in process.",
        }
      case "OAuthCallback":
        return {
          title: "OAuth Error",
          description: "Error occurred during OAuth callback process.",
        }
      case "OAuthCreateAccount":
        return {
          title: "Account Creation Error",
          description: "Could not create OAuth provider user in the database.",
        }
      case "EmailCreateAccount":
        return {
          title: "Account Creation Error",
          description: "Could not create email provider user in the database.",
        }
      case "Callback":
        return {
          title: "Callback Error",
          description: "Error occurred during the OAuth callback process.",
        }
      case "OAuthAccountNotLinked":
        return {
          title: "Account Not Linked",
          description: "To confirm your identity, sign in with the same account you used originally.",
        }
      case "EmailSignin":
        return {
          title: "Email Error",
          description: "The email could not be sent.",
        }
      case "CredentialsSignin":
        return {
          title: "Invalid Credentials",
          description: "The credentials you provided are not valid.",
        }
      case "SessionRequired":
        return {
          title: "Session Required",
          description: "Please sign in to access this page.",
        }
      default:
        return {
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication.",
        }
    }
  }

  const errorDetails = getErrorDetails(error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950 dark:via-background dark:to-orange-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Error Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4"
              >
                <Logo />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
              >
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </motion.div>
              
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {errorDetails.title}
              </CardTitle>
              
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {errorDetails.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Try Again
                </Button>
                
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full"
                >
                  Go Home
                </Button>
              </div>

              {error && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Error code: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{error}</code>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 