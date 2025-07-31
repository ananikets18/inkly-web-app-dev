// Configuration file for API and environment settings

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001',
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
  },
  
  // Authentication Configuration (removed)
  auth: {
    // Authentication disabled
  },
  
  // Feature Flags
  features: {
    enableRealTimeValidation: true,
    enableOfflineMode: false,
    enableAnalytics: process.env.NODE_ENV === 'production',
  },
  
  // Validation Configuration
  validation: {
    username: {
      minLength: 3,
      maxLength: 30,
      allowedChars: /^[a-zA-Z0-9._-]+$/,
    },
    password: {
      minLength: 8,
      maxLength: 128,
    },
    email: {
      maxLength: 254,
    },
  },
  
  // Error Messages
  errors: {
    network: 'Network error. Please check your connection.',
    unauthorized: 'Please log in to continue.',
    forbidden: 'You don\'t have permission to perform this action.',
    notFound: 'The requested resource was not found.',
    serverError: 'Server error. Please try again later.',
    validation: 'Please check your input and try again.',
  },
  
  // Success Messages
  success: {
    login: 'Welcome back!',
    signup: 'Account created successfully!',
    logout: 'You have been logged out.',
    profileUpdate: 'Profile updated successfully.',
  },
}

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
export const isTest = process.env.NODE_ENV === 'test'

// API URL builder
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = config.api.baseUrl.replace(/\/$/, '') // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, '') // Remove leading slash
  return `${baseUrl}/${cleanEndpoint}`
}

// Token management helpers (removed - authentication disabled)
export const getStoredToken = (): string | null => {
  return null
}

export const setStoredToken = (token: string): void => {
  // Authentication disabled
}

export const removeStoredToken = (): void => {
  // Authentication disabled
}

// Error message helpers
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error
  
  if (error?.message) return error.message
  
  if (error?.error) return error.error
  
  return config.errors.serverError
}

// Network status helpers
export const isOnline = (): boolean => {
  if (typeof window === 'undefined') return true
  return navigator.onLine
}

// Feature flag helpers
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature]
} 