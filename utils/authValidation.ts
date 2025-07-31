export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Comprehensive list of reserved words and paths
const RESERVED_WORDS = [
  // System reserved
  'admin', 'administrator', 'mod', 'moderator', 'support', 'help', 'info',
  'api', 'www', 'mail', 'ftp', 'root', 'system', 'test', 'demo', 'guest',
  'anonymous', 'null', 'undefined', 'true', 'false', 'on', 'off',
  
  // Common usernames that should be reserved
  'user', 'users', 'account', 'accounts', 'profile', 'profiles',
  'settings', 'config', 'configuration', 'login', 'logout', 'signin', 'signout',
  'register', 'registration', 'signup', 'auth', 'authentication',
  
  // App-specific reserved paths
  'about', 'contact', 'privacy', 'terms', 'guidelines', 'explore',
  'create', 'edit', 'drafts', 'studio', 'analytics', 'notifications',
  'onboarding', 'welcome', 'home', 'dashboard', 'feed', 'timeline',
  'search', 'explore', 'trending', 'popular', 'new', 'top',
  
  // Common words that might cause confusion
  'ink', 'inks', 'inkly', 'post', 'posts', 'content', 'media',
  'follow', 'following', 'followers', 'like', 'likes', 'comment', 'comments',
  'share', 'shares', 'bookmark', 'bookmarks', 'collection', 'collections',
  
  // Generic terms
  'me', 'my', 'mine', 'self', 'myself', 'you', 'your', 'yours',
  'we', 'us', 'our', 'they', 'them', 'their', 'this', 'that', 'these', 'those',
  
  // Common names that might be problematic
  'anonymous', 'unknown', 'nobody', 'someone', 'anyone', 'everyone',
  'admin', 'moderator', 'staff', 'team', 'support', 'help', 'info',
  
  // Technical terms
  'api', 'app', 'application', 'web', 'site', 'page', 'url', 'link',
  'server', 'client', 'database', 'cache', 'session', 'cookie',
  
  // Social media terms
  'tweet', 'retweet', 'like', 'follow', 'unfollow', 'block', 'mute',
  'dm', 'message', 'chat', 'conversation', 'thread', 'story', 'reel',
  
  // Inkly-specific terms
  'ink', 'inks', 'inkly', 'echo', 'echoes', 'burst', 'streak', 'xp',
  'achievement', 'achievements', 'badge', 'badges', 'level', 'levels',
  'rank', 'ranking', 'leaderboard', 'top', 'trending', 'popular'
]

// Simulated taken usernames (in production, this would be a database query)
const TAKEN_USERNAMES = [
  'john_doe', 'jane_smith', 'alex_wilson', 'sarah_jones', 'mike_brown',
  'emma_davis', 'david_miller', 'lisa_garcia', 'chris_rodriguez',
  'admin', 'user', 'test', 'demo', 'guest', 'anonymous'
]

export function validateUsername(username: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if username is empty
  if (!username.trim()) {
    errors.push("Username is required")
    return { isValid: false, errors, warnings }
  }

  // Normalize username (lowercase for comparison)
  const normalizedUsername = username.toLowerCase().trim()

  // Check minimum length
  if (username.length < 3) {
    errors.push("Username must be at least 3 characters long")
  }

  // Check maximum length
  if (username.length > 30) {
    errors.push("Username must be less than 30 characters")
  }

  // Check for valid characters (alphanumeric, underscore, dot, hyphen)
  const validUsernameRegex = /^[a-zA-Z0-9._-]+$/
  if (!validUsernameRegex.test(username)) {
    errors.push("Username can only contain letters, numbers, underscores, dots, and hyphens")
  }

  // Check for consecutive special characters
  if (/[._-]{2,}/.test(username)) {
    errors.push("Username cannot contain consecutive special characters")
  }

  // Check for reserved words
  if (RESERVED_WORDS.includes(normalizedUsername)) {
    errors.push("This username is reserved and cannot be used")
  }

  // Check if username starts or ends with special characters
  if (/^[._-]|[._-]$/.test(username)) {
    errors.push("Username cannot start or end with special characters")
  }

  // Check for availability (simulated)
  if (TAKEN_USERNAMES.includes(normalizedUsername)) {
    errors.push("This username is already taken")
  }

  // Check for common patterns that might be confusing
  if (/^[0-9]+$/.test(username)) {
    warnings.push("Usernames with only numbers might be hard to remember")
  }

  if (username.length < 5) {
    warnings.push("Consider using a longer username for better security")
  }

  // Check for potentially problematic patterns
  if (/^(admin|mod|support|help|info)/i.test(username)) {
    warnings.push("This username might be confused with a system account")
  }

  // Check for excessive special characters
  const specialCharCount = (username.match(/[._-]/g) || []).length
  if (specialCharCount > username.length * 0.3) {
    warnings.push("Too many special characters. Consider using more letters and numbers")
  }

  // Check for common words that might be taken
  const commonWords = ['user', 'admin', 'test', 'demo', 'guest', 'anonymous']
  if (commonWords.includes(normalizedUsername)) {
    warnings.push("This username might already be taken")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if email is empty
  if (!email.trim()) {
    errors.push("Email is required")
    return { isValid: false, errors, warnings }
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address")
  }

  // Check for disposable email domains
  const disposableDomains = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com',
    'mailinator.com', 'yopmail.com', 'throwaway.com'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (domain && disposableDomains.includes(domain)) {
    warnings.push("Consider using a permanent email address")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if password is empty
  if (!password) {
    errors.push("Password is required")
    return { isValid: false, errors, warnings }
  }

  // Check minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    warnings.push("Consider adding uppercase letters for better security")
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    warnings.push("Consider adding lowercase letters for better security")
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    warnings.push("Consider adding numbers for better security")
  }

  // Check for special characters
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    warnings.push("Consider adding special characters for better security")
  }

  // Check for common passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("This password is too common. Please choose a stronger password")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
} 

