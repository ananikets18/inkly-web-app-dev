// Validation constants
export const VALIDATION_LIMITS = {
  MIN_CHARS: 15,
  MAX_CHARS: 5000,
  MAX_TAGS: 2,
  MAX_EMOJI_PER_LINE: 5,
  MAX_DUPLICATE_CHARS: 4,
} as const

// Content validation types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  score: number
}

export interface ContentWarning {
  type: "mental_health" | "clickbait" | "ai_generated" | "spam"
  message: string
  severity: "low" | "medium" | "high"
  resources?: string[]
}

// Mental health keywords for soft warnings
const MENTAL_HEALTH_KEYWORDS = [
  "suicide",
  "kill myself",
  "end it all",
  "panic attack",
  "anxiety attack",
  "depression",
  "self harm",
  "cutting",
  "overdose",
  "worthless",
  "hopeless",
]

// Clickbait patterns
const CLICKBAIT_PATTERNS = [
  /you won't believe/i,
  /shocking truth/i,
  /doctors hate/i,
  /this will blow your mind/i,
  /number \d+ will shock you/i,
  /what happens next/i,
]

// Text validation functions
export function validateTextContent(text: string): ValidationResult {
  const trimmed = text.trim()
  const errors: string[] = []
  const warnings: string[] = []
  let score = 100

  // Empty check
  if (trimmed.length === 0) {
    errors.push("Content cannot be empty")
    return { isValid: false, errors, warnings, score: 0 }
  }

  // Length validation
  if (trimmed.length < VALIDATION_LIMITS.MIN_CHARS) {
    errors.push(`Content must be at least ${VALIDATION_LIMITS.MIN_CHARS} characters`)
    score -= 30
  }

  if (trimmed.length > VALIDATION_LIMITS.MAX_CHARS) {
    errors.push(`Content must be less than ${VALIDATION_LIMITS.MAX_CHARS} characters`)
    score -= 50
  }

  // Only emojis or punctuation check
  if (isOnlyEmojisOrPunctuation(trimmed)) {
    errors.push("Content cannot be only emojis or punctuation")
    score -= 40
  }

  // Duplicate characters check
  if (hasExcessiveDuplicateChars(trimmed)) {
    warnings.push("Avoid excessive repeated characters")
    score -= 10
  }

  // Emoji spam check
  if (hasEmojiSpam(trimmed)) {
    warnings.push("Consider reducing emoji usage for better readability")
    score -= 15
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  }
}

export function validateTags(tags: string[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let score = 100

  // Max tags check
  if (tags.length > VALIDATION_LIMITS.MAX_TAGS) {
    errors.push(`Maximum ${VALIDATION_LIMITS.MAX_TAGS} tags allowed`)
    score -= 30
  }

  // Duplicate tags check
  const uniqueTags = new Set(tags.map((tag) => tag.toLowerCase()))
  if (uniqueTags.size !== tags.length) {
    warnings.push("Duplicate tags detected")
    score -= 10
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  }
}

export function cleanTags(tags: string[]): string[] {
  return tags
    .map((tag) => tag.replace(/^#+/, "").trim().toLowerCase())
    .filter((tag) => tag.length > 0)
    .slice(0, VALIDATION_LIMITS.MAX_TAGS)
}

export function detectContentWarnings(text: string): ContentWarning[] {
  const warnings: ContentWarning[] = []

  // Mental health warning
  const hasMentalHealthKeywords = MENTAL_HEALTH_KEYWORDS.some((keyword) => text.toLowerCase().includes(keyword))

  if (hasMentalHealthKeywords) {
    warnings.push({
      type: "mental_health",
      message: "This content mentions mental health topics. Please consider your wellbeing and that of others.",
      severity: "high",
      resources: [
        "National Suicide Prevention Lifeline: 988",
        "Crisis Text Line: Text HOME to 741741",
        "International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/",
      ],
    })
  }

  // Clickbait detection
  const hasClickbait = CLICKBAIT_PATTERNS.some((pattern) => pattern.test(text))
  if (hasClickbait) {
    warnings.push({
      type: "clickbait",
      message: "This content may contain clickbait patterns. Consider a more authentic approach.",
      severity: "medium",
    })
  }

  // AI-generated content detection (basic)
  if (detectAIGenerated(text)) {
    warnings.push({
      type: "ai_generated",
      message: "This content appears to be AI-generated. Consider adding your personal touch.",
      severity: "low",
    })
  }

  return warnings
}

export function calculateXPPreview(text: string, tags: string[]): number {
  let xp = 0

  // Base XP for content length
  const wordCount = text.trim().split(/\s+/).length
  xp += Math.min(wordCount * 2, 100) // Max 100 XP for content

  // Tag bonus
  xp += tags.length * 10

  // Quality bonus
  const validation = validateTextContent(text)
  if (validation.score > 80) xp += 20

  return xp
}

// Helper functions
function isOnlyEmojisOrPunctuation(text: string): boolean {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
  const punctuationRegex = /[^\w\s]/g

  const withoutEmojis = text.replace(emojiRegex, "")
  const withoutPunctuation = withoutEmojis.replace(punctuationRegex, "")

  return withoutPunctuation.trim().length === 0
}

function hasExcessiveDuplicateChars(text: string): boolean {
  const regex = new RegExp(`(.)\\1{${VALIDATION_LIMITS.MAX_DUPLICATE_CHARS},}`, "g")
  return regex.test(text)
}

function hasEmojiSpam(text: string): boolean {
  const lines = text.split("\n")
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu

  return lines.some((line) => {
    const emojiCount = (line.match(emojiRegex) || []).length
    return emojiCount > VALIDATION_LIMITS.MAX_EMOJI_PER_LINE
  })
}

function detectAIGenerated(text: string): boolean {
  // Simple heuristics for AI-generated content
  const aiPatterns = [/as an ai/i, /i'm an ai/i, /as a language model/i, /i don't have personal/i, /i cannot provide/i]

  const repetitivePatterns = [
    /\b(\w+)\s+\1\b/g, // Repeated words
    /(.{10,})\1/g, // Repeated phrases
  ]

  // Check for AI patterns
  if (aiPatterns.some((pattern) => pattern.test(text))) {
    return true
  }

  // Check for repetitive patterns
  return repetitivePatterns.some((pattern) => pattern.test(text))
}

// Auto-suggest tags based on content
export function suggestTags(content: string): string[] {
  const suggestions: string[] = []
  const lowerContent = content.toLowerCase()

  // Common tag mappings
  const tagMappings = {
    poem: ["poetry", "verse"],
    quote: ["wisdom", "inspiration"],
    story: ["narrative", "tale"],
    thought: ["reflection", "mindful"],
    dream: ["vision", "aspiration"],
    love: ["romance", "heart"],
    life: ["living", "existence"],
    hope: ["optimism", "faith"],
    fear: ["anxiety", "worry"],
    joy: ["happiness", "bliss"],
  }

  // Check for keywords and suggest related tags
  Object.entries(tagMappings).forEach(([keyword, tags]) => {
    if (lowerContent.includes(keyword)) {
      suggestions.push(...tags)
    }
  })

  // Remove duplicates and limit
  return [...new Set(suggestions)].slice(0, 5)
}
