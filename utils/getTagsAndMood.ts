/**
 * Quick-n-simple helper that extracts:
 *  • `tags` – words that start with `#`
 *  • `mood` – first emoji found in the text (or `null`)
 *
 * NOTE:  This is a *placeholder* implementation so the app
 *        no longer crashes due to a missing export.
 *        Feel free to replace it with smarter logic later.
 */
export type TagsAndMood = {
  tags: string[]
  mood: string | null
}

const TAG_REGEX = /#[\p{Letter}\p{Number}\p{Emoji_Presentation}]+/gu
const EMOJI_REGEX = /\p{Emoji_Presentation}/u

export function getTagsAndMood(text: string): TagsAndMood {
  if (!text) return { tags: [], mood: null }

  // 1. collect hashtags
  const tags = [...new Set(text.match(TAG_REGEX) ?? [])]

  // 2. grab first emoji as a naive “mood” indicator
  const emojiMatch = text.match(EMOJI_REGEX)
  const mood = emojiMatch ? emojiMatch[0] : null

  return { tags, mood }
}

//  Re-export from our canonical helper so legacy imports keep working.
export * from "./get-tags-and-mood"
export { default } from "./get-tags-and-mood"
