"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Mail, User, Shield, AlertCircle } from "lucide-react"

export default function PermissionsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    setIsLoading(true)
    // Redirect to Google OAuth with explicit consent
    window.location.href = "/api/auth/signin/google?prompt=consent"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Data Access Request
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              We need access to some basic information to create your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Permission Items */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900 dark:text-white">Email Address</span>
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Used for account creation and communication
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900 dark:text-white">Basic Profile</span>
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Name and profile picture for your account
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900 dark:text-white">Account Security</span>
                    <Badge variant="outline" className="text-xs">Standard</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Secure authentication through Google
                  </p>
                </div>
              </div>
            </div>

            {/* What We Don't Access */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">What We Don't Access:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Your Google Drive files</li>
                <li>• Your Gmail messages</li>
                <li>• Your calendar events</li>
                <li>• Your contacts</li>
                <li>• Any other Google services</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isLoading ? "Connecting..." : "Continue with Google"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 