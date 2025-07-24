"use client"

import { useRef, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { UserPlus, Mail, Lock, User, Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export type JoinModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type JoinFormValues = {
  name: string
  email: string
  password: string
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: "At least 8 characters" }
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: "Include uppercase & lowercase" }
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: "Include at least one number" }
  }
  return { isValid: true, message: "Strong password!" }
}

export default function JoinModal({ open, onOpenChange }: JoinModalProps) {
  const form = useForm<JoinFormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; message: string } | null>(null)
  const [passwordValidation, setPasswordValidation] = useState<{ isValid: boolean; message: string } | null>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const watchedEmail = form.watch("email")
  const watchedPassword = form.watch("password")
  const watchedName = form.watch("name")

  // Live email validation
  useEffect(() => {
    if (watchedEmail) {
      const isValid = validateEmail(watchedEmail)
      setEmailValidation({
        isValid,
        message: isValid ? "Valid email address" : "Please enter a valid email",
      })
    } else {
      setEmailValidation(null)
    }
  }, [watchedEmail])

  // Live password validation
  useEffect(() => {
    if (watchedPassword) {
      setPasswordValidation(validatePassword(watchedPassword))
    } else {
      setPasswordValidation(null)
    }
  }, [watchedPassword])

  useEffect(() => {
    if (open && firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const onSubmit = async (data: JoinFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Welcome to Inkly! 🎉",
        description: `Hi ${data.name}, your account has been created successfully.`,
      })

      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google") => {
    setIsLoading(true)

    try {
      // Simulate social auth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Welcome to Inkly! 🎉",
        description: `Successfully signed up with ${provider === "google" ? "Google" : provider}.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = watchedName.length >= 2 && emailValidation?.isValid && passwordValidation?.isValid

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[420px] max-h-[75vh] bg-background border border-border/50 shadow-2xl rounded-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-6 overflow-y-auto max-h-[75vh] custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(139, 92, 246, 0.3) transparent",
          }}
        >
          {/* Header */}
          <DialogHeader className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3"
            >
              <UserPlus className="w-6 h-6 text-white" />
            </motion.div>

            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join Inkly
            </DialogTitle>

            <DialogDescription className="text-base text-muted-foreground mt-1">
              Create your space for thoughts and creativity
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <FormField
                name="name"
                control={form.control}
                rules={{
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          ref={(el) => {
                            field.ref(el)
                            firstInputRef.current = el
                          }}
                          placeholder="Enter your full name"
                          className={cn(
                            "pl-9 h-10 bg-muted/30 border-border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200",
                            watchedName.length >= 2 &&
                              "border-green-500 focus:border-green-500 focus:ring-green-500/20",
                          )}
                          autoComplete="name"
                          disabled={isLoading}
                        />
                        <AnimatePresence>
                          {watchedName.length >= 2 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                rules={{
                  required: "Email is required",
                  validate: (value) => validateEmail(value) || "Please enter a valid email address",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className={cn(
                            "pl-9 h-10 bg-muted/30 border-border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200",
                            emailValidation?.isValid &&
                              "border-green-500 focus:border-green-500 focus:ring-green-500/20",
                            emailValidation &&
                              !emailValidation.isValid &&
                              watchedEmail &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                          )}
                          autoComplete="email"
                          disabled={isLoading}
                        />
                        <AnimatePresence>
                          {emailValidation && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {emailValidation.isValid ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </FormControl>
                    <AnimatePresence>
                      {emailValidation && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={cn("text-xs mt-1", emailValidation.isValid ? "text-green-600" : "text-red-600")}
                        >
                          {emailValidation.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                rules={{
                  required: "Password is required",
                  validate: (value) => validatePassword(value).isValid || validatePassword(value).message,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className={cn(
                            "pl-9 pr-16 h-10 bg-muted/30 border-border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200",
                            passwordValidation?.isValid &&
                              "border-green-500 focus:border-green-500 focus:ring-green-500/20",
                            passwordValidation &&
                              !passwordValidation.isValid &&
                              watchedPassword &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                          )}
                          autoComplete="new-password"
                          disabled={isLoading}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <AnimatePresence>
                            {passwordValidation && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                {passwordValidation.isValid ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </FormControl>
                    <AnimatePresence>
                      {passwordValidation && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={cn("text-xs mt-1", passwordValidation.isValid ? "text-green-600" : "text-red-600")}
                        >
                          {passwordValidation.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: isFormValid && !isLoading ? 1.02 : 1 }}
                whileTap={{ scale: isFormValid && !isLoading ? 0.98 : 1 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={cn(
                    "w-full h-10 text-sm font-semibold rounded-xl transition-all duration-300",
                    "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
                    "text-white shadow-lg shadow-purple-500/25",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                    isFormValid && !isLoading && "hover:shadow-xl hover:shadow-purple-500/30",
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    "Join Inkly"
                  )}
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Social Login */}
              <motion.div whileHover={{ scale: !isLoading ? 1.02 : 1 }} whileTap={{ scale: !isLoading ? 0.98 : 1 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  className="w-full h-10 text-sm font-medium rounded-xl border-2 hover:bg-muted/50 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </motion.div>

              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      // Handle navigation to login
                      onOpenChange(false)
                      toast({
                        title: "Login",
                        description: "Redirecting to login page...",
                      })
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
                    disabled={isLoading}
                  >
                    Log in
                  </button>
                </p>
              </div>
            </form>
          </Form>
        </motion.div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 2px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4));
            border-radius: 2px;
            transition: all 0.2s ease;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6));
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:active {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.8));
          }
          
          /* Dark mode scrollbar */
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.5));
          }
          
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.7), rgba(236, 72, 153, 0.7));
          }
          
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:active {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9));
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
