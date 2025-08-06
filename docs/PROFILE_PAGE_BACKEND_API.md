# Profile Page Backend API Endpoints

This document outlines the backend API endpoints required for the profile page functionality.

## Core Endpoints

### 1. Get User Profile
```
GET /api/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user_id",
  "name": "User Full Name",
  "username": "username",
  "bio": "User bio text",
  "location": "City, State",
  "joinedDate": "2023-01-15",
  "avatar": "avatar_url",
  "level": 8,
  "xp": 2450,
  "xpToNext": 550,
  "stats": {
    "totalInks": 48,
    "followers": 234,
    "following": 156,
    "totalViews": 12400
  },
  "recentInks": [
    {
      "id": "1",
      "content": "Ink content text",
      "createdAt": "2024-01-15T10:30:00Z",
      "views": 15420,
      "reactions": 1247,
      "reflections": 156,
      "isPinned": true
    }
  ]
}
```

### 2. Update User Profile
```
PUT /api/profile
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "location": "Updated Location",
  "avatar": "new_avatar_url"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "name": "Updated Name",
    "bio": "Updated bio",
    "location": "Updated Location",
    "avatar": "new_avatar_url"
  }
}
```

### 3. Get User's Recent Inks
```
GET /api/profile/recent-inks?page={page}&limit={limit}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 6)

**Response:**
```json
{
  "inks": [
    {
      "id": "1",
      "content": "Ink content text",
      "createdAt": "2024-01-15T10:30:00Z",
      "views": 15420,
      "reactions": 1247,
      "reflections": 156,
      "isPinned": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 18,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### 4. Get User Stats
```
GET /api/profile/stats
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "level": 8,
  "xp": 2450,
  "xpToNext": 550,
  "totalInks": 48,
  "followers": 234,
  "following": 156,
  "totalViews": 12400,
  "totalReactions": 5678,
  "totalReflections": 890,
  "streakDays": 15,
  "bestStreak": 30
}
```

## Additional Endpoints

### 5. Get User Achievements
```
GET /api/profile/achievements
```

**Response:**
```json
{
  "badges": [
    {
      "id": "1",
      "name": "Early Adopter",
      "icon": "🌟",
      "description": "Joined in the first month of Inkly's launch",
      "rarity": "legendary",
      "earned": "March 2023"
    }
  ],
  "stats": {
    "totalBadges": 6,
    "legendaryCount": 1,
    "epicCount": 2,
    "rareCount": 2,
    "commonCount": 1
  }
}
```

### 6. Get User Activity
```
GET /api/profile/activity?page={page}&limit={limit}
```

**Response:**
```json
{
  "activities": [
    {
      "id": "1",
      "type": "ink_created",
      "title": "Created new ink",
      "description": "You created 'The Art of Letting Go'",
      "timestamp": "2024-01-15T10:30:00Z",
      "data": {
        "inkId": "ink_123",
        "inkTitle": "The Art of Letting Go"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrevious": false
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

### Profile Not Found
```json
{
  "error": "Profile not found",
  "code": "PROFILE_NOT_FOUND",
  "status": 404
}
```

### Validation Error
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "status": 400,
  "details": {
    "bio": "Bio must be less than 500 characters"
  }
}
```

## Authentication

All endpoints require authentication via:
- JWT token in Authorization header: `Authorization: Bearer <token>`
- Session cookie for web requests

## Rate Limiting

- Get profile data: 100 requests per minute
- Update profile: 10 requests per minute
- Get recent inks: 200 requests per minute
- Get stats: 50 requests per minute

## Caching Strategy

- Profile data: Cache for 5 minutes
- Recent inks: Cache for 2 minutes
- Stats: Cache for 1 minute
- Achievements: Cache for 10 minutes

## Database Schema Considerations

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  bio TEXT,
  location VARCHAR(100),
  avatar_url VARCHAR(255),
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  joined_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Stats Table
```sql
CREATE TABLE user_stats (
  user_id UUID REFERENCES users(id),
  total_inks INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_reactions INTEGER DEFAULT 0,
  total_reflections INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Activity Table
```sql
CREATE TABLE user_activity (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  activity_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
``` 