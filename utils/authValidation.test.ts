import { 
  validateUsername, 
  validateFullName, 
  validateBio, 
  validateLocation,
  validateOnboardingData 
} from './authValidation'

describe('Username Validation', () => {
  test('should reject reserved usernames', () => {
    const reservedUsernames = [
      'user', 'admin', 'test', 'demo', 'guest', 'anonymous',
      'about', 'help', 'settings', 'profile', 'create', 'explore',
      'ink', 'inkly', 'api', 'www', 'mail', 'ftp'
    ]

    reservedUsernames.forEach(username => {
      const result = validateUsername(username)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('This username is reserved and cannot be used')
    })
  })

  test('should reject taken usernames', () => {
    const takenUsernames = [
      'john_doe', 'jane_smith', 'alex_wilson', 'sarah_jones'
    ]

    takenUsernames.forEach(username => {
      const result = validateUsername(username)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('This username is already taken')
    })
  })

  test('should reject usernames that start or end with special characters', () => {
    const invalidUsernames = [
      '_username', 'username_', '.username', 'username.',
      '-username', 'username-', '._username', 'username._'
    ]

    invalidUsernames.forEach(username => {
      const result = validateUsername(username)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Username cannot start or end with special characters')
    })
  })

  test('should reject usernames with consecutive special characters', () => {
    const invalidUsernames = [
      'user__name', 'user..name', 'user--name', 'user__name',
      'user..name', 'user--name', 'user._name', 'user_.name'
    ]

    invalidUsernames.forEach(username => {
      const result = validateUsername(username)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Username cannot contain consecutive special characters')
    })
  })

  test('should reject usernames with invalid characters', () => {
    const invalidUsernames = [
      'user@name', 'user#name', 'user$name', 'user%name',
      'user^name', 'user&name', 'user*name', 'user(name',
      'user)name', 'user+name', 'user=name', 'user[name',
      'user]name', 'user{name', 'user}name', 'user|name',
      'user;name', 'user:name', 'user"name', 'user\'name',
      'user,name', 'user<name', 'user>name', 'user?name',
      'user/name', 'user\\name', 'user`name', 'user~name'
    ]

    invalidUsernames.forEach(username => {
      const result = validateUsername(username)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Username can only contain letters, numbers, underscores, dots, and hyphens')
    })
  })

  test('should reject usernames that are too short', () => {
    const shortUsernames = ['a', 'ab', '']
    
    shortUsernames.forEach(username => {
      const result = validateUsername(username)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Username must be at least 3 characters long')
    })
  })

  test('should reject usernames that are too long', () => {
    const longUsername = 'a'.repeat(31)
    const result = validateUsername(longUsername)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Username must be less than 30 characters')
  })

  test('should accept valid usernames', () => {
    const validUsernames = [
      'john_doe', 'jane.smith', 'alex-wilson', 'sarah123',
      'user_name', 'test.user', 'demo-account', 'valid_username',
      'username123', 'user.name', 'test-user', 'demo_account'
    ]

    validUsernames.forEach(username => {
      const result = validateUsername(username)
      expect(result.isValid).toBe(true)
    })
  })

  test('should provide warnings for potentially problematic usernames', () => {
    const problematicUsernames = [
      '123456', '000000', '999999' // Only numbers
    ]

    problematicUsernames.forEach(username => {
      const result = validateUsername(username)
      expect(result.isValid).toBe(true) // Still valid
      expect(result.warnings).toContain('Usernames with only numbers might be hard to remember')
    })
  })
})

describe('Full Name Validation', () => {
  test('should reject empty names', () => {
    const result = validateFullName('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Full name is required')
  })

  test('should reject names that are too short', () => {
    const result = validateFullName('a')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Name must be at least 2 characters long')
  })

  test('should reject names that are too long', () => {
    const longName = 'a'.repeat(51)
    const result = validateFullName(longName)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Name must be less than 50 characters')
  })

  test('should reject names with invalid characters', () => {
    const invalidNames = [
      'John@Doe', 'Jane#Smith', 'Alex$Wilson', 'Sarah%Jones',
      'Mike^Brown', 'Emma&Davis', 'David*Miller', 'Lisa(Garcia)',
      'Chris+Rodriguez', 'Maria=Johnson', 'Tom[Wilson]', 'Anna{Smith}',
      'Bob|Johnson', 'Kate;Davis', 'Mark:Wilson', 'Sara"Johnson',
      'Dan\'Miller', 'Amy,Smith', 'Tim<Wilson>', 'Jen?Johnson'
    ]

    invalidNames.forEach(name => {
      const result = validateFullName(name)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Name can only contain letters, spaces, hyphens, and apostrophes')
    })
  })

  test('should accept valid names', () => {
    const validNames = [
      'John Doe', 'Jane Smith', 'Alex Wilson', 'Sarah Jones',
      'Mike Brown', 'Emma Davis', 'David Miller', 'Lisa Garcia',
      'Chris Rodriguez', 'Maria Johnson', 'Tom Wilson', 'Anna Smith',
      'Bob Johnson', 'Kate Davis', 'Mark Wilson', 'Sara Johnson',
      'Dan Miller', 'Amy Smith', 'Tim Wilson', 'Jen Johnson',
      'Mary-Jane Smith', 'O\'Connor', 'Jean-Pierre', 'Van der Berg'
    ]

    validNames.forEach(name => {
      const result = validateFullName(name)
      expect(result.isValid).toBe(true)
    })
  })
})

