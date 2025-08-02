# Studio API Endpoints

This document outlines the API endpoints required for the Studio functionality.

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

## Endpoints

### 1. Get Studio Dashboard Data
**GET** `/api/studio/dashboard`

Returns comprehensive studio data including stats, recent inks, and drafts.

**Response:**
```json
{
  "totalInks": 24,
  "totalDrafts": 8,
  "totalWords": 15420,
  "weeklyGoal": 5,
  "weeklyProgress": 3,
  "recentInks": [
    {
      "id": "string",
      "content": "string",
      "views": 1247,
      "reactions": 89,
      "reflections": 12,
      "createdAt": "2 days ago",
      "isPinned": false
    }
  ],
  "recentDrafts": [
    {
      "id": "string",
      "content": "string",
      "wordCount": 847,
      "lastModified": "2 hours ago"
    }
  ]
}
```

### 2. Update Weekly Goal
**PUT** `/api/studio/goal`

Updates the user's weekly writing goal.

**Request Body:**
```json
{
  "weeklyGoal": 5
}
```

**Response:**
```json
{
  "weeklyGoal": 5,
  "weeklyProgress": 3
}
```

### 3. Delete Ink
**DELETE** `/api/inks/{inkId}`

Deletes a specific ink by ID.

**Response:**
```json
{
  "success": true
}
```

### 4. Publish Draft
**POST** `/api/drafts/{draftId}/publish`

Publishes a draft as a new ink.

**Response:**
```json
{
  "inkId": "string",
  "success": true
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a message field:
```json
{
  "message": "Error description"
}
```

## Implementation Notes

1. **Authentication**: Implement proper JWT token validation
2. **Rate Limiting**: Consider implementing rate limiting for write operations
3. **Caching**: Dashboard data can be cached for better performance
4. **Validation**: Validate all input data before processing
5. **Logging**: Log all operations for audit purposes 