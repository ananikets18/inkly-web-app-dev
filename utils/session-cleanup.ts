// Utility to clear session data and reset authentication state
// This can be used for testing or when users need to reset their session

export const clearSessionData = () => {
  console.log('🧹 Clearing all session data...')
  
  // Clear NextAuth session tokens
  localStorage.removeItem('next-auth.session-token')
  sessionStorage.removeItem('next-auth.session-token')
  localStorage.removeItem('next-auth.csrf-token')
  sessionStorage.removeItem('next-auth.csrf-token')
  
  // Clear Inkly-specific data
  localStorage.removeItem('inkly-user-data')
  localStorage.removeItem('inkly-onboarding-complete')
  localStorage.removeItem('inkly-drafts')
  localStorage.removeItem('inkly-inks')
  
  // Clear any other auth-related data
  localStorage.removeItem('auth-token')
  sessionStorage.removeItem('auth-token')
  
  console.log('✅ Session data cleared')
  console.log('🔄 Please refresh the page to see changes')
  
  return true
}

export const resetToUnauthenticatedState = () => {
  console.log('🚫 Resetting to unauthenticated state...')
  
  clearSessionData()
  
  // Force a page reload to reset all state
  window.location.reload()
  
  return true
}

export const resetToAuthenticatedState = () => {
  console.log('✅ Resetting to authenticated state...')
  
  // Clear existing data first
  clearSessionData()
  
  // Set mock authenticated state
  localStorage.setItem('next-auth.session-token', 'mock-session-token')
  localStorage.setItem('inkly-user-data', JSON.stringify({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser'
  }))
  localStorage.setItem('inkly-onboarding-complete', 'true')
  
  console.log('🔑 Mock authenticated state set')
  console.log('🔄 Please refresh the page to see changes')
  
  return true
}

export const resetToOnboardingState = () => {
  console.log('🎯 Resetting to onboarding state...')
  
  // Clear existing data first
  clearSessionData()
  
  // Set mock authenticated state but without onboarding complete
  localStorage.setItem('next-auth.session-token', 'mock-session-token')
  localStorage.setItem('inkly-user-data', JSON.stringify({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser'
  }))
  // Don't set onboarding complete - this will trigger onboarding flow
  
  console.log('🎯 Mock onboarding state set')
  console.log('🔄 Please refresh the page to see changes')
  
  return true
}

export const checkSessionState = () => {
  console.log('🔍 Checking current session state...')
  
  const sessionToken = localStorage.getItem('next-auth.session-token') || 
                      sessionStorage.getItem('next-auth.session-token')
  const userData = localStorage.getItem('inkly-user-data')
  const onboardingComplete = localStorage.getItem('inkly-onboarding-complete')
  
  console.log('🔑 Session token:', !!sessionToken)
  console.log('👤 User data:', !!userData)
  console.log('✅ Onboarding complete:', onboardingComplete === 'true')
  
  const state = {
    isAuthenticated: !!sessionToken,
    hasUserData: !!userData,
    onboardingComplete: onboardingComplete === 'true',
    currentPath: window.location.pathname
  }
  
  console.log('📊 Current state:', state)
  
  return state
}

// Make functions available globally
;(window as any).clearSessionData = clearSessionData
;(window as any).resetToUnauthenticatedState = resetToUnauthenticatedState
;(window as any).resetToAuthenticatedState = resetToAuthenticatedState
;(window as any).resetToOnboardingState = resetToOnboardingState
;(window as any).checkSessionState = checkSessionState

console.log('🧹 Session cleanup utilities loaded')
console.log('💡 Run clearSessionData() to clear all session data')
console.log('💡 Run resetToUnauthenticatedState() to test as unauthenticated user')
console.log('💡 Run resetToAuthenticatedState() to test as authenticated user')
console.log('💡 Run resetToOnboardingState() to test onboarding flow')
console.log('💡 Run checkSessionState() to see current state')

export {
  clearSessionData,
  resetToUnauthenticatedState,
  resetToAuthenticatedState,
  resetToOnboardingState,
  checkSessionState
} 