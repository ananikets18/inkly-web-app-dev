
// Dynamic Ink Validation System

export type InkContentType =
  | "dialogue"
  | "list"
  | "quote"
  | "question"
  | "affirmation"
  | "observation"
  | "inspirational"
  | "reflective"
  | "humorous"
  | "story"
  | "poetic"
  | "philosophical"
  | "informative"
  | "rant"
  | "short"
  | "medium"
  | "long"
  | "unknown"

export interface InkValidationResult {
  errors: string[] // Hard blocks
  warnings: string[] // Soft blocks (can submit, but discouraged)
  nudges: string[] // Tips, suggestions
  detectedType: InkContentType
}

// --- 1. Content-Type Detection ---
export function detectInkContentType(content: string): InkContentType {
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 1) {
    if (/^(["“]).*(["”])$/.test(lines[0])) return "quote"
    if (lines[0].endsWith("?")) return "question"
    if (lines[0].length < 60) return "short"
  }
  if (lines.length > 1) {
    if (lines.every((l) => /^[-•*\d+\.]/.test(l))) return "list"
    if (lines.every((l) => /^[A-Z]:/.test(l))) return "dialogue"
    if (lines.length > 5 && content.length > 500) return "long"
    if (lines.length > 2 && content.length > 200) return "medium"
  }
  // Add more heuristics as needed
  return "unknown"
}

// --- 2. Validation Pipeline ---
export function validateInkContent(content: string): InkValidationResult {
  const type = detectInkContentType(content)
  const errors: string[] = []
  const warnings: string[] = []
  const nudges: string[] = []
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

  // --- Hard validation (blocking) ---
  if (!content.trim()) errors.push("Content cannot be empty.")
  if (content.length > 5000) errors.push("Content exceeds maximum length.")
  // Add profanity/hate/NSFW/violence checks here (call existing functions)

  // --- Type-specific validation & nudges ---
  switch (type) {
    case "dialogue":
      if (lines.length < 2) nudges.push("Tip: Dialogues are more engaging with at least two speakers.")
      if (!lines.every((l) => /^[A-Z]:/.test(l))) nudges.push("Tip: Start each line with a speaker label (e.g., A: Hello).")
      break
    case "list":
      if (lines.length < 2) nudges.push("Tip: Lists are more useful with at least two items.")
      nudges.push("Tip: Use clear, concise items for better readability.")
      break
    case "quote":
      nudges.push("Tip: Short, impactful quotes are memorable.")
      nudges.push("Tip: Attribute famous quotes if possible.")
      if (content.length > 200) warnings.push("Quotes are usually short and impactful.")
      break
    case "question":
      nudges.push("Tip: Open-ended questions spark more engagement.")
      nudges.push("Tip: Try to ask questions that invite reflection or discussion.")
      if (!content.trim().endsWith("?")) warnings.push("Questions should end with a question mark.")
      break
    case "affirmation":
      nudges.push("Tip: Positive affirmations can brighten someone’s day.")
      nudges.push("Tip: Keep affirmations short and uplifting.")
      break
    case "observation":
      nudges.push("Tip: Observations about daily life can inspire others.")
      nudges.push("Tip: Add a personal touch to make your observation unique.")
      break
    case "inspirational":
      nudges.push("Tip: Motivational inks can encourage your readers.")
      nudges.push("Tip: Share a personal story for greater impact.")
      break
    case "reflective":
      nudges.push("Tip: Reflective inks are great for self-discovery.")
      nudges.push("Tip: Don’t be afraid to be vulnerable—your story matters.")
      break
    case "humorous":
      nudges.push("Tip: Humor is a great way to connect—keep it light and fun.")
      nudges.push("Tip: Sarcasm can be tricky online; make sure your intent is clear.")
      break
    case "story":
      nudges.push("Tip: Short anecdotes can be powerful and relatable.")
      nudges.push("Tip: Use vivid details to bring your story to life.")
      break
    case "poetic":
      nudges.push("Tip: Poetry can be any style—haiku, rhyme, or free verse.")
      nudges.push("Tip: Experiment with structure and imagery.")
      break
    case "philosophical":
      nudges.push("Tip: Thought-provoking questions invite deep discussion.")
      nudges.push("Tip: Share your unique perspective on life’s big questions.")
      break
    case "informative":
      nudges.push("Tip: Quick tips and facts are helpful—keep them concise.")
      nudges.push("Tip: Cite sources if sharing important information.")
      break
    case "rant":
      nudges.push("Tip: Express your feelings, but keep it respectful.")
      nudges.push("Tip: Constructive rants can spark positive change.")
      break
    case "short":
      nudges.push("Tip: Short inks can be powerful. Consider expanding for more depth.")
      break
    case "medium":
      nudges.push("Tip: Medium-length inks are great for reflection.")
      break
    case "long":
      nudges.push("Tip: Long inks allow for deep exploration. Consider breaking up long paragraphs for readability.")
      break
    default:
      nudges.push("Tip: Share your unique perspective!")
  }

  // --- Return result ---
  return { errors, warnings, nudges, detectedType: type }
}