/**
 * getTagsAndMood
 * ---------------
 * Very small utility that:
 *   • pulls out hashtags → `tags`
 *   • grabs the first emoji → `mood`
 *
 * It’s intentionally lightweight; replace or enhance as needed.
 */

export type TagsAndMood = {
  tags: string[]
  mood: string | null
}

const TAG_REGEX = /#[\p{Letter}\p{Number}\p{Emoji_Presentation}]+/gu
const EMOJI_REGEX = /\p{Emoji_Presentation}/u

export function getTagsAndMood(text: string): TagsAndMood {
  if (!text) return { tags: [], mood: null }

  const tags = [...new Set(text.match(TAG_REGEX) ?? [])]
  const emoji = text.match(EMOJI_REGEX)?.[0] ?? null

  return { tags, mood: emoji }
}

/* ───────────────  convenience default export  ─────────────── */
export default getTagsAndMood
