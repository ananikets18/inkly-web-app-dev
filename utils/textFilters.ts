import DOMPurify from 'dompurify';
import PROFANITY_LIST from './profanityList';

// Profanity check
export function containsProfanity(input: string): boolean {
  const lower = input.toLowerCase();
  return PROFANITY_LIST.some(word => lower.includes(word));
}

// XSS/HTML tag stripping
export function sanitizeInput(input: string): string {
  const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return clean.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

// Emoji spam: more than 50% of chars are emojis
const emojiRegex = /[\p{Emoji}]/gu;
export function isEmojiSpam(input: string): boolean {
  const emojiCount = (input.match(emojiRegex) || []).length;
  return input.length > 0 && emojiCount / input.length > 0.5;
}

// Repeated character spam: e.g., "!!!!!!" or "hiiiiiiii"
export function isRepeatedCharSpam(input: string, threshold = 5): boolean {
  return /(.)\1{4,}/.test(input); // 5 or more repeated chars
}

// Link detection (basic)
const urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/i;
export function containsLink(input: string): boolean {
  return urlRegex.test(input);
}

// Minimum/maximum character check
export function isCharCountValid(input: string, min: number, max: number): boolean {
  const len = input.length;
  return len >= min && len <= max;
}

// Only punctuation/whitespace
export function isOnlyPunctuationOrWhitespace(input: string): boolean {
  return /^[\s\p{P}]+$/u.test(input);
} 