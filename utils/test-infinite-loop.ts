// Test utility to debug infinite loop issues
// This can be run in the browser console to test the flow

export const testInfiniteLoopFix = () => {
  console.log('🧪 Testing infinite loop fix...')

  // Test 1: Check current page and session
  const testCurrentState = () => {
    console.log('📍 Current page:', window.location.pathname)
    console.log('🔗 Full URL:', window.location.href)
    
    // Check if we're in a potential loop
    const urlParams = new URLSearchParams(window.location.search)
    const callbackUrl = urlParams.get('callbackUrl')
    console.log('🔄 Callback URL:', callbackUrl)
  }

  // Test 2: Check localStorage for onboarding data
  const testLocalStorage = () => {
    console.log('💾 Checking localStorage...')
    
    const onboardingData = localStorage.getItem('inkly-onboarding-data')
    const onboardingComplete = localStorage.getItem('inkly-onboarding-complete')
    
    console.log('📦 Onboarding data:', onboardingData ? 'Present' : 'Not present')
    console.log('✅ Onboarding complete:', onboardingComplete)
    
    if (onboardingData) {
      try {
        const parsed = JSON.parse(onboardingData)
        console.log('📊 Parsed onboarding data:', parsed)
      } catch (error) {
        console.log('❌ Failed to parse onboarding data:', error)
      }
    }
  }

  // Test 3: Check session data
  const testSession = async () => {
    console.log('👤 Checking session data...')
    
    try {
      const response = await fetch('/api/auth/session')
      
      if (response.ok) {
        const session = await response.json()
        console.log('📋 Session data:', session)
        
        if (session.user) {
          console.log('✅ User authenticated')
          console.log('📧 Email:', session.user.email)
          console.log('📊 Onboarding completed:', session.user.onboardingCompleted)
          console.log('📝 Onboarding step:', session.user.onboardingStep)
        } else {
          console.log('❌ No user in session')
        }
      } else {
        console.log('❌ Failed to fetch session:', response.status)
      }
    } catch (error) {
      console.log('❌ Error fetching session:', error)
    }
  }

  // Test 4: Check user onboarding status
  const testOnboardingStatus = async () => {
    console.log('📊 Checking onboarding status...')
    
    try {
      const response = await fetch('/api/user/onboarding-status')
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Onboarding status:', data)
      } else {
        console.log('❌ Failed to fetch onboarding status:', response.status)
      }
    } catch (error) {
      console.log('❌ Error fetching onboarding status:', error)
    }
  }

  // Test 5: Simulate the expected flow
  const testExpectedFlow = () => {
    console.log('🔄 Testing expected flow...')
    
    const currentPath = window.location.pathname
    
    if (currentPath === '/auth/signin' || currentPath === '/auth/signup') {
      console.log('✅ On auth page - ready for OAuth')
      console.log('📋 Expected flow:')
      console.log('   1. User clicks "Continue with Google"')
      console.log('   2. Google OAuth popup opens')
      console.log('   3. User authenticates with Google')
      console.log('   4. Redirected to /onboarding (new user)')
      console.log('   5. Complete onboarding steps')
      console.log('   6. Redirected to home page')
    } else if (currentPath === '/onboarding') {
      console.log('✅ On onboarding page - user authenticated')
      console.log('📋 Expected behavior:')
      console.log('   - Should stay on onboarding page')
      console.log('   - No redirects should happen')
      console.log('   - Complete onboarding steps')
      console.log('   - Redirect to home after completion')
    } else if (currentPath === '/') {
      console.log('✅ On home page - flow completed')
      console.log('📋 Expected behavior:')
      console.log('   - Should stay on home page')
      console.log('   - No redirects should happen')
    } else {
      console.log(`ℹ️ On ${currentPath} - checking flow status`)
    }
  }

  // Test 6: Check for potential loop indicators
  const testLoopIndicators = () => {
    console.log('🔄 Checking for loop indicators...')
    
    // Check if we're getting redirected repeatedly
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    const callbackUrl = urlParams.get('callbackUrl')
    
    console.log('❌ Error parameter:', error)
    console.log('🔄 Callback URL:', callbackUrl)
    
    // Check if we're on onboarding but shouldn't be
    if (window.location.pathname === '/onboarding') {
      console.log('⚠️ On onboarding page - checking if this is correct')
      
      // Check if user is actually authenticated
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(session => {
          if (session.user) {
            console.log('✅ User is authenticated, onboarding page is correct')
          } else {
            console.log('❌ User not authenticated, this might be a loop')
          }
        })
        .catch(error => {
          console.log('❌ Error checking session:', error)
        })
    }
  }

  // Run all tests
  const runAllTests = async () => {
    console.log('🚀 Starting infinite loop fix tests...')
    
    testCurrentState()
    testLocalStorage()
    await testSession()
    await testOnboardingStatus()
    testExpectedFlow()
    testLoopIndicators()
    
    console.log('✅ Infinite loop fix tests completed')
  }

  // Export for use in browser console
  if (typeof window !== 'undefined') {
    (window as any).testInfiniteLoopFix = testInfiniteLoopFix
    (window as any).runInfiniteLoopTests = runAllTests
  }

  return {
    testCurrentState,
    testLocalStorage,
    testSession,
    testOnboardingStatus,
    testExpectedFlow,
    testLoopIndicators,
    runAllTests
  }
}

// Auto-run tests if in browser
if (typeof window !== 'undefined') {
  console.log('🧪 Infinite loop fix test utility loaded')
  console.log('💡 Run testInfiniteLoopFix() to test the fix')
  console.log('💡 Run runInfiniteLoopTests() to run all tests')
} 