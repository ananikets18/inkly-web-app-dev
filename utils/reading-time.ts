export function calculateReadingTime(text: string): { minutes: number; seconds: number; text: string } {
  const readingWordsPerMinute = 225
  const words = text.trim().split(/\s+/).length
  const totalMinutes = words / readingWordsPerMinute

  const minutes = Math.floor(totalMinutes)
  const seconds = Math.round((totalMinutes - minutes) * 60)

  let readingTimeText = ""
  if (totalMinutes < 1) {
    readingTimeText = `${Math.max(1, Math.round(totalMinutes * 60))}s read`
  } else if (totalMinutes < 2) {
    readingTimeText = "1 min read"
  } else {
    readingTimeText = `${minutes} min read`
  }

  return {
    minutes,
    seconds,
    text: readingTimeText,
  }
}
