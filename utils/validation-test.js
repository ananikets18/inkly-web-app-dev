// Simple test script to verify validation functions
const { 
  validateUsername, 
  validateFullName, 
  validateBio, 
  validateLocation,
  validateOnboardingData 
} = require('./authValidation')

console.log('🧪 Testing Validation Functions...\n')

// Test username validation
console.log('📝 Testing Username Validation:')

// Test reserved usernames
const reservedUsernames = ['user', 'admin', 'test', 'demo', 'guest', 'anonymous']
reservedUsernames.forEach(username => {
  const result = validateUsername(username)
  console.log(`${username}: ${result.isValid ? '✅ PASS' : '❌ FAIL'} - ${result.errors[0] || 'Valid'}`)
})

// Test taken usernames
const takenUsernames = ['john_doe', 'jane_smith', 'alex_wilson']
takenUsernames.forEach(username => {
  const result = validateUsername(username)
  console.log(`${username}: ${result.isValid ? '✅ PASS' : '❌ FAIL'} - ${result.errors[0] || 'Valid'}`)
})

// Test valid usernames
const validUsernames = ['john_doe_valid', 'jane.smith', 'alex-wilson', 'sarah123']
validUsernames.forEach(username => {
  const result = validateUsername(username)
  console.log(`${username}: ${result.isValid ? '✅ PASS' : '❌ FAIL'} - ${result.errors[0] || 'Valid'}`)
})

console.log('\n📝 Testing Full Name Validation:')

// Test invalid names
const invalidNames = ['', 'a', 'John@Doe', 'Jane#Smith']
invalidNames.forEach(name => {
  const result = validateFullName(name)
  console.log(`"${name}": ${result.isValid ? '✅ PASS' : '❌ FAIL'} - ${result.errors[0] || 'Valid'}`)
})

// Test valid names
const validNames = ['John Doe', 'Jane Smith', 'Alex Wilson', 'Mary-Jane Smith']
validNames.forEach(name => {
  const result = validateFullName(name)
  console.log(`"${name}": ${result.isValid ? '✅ PASS' : '❌ FAIL'} - ${result.errors[0] || 'Valid'}`)
})

console.log('\n📝 Testing Bio Validation:')

// Test bio validation
const bios = ['', 'Short', 'A'.repeat(151), 'THIS IS ALL CAPS']
bios.forEach(bio => {
  const result = validateBio(bio)
  console.log(`"${bio.substring(0, 20)}...": ${result.isValid ? '✅ PASS' : '❌ FAIL'} - ${result.errors[0] || result.warnings[0] || 'Valid'}`)
})

console.log('\n📝 Testing Location Validation:')

// Test location validation
const locations = ['', 'New York, NY', 'London@UK', 'A'.repeat(101)]
locations.forEach(location => {
  const result = validateLocation(location)
  console.log(`"${location.substring(0, 20)}...": ${result.isValid ? '✅ PASS' : '❌ FAIL'} - ${result.errors[0] || 'Valid'}`)
})

console.log('\n📝 Testing Complete Onboarding Data:')

// Test complete onboarding data
const testData = {
  username: 'user', // Reserved - should fail
  fullName: 'John Doe',
  bio: 'A passionate writer',
  location: 'New York, NY'
}

const result = validateOnboardingData(testData)
console.log(`Complete data test: ${result.isValid ? '✅ PASS' : '❌ FAIL'}`)
if (!result.isValid) {
  console.log('Errors:', result.errors)
}
if (result.warnings.length > 0) {
  console.log('Warnings:', result.warnings)
}

console.log('\n✅ Validation tests completed!') 