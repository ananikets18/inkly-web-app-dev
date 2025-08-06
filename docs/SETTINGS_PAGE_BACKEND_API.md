# Settings Page Backend API Endpoints

This document outlines the backend API endpoints required for the settings page functionality.

## Core Endpoints

### 1. Get User Settings
```
GET /api/settings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "account": {
    "email": "user@example.com",
    "username": "username",
    "lastLogin": "2024-01-15T10:30:00Z"
  },
  "notifications": {
    "pushEnabled": false,
    "emailEnabled": false,
    "soundEnabled": false,
    "marketingEnabled": false
  },
  "privacy": {
    "profilePublic": false,
    "showEmail": false,
    "allowMessages": false,
    "analyticsEnabled": false
  },
  "appearance": {
    "theme": "light",
    "fontSize": "medium",
    "reducedMotion": false
  },
  "security": {
    "passwordLastChanged": "2024-01-01T00:00:00Z",
    "sessions": [
      {
        "id": "session-1",
        "device": "Current Device",
        "location": "Unknown Location",
        "lastActive": "2024-01-15T10:30:00Z",
        "isCurrent": true
      }
    ]
  }
}
```

### 2. Update Settings
```
PUT /api/settings/{category}
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `category`: Settings category - "notifications", "privacy", "appearance", "security"

**Request Body:**
```json
{
  "pushEnabled": true,
  "emailEnabled": false,
  "soundEnabled": true,
  "marketingEnabled": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "notifications": {
      "pushEnabled": true,
      "emailEnabled": false,
      "soundEnabled": true,
      "marketingEnabled": false
    }
  }
}
```

### 3. Update Account Information
```
PUT /api/settings/account
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "username": "newusername"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account information updated successfully",
  "data": {
    "email": "newemail@example.com",
    "username": "newusername",
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Change Password
```
PUT /api/settings/password
```

**Request Body:**
```json
{
  "currentPassword": "current_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Additional Endpoints

### 5. Get Active Sessions
```
GET /api/settings/sessions
```

**Response:**
```json
{
  "sessions": [
    {
      "id": "session-1",
      "device": "Chrome on Windows",
      "location": "San Francisco, CA",
      "lastActive": "2024-01-15T10:30:00Z",
      "isCurrent": true,
      "ipAddress": "192.168.1.1"
    },
    {
      "id": "session-2",
      "device": "Safari on iPhone",
      "location": "New York, NY",
      "lastActive": "2024-01-14T15:45:00Z",
      "isCurrent": false,
      "ipAddress": "192.168.1.2"
    }
  ]
}
```

### 6. Revoke Session
```
DELETE /api/settings/sessions/{sessionId}
```

**Response:**
```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

### 7. Export User Data
```
GET /api/settings/export
```

**Query Parameters:**
- `format`: Export format - "json", "csv" (default: "json")

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user_id",
      "name": "User Name",
      "username": "username",
      "email": "user@example.com",
      "bio": "User bio",
      "joinedDate": "2023-01-15"
    },
    "inks": [
      {
        "id": "ink_1",
        "content": "Ink content",
        "createdAt": "2024-01-15T10:30:00Z",
        "views": 1200,
        "reactions": 89
      }
    ],
    "settings": {
      "notifications": {},
      "privacy": {},
      "appearance": {}
    }
  }
}
```

### 8. Delete Account
```
DELETE /api/settings/account
```

**Request Body:**
```json
{
  "password": "user_password",
  "confirmation": "DELETE"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### 9. Get Notification Preferences
```
GET /api/settings/notifications
```

**Response:**
```json
{
  "pushEnabled": false,
  "emailEnabled": false,
  "soundEnabled": false,
  "marketingEnabled": false,
  "types": {
    "newFollower": true,
    "newReaction": true,
    "newReflection": true,
    "achievement": true,
    "system": true
  },
  "schedule": {
    "quietHours": {
      "enabled": false,
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

### 10. Update Notification Preferences
```
PUT /api/settings/notifications
```

**Request Body:**
```json
{
  "pushEnabled": true,
  "emailEnabled": false,
  "soundEnabled": true,
  "marketingEnabled": false,
  "types": {
    "newFollower": true,
    "newReaction": true,
    "newReflection": false,
    "achievement": true,
    "system": true
  },
  "schedule": {
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

## Error Responses

### Unauthorized
```json
{
  "error": "Unauthorized",
  "code": "UNAUTHORIZED",
  "status": 401
}
```

### Invalid Settings
```json
{
  "error": "Invalid settings",
  "code": "INVALID_SETTINGS",
  "status": 400,
  "details": {
    "email": "Invalid email format"
  }
}
```

### Password Mismatch
```json
{
  "error": "Current password is incorrect",
  "code": "INVALID_PASSWORD",
  "status": 400
}
```

### Username Already Exists
```json
{
  "error": "Username already exists",
  "code": "USERNAME_EXISTS",
  "status": 409
}
```

## Authentication

All endpoints require authentication via:
- JWT token in Authorization header: `Authorization: Bearer <token>`
- Session cookie for web requests

## Rate Limiting

- Get settings: 100 requests per minute
- Update settings: 10 requests per minute
- Change password: 5 requests per minute
- Export data: 5 requests per minute
- Delete account: 1 request per hour

## Caching Strategy

- Settings data: Cache for 10 minutes
- Sessions data: Cache for 5 minutes
- Account data: Cache for 30 minutes

## Database Schema Considerations

### User Settings Table
```sql
CREATE TABLE user_settings (
  user_id UUID REFERENCES users(id),
  category VARCHAR(50) NOT NULL,
  settings JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, category)
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  device VARCHAR(255),
  location VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  last_active TIMESTAMP DEFAULT NOW(),
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### User Notifications Table
```sql
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
``` 