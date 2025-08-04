# Username Page Backend API

## Overview
API endpoints for user profile pages and ink management.

## Base URL
```
https://api.inkly.app/v1
```

## Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Get User Profile
```http
GET /users/{username}
```

**Response:**
```json
{
  "id": "user_123",
  "username": "sarah_mitchell",
  "name": "Sarah Mitchell",
  "bio": "Creator of beautiful words and digital dreams...",
  "location": "San Francisco, CA",
  "joinedDate": "March 2023",
  "avatar": "https://...",
  "avatarColor": "from-purple-500 to-pink-500",
  "pronouns": "she/her",
  "level": 12,
  "xp": 2840,
  "xpToNext": 160,
  "externalLinks": [
    {
      "url": "https://twitter.com/sarah_mitchell",
      "label": "Twitter"
    }
  ],
  "stats": {
    "echoes": 1240,
    "followers": 892,
    "following": 234,
    "totalInks": 156
  },
  "badges": [
    {
      "id": 1,
      "name": "Early Adopter",
      "icon": "🌟",
      "description": "Joined in the first month",
      "rarity": "legendary",
      "earned": "March 2023"
    }
  ]
}
```

### Get User Inks
```http
GET /users/{username}/inks?page=1&limit=12&type=created
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `type` (string): "created" | "pinned" | "all"

**Response:**
```json
{
  "inks": [
    {
      "id": 1,
      "inkId": "ink_abc123",
      "content": "The moonlight danced on the edges of her soul...",
      "author": "Sarah Mitchell",
      "avatarColor": "from-purple-500 to-pink-500",
      "readingTime": {
        "text": "2 min read",
        "minutes": 2
      },
      "views": 1240,
      "reactionCount": 45,
      "bookmarkCount": 23,
      "echoCount": 12,
      "createdAt": "2024-01-15T10:30:00Z",
      "isPinned": true,
      "shareUrl": "https://inkly.app/ink/ink_abc123"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 156,
    "hasMore": true
  }
}
```

### Follow/Unfollow User
```http
POST /users/{username}/follow
DELETE /users/{username}/follow
```

**Response:**
```json
{
  "success": true,
  "isFollowing": true,
  "followerCount": 893
}
```

### Pin/Unpin Ink
```http
POST /users/{username}/inks/{inkId}/pin
DELETE /users/{username}/inks/{inkId}/pin
```

**Response:**
```json
{
  "success": true,
  "isPinned": true,
  "pinnedCount": 3
}
```

### Get User Achievements
```http
GET /users/{username}/achievements
```

**Response:**
```json
{
  "badges": [
    {
      "id": 1,
      "name": "Early Adopter",
      "icon": "🌟",
      "description": "Joined in the first month",
      "rarity": "legendary",
      "earned": "March 2023"
    }
  ],
  "progress": {
    "level": 12,
    "xp": 2840,
    "xpToNext": 160,
    "totalBadges": 6
  }
}
```

## Error Responses

### 404 - User Not Found
```json
{
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

### 401 - Unauthorized
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

### 403 - Forbidden
```json
{
  "error": "Insufficient permissions",
  "code": "FORBIDDEN"
}
```

### 429 - Rate Limited
```json
{
  "error": "Too many requests",
  "code": "RATE_LIMITED",
  "retryAfter": 60
}
```

## Rate Limits
- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 1000 requests/minute
- **Follow/Unfollow**: 10 requests/minute per user

## Caching
- User profiles: 5 minutes
- User inks: 2 minutes
- Achievements: 10 minutes

## Webhooks
```http
POST /webhooks/user-updated
```

**Payload:**
```json
{
  "event": "user.updated",
  "userId": "user_123",
  "username": "sarah_mitchell",
  "changes": ["bio", "avatar"],
  "timestamp": "2024-01-15T10:30:00Z"
}
``` 