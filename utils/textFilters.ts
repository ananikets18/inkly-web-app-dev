import DOMPurify from "dompurify"
import PROFANITY_LIST from "./profanityList"

// Helper to normalize text for profanity/keyword detection
function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove non-alphanumeric characters
    .replace(/\s/g, "") // Remove all whitespace
}

// 1. Profanity & Obscenity Filter (Enhanced)
export function containsProfanity(input: string): boolean {
  // Normalize and split into words
  const normalizedInput = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove non-alphanumeric except spaces
    .split(/\s+/)
    .filter(Boolean)

  // Also check leetspeak for each word
  const leetSpeakMap: { [key: string]: string } = {
    a: "4",
    e: "3",
    i: "1",
    o: "0",
    s: "5",
    t: "7",
    l: "1",
    z: "2",
  }
  function leetNormalize(word: string) {
    let w = word
    for (const char in leetSpeakMap) {
      w = w.replace(new RegExp(leetSpeakMap[char], "g"), char)
    }
    return w
  }

  let matchedWord = null
  let matchedInputWord = null
  const result = normalizedInput.some((inputWord) => {
    const leetWord = leetNormalize(inputWord)
    return PROFANITY_LIST.some((word) => {
      const normalizedWord = word.toLowerCase()
      const match = inputWord === normalizedWord || leetWord === normalizedWord
      if (match) {
        matchedWord = word
        matchedInputWord = inputWord
      }
      return match
    })
  })
  if (result) {
    console.debug("[Profanity Debug] Input:", input)
    console.debug("[Profanity Debug] Normalized Words:", normalizedInput)
    console.debug("[Profanity Debug] Matched Word:", matchedWord)
    console.debug("[Profanity Debug] Matched Input Word:", matchedInputWord)
  }
  return result
}

// 2. Hate Speech / Discrimination (Placeholder - requires NLP/backend)
export function containsHateSpeech(input: string): boolean {
  const lower = input.toLowerCase()
  // Very basic keyword check - real implementation needs NLP
  const hateKeywords = ["racist", "sexist", "homophobic", "bigot"]
  return hateKeywords.some((keyword) => lower.includes(keyword))
}

// 3. NSFW / Sexual Content (Placeholder - requires advanced NLP/image recognition)
export function containsNSFWContent(input: string): boolean {
  const lower = input.toLowerCase()
  // Very basic keyword check - real implementation needs advanced NLP
  const nsfwKeywords = ["porn", "sex", "erotic", "explicit"]
  return nsfwKeywords.some((keyword) => lower.includes(keyword))
}

// 4. Mental Health Risk Phrases
export function containsMentalHealthRisk(input: string): boolean {
  const lower = input.toLowerCase()
  const riskPhrases = [
    "self harm",
    "suicide",
    "kill myself",
    "end my life",
    "depressed",
    "hopeless",
    "no reason to live",
    "want to die",
    "cutting myself",
    "suicidal thoughts",
  ]
  return riskPhrases.some((phrase) => lower.includes(phrase))
}

// 5. Violence & Threats
export function containsViolence(input: string): boolean {
  const lower = input.toLowerCase()
  const violenceKeywords = [
    "kill",
    "murder",
    "attack",
    "threaten",
    "harm",
    "bomb",
    "terrorist",
    "shoot",
    "stab",
    "assault",
    "violence",
    "destroy",
    "explode",
  ]
  return violenceKeywords.some((keyword) => lower.includes(keyword))
}

// 6. Plagiarism Detection (Placeholder - requires backend database comparison)
export function mightBePlagiarized(input: string): boolean {
  // This would involve sending text to a backend service to compare against a database
  // For client-side, this will always return false.
  return false
}

// 7. AI-Generated Text / Spam Patterns (Placeholder - requires advanced NLP/ML)
export function isAIGeneratedOrSpam(input: string): boolean {
  // Detecting AI-generated text or complex spam patterns is difficult client-side.
  // This is a very basic placeholder.
  const lower = input.toLowerCase()
  const spamPatterns = [
    "buy now",
    "limited time offer",
    "click here",
    "subscribe to my channel",
    "earn money fast",
    "free crypto",
    "guaranteed results",
  ]
  return spamPatterns.some((pattern) => lower.includes(pattern))
}

// 8. Clickbait / Fake News Warnings
export function containsClickbait(input: string): boolean {
  const lower = input.toLowerCase()
  const clickbaitPhrases = [
    "you won't believe",
    "shocking truth",
    "mind-blowing",
    "secret revealed",
    "what happened next",
    "breaking news",
    "must see",
    "viral video",
    "insane",
    "unbelievable",
    "this is why",
  ]
  return clickbaitPhrases.some((phrase) => lower.includes(phrase))
}

// 9. Forbidden Topics (Customizable)
export function containsForbiddenTopic(input: string): boolean {
  const lower = input.toLowerCase()
  const forbiddenKeywords = [
    "political propaganda",
    "misinformation",
    "illegal drugs",
    "extremist ideology",
    "hate group",
    "child exploitation",
    "terrorism",
    "incite violence",
  ]
  return forbiddenKeywords.some((keyword) => lower.includes(keyword))
}

// 10. Empty / Low-Effort Posts (Existing, but adding gibberish placeholder)
// isOnlyPunctuationOrWhitespace already exists
// isEmojiSpam already exists
// isRepeatedCharSpam already exists

// 11. Impersonation / Namedrop Alert (Placeholder - requires database of entities)
export function containsImpersonation(input: string): boolean {
  const lower = input.toLowerCase()
  // This would typically involve checking against a list of known users/celebrities/brands
  // For client-side, this is a very basic placeholder.
  const namedropKeywords = ["elon musk", "taylor swift", "verizon", "apple"]
  return namedropKeywords.some((keyword) => lower.includes(keyword))
}

// XSS/HTML tag stripping (Existing)
export function sanitizeInput(input: string): string {
  const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  return clean
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim()
}

// Emoji spam: more than 50% of chars are emojis (Existing)
const emojiRegex = /[\p{Emoji}]/gu
export function isEmojiSpam(input: string): boolean {
  const emojiCount = (input.match(emojiRegex) || []).length
  return input.length > 0 && emojiCount / input.length > 0.5
}

// Repeated character spam: e.g., "!!!!!!" or "hiiiiiiii" (Existing)
export function isRepeatedCharSpam(input: string, threshold = 5): boolean {
  return /(.)\1{4,}/.test(input) // 5 or more repeated chars
}

// Link detection (basic) (Existing)
const urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/i
export function containsLink(input: string): boolean {
  return urlRegex.test(input)
}

// Minimum/maximum character check (Existing)
export function isCharCountValid(input: string, min: number, max: number): boolean {
  const len = input.length
  return len >= min && len <= max
}

// Only punctuation/whitespace (Existing)
export function isOnlyPunctuationOrWhitespace(input: string): boolean {
  return /^[\s\p{P}]+$/u.test(input)
}

// Add a getWordCount export for compatibility
export function getWordCount(input: string): number {
  if (!input) return 0;
  return input.trim().split(/\s+/).filter(Boolean).length;
}