describe('Bio Validation', () => {
  test('should accept empty bio', () => {
    const result = validateBio('')
    expect(result.isValid).toBe(true)
  })

  test('should reject bio that is too long', () => {
    const longBio = 'a'.repeat(151)
    const result = validateBio(longBio)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Bio must be less than 150 characters')
  })

  test('should warn for short bio', () => {
    const shortBio = 'Hello'
    const result = validateBio(shortBio)
    expect(result.isValid).toBe(true)
    expect(result.warnings).toContain('Consider adding more details to your bio')
  })

  test('should warn for all caps bio', () => {
    const capsBio = 'THIS IS MY BIO IN ALL CAPS'
    const result = validateBio(capsBio)
    expect(result.isValid).toBe(true)
    expect(result.warnings).toContain('Consider using normal capitalization')
  })
})

describe('Location Validation', () => {
  test('should accept empty location', () => {
    const result = validateLocation('')
    expect(result.isValid).toBe(true)
  })

  test('should reject location that is too long', () => {
    const longLocation = 'a'.repeat(101)
    const result = validateLocation(longLocation)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Location must be less than 100 characters')
  })

  test('should reject location with invalid characters', () => {
    const invalidLocations = [
      'New York@', 'London#', 'Paris$', 'Tokyo%',
      'Berlin^', 'Rome&', 'Madrid*', 'Barcelona(',
      'Amsterdam)', 'Vienna+', 'Prague=', 'Budapest[',
      'Warsaw]', 'Stockholm{', 'Copenhagen}', 'Oslo|',
      'Helsinki;', 'Copenhagen:', 'Dublin"', 'Edinburgh\'',
      'Glasgow<', 'Liverpool>', 'Manchester?', 'Birmingham/',
      'Leeds\\', 'Sheffield`', 'Bristol~'
    ]

    invalidLocations.forEach(location => {
      const result = validateLocation(location)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Location can only contain letters, numbers, spaces, commas, dots, and hyphens')
    })
  })

  test('should accept valid locations', () => {
    const validLocations = [
      'New York, NY', 'London, UK', 'Paris, France', 'Tokyo, Japan',
      'Berlin, Germany', 'Rome, Italy', 'Madrid, Spain', 'Barcelona, Spain',
      'Amsterdam, Netherlands', 'Vienna, Austria', 'Prague, Czech Republic',
      'Budapest, Hungary', 'Warsaw, Poland', 'Stockholm, Sweden',
      'Copenhagen, Denmark', 'Oslo, Norway', 'Helsinki, Finland',
      'Dublin, Ireland', 'Edinburgh, Scotland', 'Glasgow, Scotland',
      'Liverpool, England', 'Manchester, England', 'Birmingham, England',
      'Leeds, England', 'Sheffield, England', 'Bristol, England'
    ]

    validLocations.forEach(location => {
      const result = validateLocation(location)
      expect(result.isValid).toBe(true)
    })
  })
})

describe('Onboarding Data Validation', () => {
  test('should validate complete valid data', () => {
    const validData = {
      username: 'john_doe',
      fullName: 'John Doe',
      bio: 'A passionate writer and thinker',
      location: 'New York, NY'
    }

    const result = validateOnboardingData(validData)
    expect(result.isValid).toBe(true)
  })

  test('should reject data with invalid username', () => {
    const invalidData = {
      username: 'user', // Reserved
      fullName: 'John Doe',
      bio: 'A passionate writer and thinker',
      location: 'New York, NY'
    }

    const result = validateOnboardingData(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('This username is reserved and cannot be used')
  })

  test('should reject data with invalid name', () => {
    const invalidData = {
      username: 'john_doe',
      fullName: 'J@hn D0e', // Invalid characters
      bio: 'A passionate writer and thinker',
      location: 'New York, NY'
    }

    const result = validateOnboardingData(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Name can only contain letters, spaces, hyphens, and apostrophes')
  })

  test('should reject data with invalid bio', () => {
    const invalidData = {
      username: 'john_doe',
      fullName: 'John Doe',
      bio: 'a'.repeat(151), // Too long
      location: 'New York, NY'
    }

    const result = validateOnboardingData(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Bio must be less than 150 characters')
  })

  test('should reject data with invalid location', () => {
    const invalidData = {
      username: 'john_doe',
      fullName: 'John Doe',
      bio: 'A passionate writer and thinker',
      location: 'New York@NY' // Invalid character
    }

    const result = validateOnboardingData(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Location can only contain letters, numbers, spaces, commas, dots, and hyphens')
  })
}) 