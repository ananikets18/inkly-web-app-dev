// Simple test utility for onboarding flow
// This can be run in the browser console to test onboarding functionality

export const testOnboardingFlow = () => {
  console.log('🧪 Testing onboarding flow...')
  
  // Test localStorage functionality
  try {
    const testData = {
      username: 'testuser',
      name: 'Test User',
      bio: 'Test bio',
      location: 'Test Location'
    }
    
    localStorage.setItem('inkly-onboarding-test', JSON.stringify(testData))
    const retrieved = JSON.parse(localStorage.getItem('inkly-onboarding-test') || '{}')
    
    if (JSON.stringify(testData) === JSON.stringify(retrieved)) {
      console.log('✅ localStorage working correctly')
    } else {
      console.log('❌ localStorage data mismatch')
    }
    
    localStorage.removeItem('inkly-onboarding-test')
  } catch (error) {
    console.log('❌ localStorage test failed:', error)
  }
  
  // Test API endpoints
  const testAPIEndpoints = async () => {
    try {
      // Test onboarding status endpoint
      const statusResponse = await fetch('/api/user/onboarding-status')
      console.log('📊 Onboarding status response:', statusResponse.status)
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        console.log('✅ Onboarding status API working:', statusData)
      } else {
        console.log('❌ Onboarding status API failed:', statusResponse.status)
      }
    } catch (error) {
      console.log('❌ API test failed:', error)
    }
  }
  
  testAPIEndpoints()
  
  // Test validation functions
  const testValidation = () => {
    const { validateUsername } = require('@/utils/authValidation')
    
    const testCases = [
      { username: 'test', expected: true },
      { username: 'test-user', expected: true },
      { username: 'test_user', expected: true },
      { username: 'test.user', expected: true },
      { username: 't', expected: false }, // too short
      { username: 'a'.repeat(31), expected: false }, // too long
      { username: 'test@user', expected: false }, // invalid chars
      { username: '-test', expected: false }, // starts with dash
      { username: 'test-', expected: false }, // ends with dash
    ]
    
    testCases.forEach(({ username, expected }) => {
      const result = validateUsername(username)
      const passed = result.isValid === expected
      console.log(`${passed ? '✅' : '❌'} Username "${username}": ${result.isValid} (expected: ${expected})`)
    })
  }
  
  testValidation()
  
  console.log('🧪 Onboarding flow test completed')
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testOnboardingFlow = testOnboardingFlow
} 