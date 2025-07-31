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

//  Re-export from our canonical helper so legacy imports keep working.
export * from "./get-tags-and-mood"
export { default } from "./get-tags-and-mood"
