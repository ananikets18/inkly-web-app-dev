"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, XCircle, Info, Sparkles, ExternalLink, X } from "lucide-react"
import type { ValidationResult, ContentWarning } from "@/utils/inkValidation"

interface InkValidationFeedbackProps {
  validation: ValidationResult
  warnings: ContentWarning[]
  xpPreview: number
  className?: string
}

export default function InkValidationFeedback({
  validation,
  warnings,
  xpPreview,
  className = "",
}: InkValidationFeedbackProps) {
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set())

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  const dismissWarning = (warningType: string) => {
    setDismissedWarnings((prev) => new Set([...prev, warningType]))
  }

  const visibleWarnings = warnings.filter((w) => !dismissedWarnings.has(w.type))

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Validation Errors */}
      <AnimatePresence>
        {validation.errors.map((error, index) => (
          <motion.div
            key={`error-${index}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant="destructive" className="border-red-200">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Validation Warnings */}
      <AnimatePresence>
        {validation.warnings.map((warning, index) => (
          <motion.div
            key={`warning-${index}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">{warning}</AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Content Warnings */}
      <AnimatePresence>
        {visibleWarnings.map((warning) => (
          <motion.div
            key={warning.type}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Alert
              className={`
              ${warning.severity === "high" ? "border-red-200 bg-red-50" : ""}
              ${warning.severity === "medium" ? "border-orange-200 bg-orange-50" : ""}
              ${warning.severity === "low" ? "border-blue-200 bg-blue-50" : ""}
            `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <Info
                    className={`h-4 w-4 mt-0.5 ${
                      warning.severity === "high"
                        ? "text-red-600"
                        : warning.severity === "medium"
                          ? "text-orange-600"
                          : "text-blue-600"
                    }`}
                  />
                  <div className="space-y-2">
                    <AlertDescription
                      className={`${
                        warning.severity === "high"
                          ? "text-red-800"
                          : warning.severity === "medium"
                            ? "text-orange-800"
                            : "text-blue-800"
                      }`}
                    >
                      {warning.message}
                    </AlertDescription>

                    {warning.resources && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Resources:</p>
                        {warning.resources.map((resource, index) => (
                          <div key={index} className="flex items-center gap-1 text-sm">
                            <ExternalLink className="h-3 w-3" />
                            <span>{resource}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={() => dismissWarning(warning.type)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Quality Score & XP Preview */}
      {validation.isValid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4"
        >
          <div className="space-y-3">
            {/* Quality Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Content Quality</span>
                <Badge variant="secondary" className={getScoreColor(validation.score)}>
                  {getScoreLabel(validation.score)}
                </Badge>
              </div>
              <Progress value={validation.score} className="h-2" />
              <p className="text-xs text-gray-600">{validation.score}/100</p>
            </div>

            {/* XP Preview */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-200">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Estimated XP</span>
              </div>
              <Badge className="bg-purple-600 text-white">+{xpPreview} XP</Badge>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success State */}
      {validation.isValid && validation.warnings.length === 0 && visibleWarnings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your ink looks great! Ready to share with the world.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  )
}