export function validateFullName(name: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if name is empty
  if (!name.trim()) {
    errors.push("Full name is required")
    return { isValid: false, errors, warnings }
  }

  // Check minimum length
  if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }

  // Check maximum length
  if (name.trim().length > 50) {
    errors.push("Name must be less than 50 characters")
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const validNameRegex = /^[a-zA-Z\s'-]+$/
  if (!validNameRegex.test(name.trim())) {
    errors.push("Name can only contain letters, spaces, hyphens, and apostrophes")
  }

  // Check for excessive spaces
  if (/\s{2,}/.test(name)) {
    warnings.push("Consider removing extra spaces")
  }

  // Check for single character names
  if (name.trim().length === 1) {
    warnings.push("Consider using your full name")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateBio(bio: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Bio is optional, so no errors for empty bio
  if (!bio.trim()) {
    return { isValid: true, errors, warnings }
  }

  // Check maximum length
  if (bio.length > 150) {
    errors.push("Bio must be less than 150 characters")
  }

  // Check minimum length for non-empty bio
  if (bio.trim().length > 0 && bio.trim().length < 10) {
    warnings.push("Consider adding more details to your bio")
  }

  // Check for excessive special characters
  const specialCharCount = (bio.match(/[!@#$%^&*()_+=[\]{}|;':",./<>?~`]/g) || []).length
  if (specialCharCount > bio.length * 0.3) {
    warnings.push("Consider using more natural language")
  }

  // Check for all caps
  if (bio === bio.toUpperCase() && bio.length > 5) {
    warnings.push("Consider using normal capitalization")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateLocation(location: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Location is optional, so no errors for empty location
  if (!location.trim()) {
    return { isValid: true, errors, warnings }
  }

  // Check maximum length
  if (location.length > 100) {
    errors.push("Location must be less than 100 characters")
  }

  // Check for valid characters
  const validLocationRegex = /^[a-zA-Z0-9\s,.-]+$/
  if (!validLocationRegex.test(location)) {
    errors.push("Location can only contain letters, numbers, spaces, commas, dots, and hyphens")
  }

  // Check for excessive commas
  if ((location.match(/,/g) || []).length > 2) {
    warnings.push("Consider simplifying your location format")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateOnboardingData(data: {
  username: string
  fullName: string
  bio: string
  location: string
}): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate username
  const usernameValidation = validateUsername(data.username)
  if (!usernameValidation.isValid) {
    errors.push(...usernameValidation.errors)
  }
  warnings.push(...usernameValidation.warnings)

  // Validate full name
  const nameValidation = validateFullName(data.fullName)
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors)
  }
  warnings.push(...nameValidation.warnings)

  // Validate bio
  const bioValidation = validateBio(data.bio)
  if (!bioValidation.isValid) {
    errors.push(...bioValidation.errors)
  }
  warnings.push(...bioValidation.warnings)

  // Validate location
  const locationValidation = validateLocation(data.location)
  if (!locationValidation.isValid) {
    errors.push(...locationValidation.errors)
  }
  warnings.push(...locationValidation.warnings)

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
} 