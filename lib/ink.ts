// Enhanced: Use localStorage for ink data if available, fallback to default mock data for SSR/ISR

const defaultInks = [
  { id: '1', content: 'This is the first ink!', author: 'Alice', createdAt: '2024-06-01T12:00:00Z' },
  { id: '2', content: 'Second ink, even better.', author: 'Bob', createdAt: '2024-06-02T15:30:00Z' },
  { id: '3', content: 'Third ink, wow!', author: 'Charlie', createdAt: '2024-06-03T09:45:00Z' },
]

function getLocalInks() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const data = localStorage.getItem('inkly-inks')
    if (data) {
      try {
        return JSON.parse(data)
      } catch {
        return defaultInks
      }
    }
  }
  return defaultInks
}

export async function getInkById(id: string) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 100))
  const inks = getLocalInks()
  return inks.find((ink: any) => ink.id === id) || null
}

export async function getAllInkIds() {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 100))
  const inks = getLocalInks()
  return inks.map((ink: any) => ink.id)
} 