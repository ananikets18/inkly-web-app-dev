# Analytics Page Backend API Endpoints

This document outlines the backend API endpoints required for the analytics page functionality.

## Core Endpoints

### 1. Get User Analytics
```
GET /api/analytics?timeRange={timeRange}&includeTopInks={includeTopInks}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `timeRange`: Time range for analytics - "7d", "30d", "90d", "1y" (default: "7d")
- `includeTopInks`: Include top performing inks - "true", "false" (default: "true")

**Response:**
```json
{
  "totalInks": 48,
  "totalViews": 12400,
  "totalReactions": 5678,
  "totalReflections": 890,
  "totalBookmarks": 234,
  "totalImpressions": 45600,
  "averageReadTime": 2.5,
  "totalShares": 123,
  "weeklyGrowth": 15.5,
  "recentChanges": {
    "views": 1200,
    "reactions": 89,
    "reflections": 12,
    "bookmarks": 23,
    "impressions": 4500,
    "shares": 15,
    "growth": 8.2
  },
  "topInks": [
    {
      "id": 1,
      "text": "Ink content text",
      "author": "Author Name",
      "type": "poem",
      "views": 15420,
      "reactions": 1247,
      "reflections": 156,
      "bookmarks": 89,
      "impressions": 25000,
      "shares": 45,
      "readTime": 3.2,
      "recentViews": 1200,
      "recentReactions": 89
    }
  ],
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### 2. Get Analytics by Time Range
```
GET /api/analytics/time-range?range={range}&metric={metric}
```

**Query Parameters:**
- `range`: Time range - "day", "week", "month", "year"
- `metric`: Metric to analyze - "views", "reactions", "reflections", "bookmarks", "shares"

**Response:**
```json
{
  "data": [
    {
      "date": "2024-01-15",
      "value": 1200,
      "change": 15.5
    },
    {
      "date": "2024-01-14",
      "value": 1040,
      "change": 8.2
    }
  ],
  "summary": {
    "total": 15600,
    "average": 1200,
    "growth": 12.3,
    "trend": "up"
  }
}
```

### 3. Get Top Performing Inks
```
GET /api/analytics/top-inks?limit={limit}&timeRange={timeRange}
```

**Query Parameters:**
- `limit`: Number of inks to return (default: 10)
- `timeRange`: Time range - "7d", "30d", "90d", "1y" (default: "30d")

**Response:**
```json
{
  "inks": [
    {
      "id": 1,
      "text": "Ink content text",
      "author": "Author Name",
      "type": "poem",
      "views": 15420,
      "reactions": 1247,
      "reflections": 156,
      "bookmarks": 89,
      "impressions": 25000,
      "shares": 45,
      "readTime": 3.2,
      "recentViews": 1200,
      "recentReactions": 89,
      "performance": {
        "engagementRate": 8.5,
        "viewToReactionRate": 8.1,
        "shareRate": 0.3
      }
    }
  ],
  "summary": {
    "totalInks": 48,
    "averageViews": 258,
    "averageReactions": 118,
    "averageReadTime": 2.5
  }
}
```

### 4. Get Engagement Analytics
```
GET /api/analytics/engagement?timeRange={timeRange}
```

**Response:**
```json
{
  "engagementRate": 8.5,
  "reactionRate": 4.6,
  "reflectionRate": 0.7,
  "bookmarkRate": 1.9,
  "shareRate": 0.3,
  "readCompletionRate": 65.2,
  "timeSpentOnInks": 45.5,
  "bestPerformingHours": [
    {
      "hour": 9,
      "engagement": 12.5
    },
    {
      "hour": 18,
      "engagement": 11.2
    }
  ],
  "bestPerformingDays": [
    {
      "day": "Monday",
      "engagement": 10.8
    },
    {
      "day": "Wednesday",
      "engagement": 9.5
    }
  ]
}
```

### 5. Get Growth Analytics
```
GET /api/analytics/growth?timeRange={timeRange}
```

**Response:**
```json
{
  "followerGrowth": {
    "current": 234,
    "previous": 210,
    "growth": 11.4,
    "trend": "up"
  },
  "viewGrowth": {
    "current": 12400,
    "previous": 10800,
    "growth": 14.8,
    "trend": "up"
  },
  "reactionGrowth": {
    "current": 5678,
    "previous": 4890,
    "growth": 16.1,
    "trend": "up"
  },
  "inkGrowth": {
    "current": 48,
    "previous": 42,
    "growth": 14.3,
    "trend": "up"
  },
  "projections": {
    "nextWeek": {
      "followers": 245,
      "views": 13200,
      "reactions": 5900
    },
    "nextMonth": {
      "followers": 280,
      "views": 15000,
      "reactions": 6800
    }
  }
}
```

## Additional Endpoints

### 6. Get Analytics Export
```
GET /api/analytics/export?format={format}&timeRange={timeRange}
```

**Query Parameters:**
- `format`: Export format - "csv", "json", "pdf" (default: "csv")
- `timeRange`: Time range for export

**Response:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="analytics-export.csv"

Date,Views,Reactions,Reflections,Bookmarks,Shares
2024-01-15,1200,89,12,23,15
2024-01-14,1040,76,8,19,12
...
```

### 7. Get Analytics Insights
```
GET /api/analytics/insights
```

**Response:**
```json
{
  "insights": [
    {
      "type": "performance",
      "title": "High Engagement Time",
      "description": "Your inks perform best when posted between 9 AM and 11 AM",
      "metric": "engagement_rate",
      "value": 12.5,
      "recommendation": "Consider posting more content during peak hours"
    },
    {
      "type": "content",
      "title": "Poetry Performs Best",
      "description": "Your poetry content receives 25% more reactions than other types",
      "metric": "reaction_rate",
      "value": 8.5,
      "recommendation": "Focus on creating more poetry content"
    }
  ],
  "recommendations": [
    "Post more content on Mondays and Wednesdays",
    "Try creating more poetry content",
    "Engage with your audience more frequently"
  ]
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

### Invalid Time Range
```json
{
  "error": "Invalid time range",
  "code": "INVALID_TIME_RANGE",
  "status": 400
}
```

### No Data Available
```json
{
  "error": "No analytics data available",
  "code": "NO_DATA_AVAILABLE",
  "status": 404
}
```

## Authentication

All endpoints require authentication via:
- JWT token in Authorization header: `Authorization: Bearer <token>`
- Session cookie for web requests

## Rate Limiting

- Get analytics: 50 requests per minute
- Get time range data: 100 requests per minute
- Get top inks: 100 requests per minute
- Export data: 10 requests per minute

## Caching Strategy

- Analytics data: Cache for 5 minutes
- Time range data: Cache for 2 minutes
- Top inks: Cache for 10 minutes
- Insights: Cache for 30 minutes

## Database Schema Considerations

### Analytics Table
```sql
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  reactions INTEGER DEFAULT 0,
  reflections INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  read_time_avg DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Ink Analytics Table
```sql
CREATE TABLE ink_analytics (
  id UUID PRIMARY KEY,
  ink_id UUID REFERENCES inks(id),
  views INTEGER DEFAULT 0,
  reactions INTEGER DEFAULT 0,
  reflections INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  read_time_avg DECIMAL(5,2) DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Analytics Events Table
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  ink_id UUID REFERENCES inks(id),
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
``` 