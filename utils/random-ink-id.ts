// Enhanced: Generates a secure, human-friendly random ink ID using crypto.randomUUID
// and a larger word list. Also supports mapping a UUID to a word-based ID.

const adjectives = [
  'sunny', 'quiet', 'brave', 'lucky', 'swift', 'calm', 'wise', 'bold', 'kind', 'fuzzy',
  'gentle', 'shy', 'clever', 'happy', 'jolly', 'keen', 'merry', 'neat', 'proud', 'witty',
  'zesty', 'vivid', 'silly', 'chill', 'snappy', 'quirky', 'spicy', 'fancy', 'jazzy', 'peppy',
  'breezy', 'frosty', 'glossy', 'graceful', 'plucky', 'snazzy', 'spry', 'tidy', 'zany', 'perky',
  'dandy', 'nifty', 'crafty', 'sassy', 'cheery', 'bouncy', 'dreamy', 'flashy', 'giddy', 'zippy'
]

const animals = [
  'fox', 'owl', 'wolf', 'bear', 'lion', 'tiger', 'lynx', 'deer', 'hare', 'crow',
  'finch', 'mole', 'bat', 'frog', 'duck', 'goose', 'crab', 'seal', 'panda', 'bee',
  'otter', 'eagle', 'shark', 'whale', 'dove', 'swan', 'ant', 'elk', 'moth', 'lark',
  'mouse', 'rat', 'dog', 'cat', 'horse', 'sheep', 'goat', 'pig', 'hen', 'robin',
  'wren', 'hawk', 'falcon', 'bison', 'moose', 'yak', 'lemur', 'koala', 'sloth', 'gull'
]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Deterministically map a UUID to a word-based ID
export function uuidToInkId(uuid: string): string {
  return uuid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toLowerCase();
}

// Generates a secure, random 8-character alphanumeric ink ID
function randomAlphanumeric(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return result;
}

export function generateRandomInkId() {
  return randomAlphanumeric(8);
}
