// Test utility to verify auth-protected menu items are hidden
// This can be run in the browser console to test the authentication menu behavior

export const testAuthMenu = () => {
  console.log('🧪 Testing auth-protected menu items...')
  
  // Test 1: Check if auth-protected items are hidden when not authenticated
  const testProtectedItemsHidden = () => {
    console.log('📋 Testing protected menu items visibility...')
    
    // Check if user is authenticated
    const isAuthenticated = !!localStorage.getItem('next-auth.session-token') || 
                           !!sessionStorage.getItem('next-auth.session-token')
    console.log('🔑 Is authenticated:', isAuthenticated)
    
    // Check for auth-protected menu items
    const protectedItems = [
      'Create',
      'Studio', 
      'Profile',
      'Settings',
      'Notifications',
      'Analytics'
    ]
    
    // Check if these items are visible in the DOM
    const visibleProtectedItems = protectedItems.filter(item => {
      const elements = document.querySelectorAll(`[aria-label*="${item}"], [title*="${item}"]`)
      return elements.length > 0
    })
    
    console.log('🔒 Protected items found:', visibleProtectedItems)
    
    if (isAuthenticated) {
      console.log('✅ User is authenticated - protected items should be visible')
      return visibleProtectedItems.length > 0
    } else {
      console.log('❌ User is not authenticated - protected items should be hidden')
      return visibleProtectedItems.length === 0
    }
  }
  
  // Test 2: Check if public items are always visible
  const testPublicItemsVisible = () => {
    console.log('📋 Testing public menu items visibility...')
    
    const publicItems = [
      'Home',
      'Explore',
      'Help',
      'About'
    ]
    
    const visiblePublicItems = publicItems.filter(item => {
      const elements = document.querySelectorAll(`[aria-label*="${item}"], [title*="${item}"]`)
      return elements.length > 0
    })
    
    console.log('🌐 Public items found:', visiblePublicItems)
    console.log('✅ Public items should always be visible')
    
    return visiblePublicItems.length > 0
  }
  
  // Test 3: Check authentication state in context
  const testAuthContext = () => {
    console.log('🔐 Testing authentication context...')
    
    // Try to access auth context from window (if available)
    const authContext = (window as any).__AUTH_CONTEXT__
    if (authContext) {
      console.log('📊 Auth context found:', authContext)
      return true
    } else {
      console.log('⚠️ Auth context not found in window object')
      return false
    }
  }
  
  // Test 4: Check for sign in/out buttons
  const testAuthButtons = () => {
    console.log('🔘 Testing authentication buttons...')
    
    const isAuthenticated = !!localStorage.getItem('next-auth.session-token') || 
                           !!sessionStorage.getItem('next-auth.session-token')
    
    const signInButton = document.querySelector('[aria-label*="Sign In"], [title*="Sign In"]')
    const signOutButton = document.querySelector('[aria-label*="Sign Out"], [title*="Sign Out"]')
    const createButton = document.querySelector('[aria-label*="Create"], [title*="Create"]')
    
    console.log('🔑 Sign In button found:', !!signInButton)
    console.log('🚪 Sign Out button found:', !!signOutButton)
    console.log('➕ Create button found:', !!createButton)
    
    if (isAuthenticated) {
      console.log('✅ Authenticated user should see Sign Out and Create buttons')
      return !signInButton && (signOutButton || createButton)
    } else {
      console.log('❌ Unauthenticated user should see Sign In button')
      return signInButton && !signOutButton && !createButton
    }
  }
  
  // Test 5: Check navigation structure
  const testNavigationStructure = () => {
    console.log('🧭 Testing navigation structure...')
    
    const sideNav = document.querySelector('aside[role="complementary"]')
    const bottomNav = document.querySelector('nav[role="navigation"]')
    const header = document.querySelector('header[role="banner"]')
    
    console.log('📱 Side navigation found:', !!sideNav)
    console.log('📱 Bottom navigation found:', !!bottomNav)
    console.log('📱 Header found:', !!header)
    
    return sideNav || bottomNav || header
  }
  
  // Run all tests
  const runAllTests = () => {
    console.log('🚀 Starting auth menu tests...')
    
    const results = {
      protectedItemsHidden: testProtectedItemsHidden(),
      publicItemsVisible: testPublicItemsVisible(),
      authContext: testAuthContext(),
      authButtons: testAuthButtons(),
      navigationStructure: testNavigationStructure()
    }
    
    console.log('📊 Test Results:', results)
    
    const allPassed = Object.values(results).every(result => result)
    console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed')
    
    return results
  }
  
  // Make functions available globally
  ;(window as any).testAuthMenu = testAuthMenu
  ;(window as any).runAuthMenuTests = runAllTests
  ;(window as any).testProtectedItemsHidden = testProtectedItemsHidden
  ;(window as any).testPublicItemsVisible = testPublicItemsVisible
  ;(window as any).testAuthContext = testAuthContext
  ;(window as any).testAuthButtons = testAuthButtons
  ;(window as any).testNavigationStructure = testNavigationStructure
  
  console.log('🧪 Auth menu test utility loaded')
  console.log('💡 Run testAuthMenu() to test the auth menu behavior')
  console.log('💡 Run runAuthMenuTests() to run all tests')
  
  return {
    testProtectedItemsHidden,
    testPublicItemsVisible,
    testAuthContext,
    testAuthButtons,
    testNavigationStructure,
    runAllTests
  }
}

// Auto-run the test utility
testAuthMenu() 