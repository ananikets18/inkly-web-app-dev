// Test utility for Google OAuth + Onboarding flow
// This can be run in the browser console to test the complete flow

export const testOAuthFlow = () => {
  console.log('🧪 Testing Google OAuth + Onboarding flow...')

  // Test 1: Check if NextAuth is properly configured
  const testNextAuthConfig = () => {
    console.log('🔧 Testing NextAuth configuration...')
    
    // Check if session is available
    if (typeof window !== 'undefined') {
      const sessionCheck = () => {
        // This will be available if NextAuth is properly set up
        return typeof window !== 'undefined' && 'nextauth' in window
      }
      
      if (sessionCheck()) {
        console.log('✅ NextAuth appears to be configured')
      } else {
        console.log('⚠️ NextAuth configuration not detected')
      }
    }
  }

  // Test 2: Check localStorage for onboarding data
  const testLocalStorage = () => {
    console.log('💾 Testing localStorage functionality...')
    
    try {
      const testData = {
        username: 'testuser',
        name: 'Test User',
        bio: 'Test bio',
        location: 'Test Location'
      }

      localStorage.setItem('inkly-oauth-test', JSON.stringify(testData))
      const retrieved = JSON.parse(localStorage.getItem('inkly-oauth-test') || '{}')

      if (JSON.stringify(testData) === JSON.stringify(retrieved)) {
        console.log('✅ localStorage working correctly')
      } else {
        console.log('❌ localStorage data mismatch')
      }

      localStorage.removeItem('inkly-oauth-test')
    } catch (error) {
      console.log('❌ localStorage test failed:', error)
    }
  }

  // Test 3: Check API endpoints
  const testAPIEndpoints = async () => {
    console.log('🔌 Testing API endpoints...')
    
    const endpoints = [
      '/api/auth/session',
      '/api/user/onboarding-status',
      '/api/onboarding/save',
      '/api/onboarding/complete'
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log(`📊 ${endpoint}: ${response.status} ${response.statusText}`)
        
        if (response.status === 401) {
          console.log(`ℹ️ ${endpoint}: Requires authentication (expected)`)
        } else if (response.ok) {
          console.log(`✅ ${endpoint}: Working correctly`)
        } else {
          console.log(`❌ ${endpoint}: Failed with status ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: Network error - ${error}`)
      }
    }
  }

  // Test 4: Check environment variables (client-side safe check)
  const testEnvironment = () => {
    console.log('🌍 Testing environment configuration...')
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      console.log('✅ Running in browser environment')
      
      // Check if we can access the current URL
      console.log('📍 Current URL:', window.location.href)
      console.log('🔗 Protocol:', window.location.protocol)
      console.log('🏠 Host:', window.location.host)
    } else {
      console.log('❌ Not running in browser environment')
    }
  }

  // Test 5: Check authentication flow simulation
  const testAuthFlow = () => {
    console.log('🔐 Testing authentication flow simulation...')
    
    // Simulate the expected flow
    const flowSteps = [
      '1. User clicks "Continue with Google"',
      '2. Google OAuth popup opens',
      '3. User authenticates with Google',
      '4. Google redirects back to callback URL',
      '5. NextAuth processes the callback',
      '6. User is redirected to /onboarding (if new user)',
      '7. User completes onboarding steps',
      '8. User is redirected to home page'
    ]
    
    console.log('📋 Expected authentication flow:')
    flowSteps.forEach(step => console.log(`   ${step}`))
    
    // Check current page
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      console.log(`📍 Current page: ${currentPath}`)
      
      if (currentPath === '/auth/signin' || currentPath === '/auth/signup') {
        console.log('✅ On auth page - ready for OAuth flow')
      } else if (currentPath === '/onboarding') {
        console.log('✅ On onboarding page - user authenticated')
      } else if (currentPath === '/') {
        console.log('✅ On home page - flow completed')
      } else {
        console.log(`ℹ️ On ${currentPath} - checking flow status`)
      }
    }
  }

  // Test 6: Check middleware functionality
  const testMiddleware = () => {
    console.log('🛡️ Testing middleware functionality...')
    
    // Test protected routes
    const protectedRoutes = [
      '/create',
      '/drafts',
      '/profile',
      '/settings',
      '/analytics'
    ]
    
    console.log('🔒 Protected routes that require authentication:')
    protectedRoutes.forEach(route => {
      console.log(`   ${route}`)
    })
    
    // Test onboarding required routes
    const onboardingRoutes = [
      '/create',
      '/drafts',
      '/profile',
      '/analytics'
    ]
    
    console.log('📋 Routes that require completed onboarding:')
    onboardingRoutes.forEach(route => {
      console.log(`   ${route}`)
    })
  }

  // Test 7: Check session and user data
  const testSessionData = async () => {
    console.log('👤 Testing session and user data...')
    
    try {
      const response = await fetch('/api/auth/session')
      
      if (response.ok) {
        const session = await response.json()
        console.log('📋 Session data:', session)
        
        if (session.user) {
          console.log('✅ User is authenticated')
          console.log('📧 Email:', session.user.email)
          console.log('👤 Name:', session.user.name)
          console.log('🆔 ID:', session.user.id)
          console.log('📊 Onboarding completed:', session.user.onboardingCompleted)
          console.log('📝 Onboarding step:', session.user.onboardingStep)
        } else {
          console.log('❌ No user in session')
        }
      } else {
        console.log('❌ Failed to fetch session')
      }
    } catch (error) {
      console.log('❌ Error testing session:', error)
    }
  }

  // Run all tests
  const runAllTests = async () => {
    console.log('🚀 Starting comprehensive OAuth flow test...')
    
    testNextAuthConfig()
    testLocalStorage()
    testEnvironment()
    testAuthFlow()
    testMiddleware()
    await testAPIEndpoints()
    await testSessionData()
    
    console.log('✅ OAuth flow test completed')
  }

  // Export for use in browser console
  if (typeof window !== 'undefined') {
    (window as any).testOAuthFlow = testOAuthFlow
    (window as any).runOAuthTests = runAllTests
  }

  return {
    testNextAuthConfig,
    testLocalStorage,
    testAPIEndpoints,
    testEnvironment,
    testAuthFlow,
    testMiddleware,
    testSessionData,
    runAllTests
  }
}

// Auto-run tests if in browser
if (typeof window !== 'undefined') {
  console.log('🧪 OAuth flow test utility loaded')
  console.log('💡 Run testOAuthFlow() to test the complete flow')
  console.log('💡 Run runOAuthTests() to run all tests')
} 