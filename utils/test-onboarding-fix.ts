// Test utility to verify onboarding flow works without middleware
// This can be run in the browser console to test the onboarding flow

export const testOnboardingFix = () => {
  console.log('🧪 Testing onboarding flow without middleware...')
  
  // Test 1: Check if we can access onboarding page
  const testOnboardingAccess = () => {
    console.log('📋 Testing onboarding page access...')
    
    // Check if we're on the onboarding page
    const isOnboardingPage = window.location.pathname === '/onboarding'
    console.log('📍 Current page:', window.location.pathname)
    console.log('✅ Onboarding page accessible:', isOnboardingPage)
    
    return isOnboardingPage
  }
  
  // Test 2: Check for redirect loops
  const testRedirectLoops = () => {
    console.log('🔄 Testing for redirect loops...')
    
    // Check if there are any infinite redirects happening
    const currentUrl = window.location.href
    console.log('🔗 Current URL:', currentUrl)
    
    // Check if we're stuck in a loop
    const urlParams = new URLSearchParams(window.location.search)
    const hasRedirectParams = urlParams.has('callbackUrl') || urlParams.has('error')
    console.log('⚠️ Has redirect parameters:', hasRedirectParams)
    
    return !hasRedirectParams
  }
  
  // Test 3: Check authentication state
  const testAuthState = () => {
    console.log('🔐 Testing authentication state...')
    
    // Check if user is authenticated
    const hasSession = !!localStorage.getItem('next-auth.session-token') || 
                      !!sessionStorage.getItem('next-auth.session-token')
    console.log('🔑 Has session token:', hasSession)
    
    return hasSession
  }
  
  // Test 4: Check onboarding status
  const testOnboardingStatus = () => {
    console.log('📊 Testing onboarding status...')
    
    // Check onboarding completion status
    const onboardingComplete = localStorage.getItem('inkly-onboarding-complete')
    console.log('✅ Onboarding complete:', onboardingComplete === 'true')
    
    return onboardingComplete === 'true'
  }
  
  // Test 5: Check page load performance
  const testPagePerformance = () => {
    console.log('⚡ Testing page performance...')
    
    // Check if page loads quickly without middleware delays
    const loadTime = performance.now()
    console.log('⏱️ Page load time:', loadTime.toFixed(2), 'ms')
    
    return loadTime < 5000 // Should load in under 5 seconds
  }
  
  // Run all tests
  const runAllTests = () => {
    console.log('🚀 Starting onboarding fix tests...')
    
    const results = {
      onboardingAccess: testOnboardingAccess(),
      noRedirectLoops: testRedirectLoops(),
      authState: testAuthState(),
      onboardingStatus: testOnboardingStatus(),
      performance: testPagePerformance()
    }
    
    console.log('📊 Test Results:', results)
    
    const allPassed = Object.values(results).every(result => result)
    console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed')
    
    return results
  }
  
  // Make functions available globally
  ;(window as any).testOnboardingFix = testOnboardingFix
  ;(window as any).runOnboardingFixTests = runAllTests
  ;(window as any).testOnboardingAccess = testOnboardingAccess
  ;(window as any).testRedirectLoops = testRedirectLoops
  ;(window as any).testAuthState = testAuthState
  ;(window as any).testOnboardingStatus = testOnboardingStatus
  ;(window as any).testPagePerformance = testPagePerformance
  
  console.log('🧪 Onboarding fix test utility loaded')
  console.log('💡 Run testOnboardingFix() to test the onboarding flow')
  console.log('💡 Run runOnboardingFixTests() to run all tests')
  
  return {
    testOnboardingAccess,
    testRedirectLoops,
    testAuthState,
    testOnboardingStatus,
    testPagePerformance,
    runAllTests
  }
}

// Auto-run the test utility
testOnboardingFix() 