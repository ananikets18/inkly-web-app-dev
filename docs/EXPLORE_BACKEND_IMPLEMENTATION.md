# Explore Page Backend Implementation

## Database Schema

### Tables

#### `inks`
```sql
CREATE TABLE inks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  author_name VARCHAR(255) NOT NULL,
  avatar_color VARCHAR(100) DEFAULT 'from-purple-500 to-pink-500',
  views INTEGER DEFAULT 0,
  reading_time VARCHAR(10),
  trending_score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_editor_pick BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'published'
);
```

#### `topics`
```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  gradient VARCHAR(100) NOT NULL,
  description TEXT,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `ink_topics`
```sql
CREATE TABLE ink_topics (
  ink_id UUID REFERENCES inks(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  PRIMARY KEY (ink_id, topic_id)
);
```

#### `news_items`
```sql
CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('feature', 'update', 'spotlight')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  badge VARCHAR(100),
  link VARCHAR(255),
  is_new BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `ink_views`
```sql
CREATE TABLE ink_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ink_id UUID REFERENCES inks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Core Endpoints

#### `GET /api/explore/editor-inks`
```typescript
interface EditorInksResponse {
  inks: InkData[]
  total: number
  hasMore: boolean
}

// Query params
interface EditorInksParams {
  limit?: number // default: 7
  offset?: number // default: 0
}
```

#### `GET /api/explore/trending-inks`
```typescript
interface TrendingInksResponse {
  inks: InkData[]
  total: number
  hasMore: boolean
}

// Query params
interface TrendingInksParams {
  timeFilter: "Day" | "Week" | "Month"
  limit?: number // default: 4
  offset?: number // default: 0
}
```

#### `GET /api/explore/topic-universes`
```typescript
interface TopicUniversesResponse {
  topics: TopicData[]
  total: number
}

// Query params
interface TopicUniversesParams {
  includeEmpty?: boolean // default: false
}
```

#### `GET /api/explore/news`
```typescript
interface NewsResponse {
  news: NewsItem[]
  total: number
}

// Query params
interface NewsParams {
  limit?: number // default: 3
  type?: string
}
```

### Analytics Endpoints

#### `POST /api/explore/track-view`
```typescript
interface TrackViewRequest {
  inkId: string
  userId?: string
  timestamp: Date
}

interface TrackViewResponse {
  success: boolean
}
```

#### `POST /api/explore/track-interaction`
```typescript
interface TrackInteractionRequest {
  type: "ink_click" | "topic_click" | "carousel_nav" | "filter_change"
  inkId?: string
  topicId?: string
  metadata?: object
}

interface TrackInteractionResponse {
  success: boolean
}
```

## Database Queries

### Editor's Inks
```sql
SELECT i.*, u.name as author_name
FROM inks i
LEFT JOIN users u ON i.author_id = u.id
WHERE i.is_editor_pick = TRUE AND i.status = 'published'
ORDER BY i.created_at DESC
LIMIT $1 OFFSET $2;
```

### Trending Inks
```sql
-- Day trending
SELECT i.*, u.name as author_name,
       (i.views * 0.4 + i.trending_score * 0.6) as trending_rank
FROM inks i
LEFT JOIN users u ON i.author_id = u.id
WHERE i.status = 'published' 
  AND i.created_at >= NOW() - INTERVAL '1 day'
ORDER BY trending_rank DESC
LIMIT $1 OFFSET $2;

-- Week trending
SELECT i.*, u.name as author_name,
       (i.views * 0.4 + i.trending_score * 0.6) as trending_rank
FROM inks i
LEFT JOIN users u ON i.author_id = u.id
WHERE i.status = 'published' 
  AND i.created_at >= NOW() - INTERVAL '1 week'
ORDER BY trending_rank DESC
LIMIT $1 OFFSET $2;

-- Month trending
SELECT i.*, u.name as author_name,
       (i.views * 0.4 + i.trending_score * 0.6) as trending_rank
FROM inks i
LEFT JOIN users u ON i.author_id = u.id
WHERE i.status = 'published' 
  AND i.created_at >= NOW() - INTERVAL '1 month'
ORDER BY trending_rank DESC
LIMIT $1 OFFSET $2;
```

### Topic Universes
```sql
SELECT t.*, COUNT(it.ink_id) as count
FROM topics t
LEFT JOIN ink_topics it ON t.id = it.topic_id
LEFT JOIN inks i ON it.ink_id = i.id AND i.status = 'published'
GROUP BY t.id
ORDER BY count DESC, t.name ASC;
```

## Implementation Notes

### Rate Limiting
- **Redis-based rate limiting**
- 100 requests/minute per IP
- 1000 requests/hour per authenticated user

### Caching Strategy
- **Redis cache** for trending inks (5 min TTL)
- **CDN cache** for static content
- **Database query caching** for topic universes

### Performance Optimizations
- **Database indexes** on frequently queried columns
- **Connection pooling** for database connections
- **Async processing** for analytics tracking

### Security
- **Input validation** for all endpoints
- **SQL injection prevention** with parameterized queries
- **CORS configuration** for cross-origin requests
- **Authentication middleware** for protected endpoints

### Monitoring
- **Request logging** for all endpoints
- **Error tracking** with proper error codes
- **Performance monitoring** for response times
- **Analytics tracking** for user interactions

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/inkly_db

# Redis
REDIS_URL=redis://localhost:6379

# API
API_BASE_URL=https://api.inkly.com
CORS_ORIGIN=https://inkly.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_PER_HOUR=1000

# Cache
CACHE_TTL=300
```

## Deployment Checklist

- [ ] Database migrations applied
- [ ] Redis instance configured
- [ ] Environment variables set
- [ ] Rate limiting configured
- [ ] CORS settings applied
- [ ] Monitoring tools configured
- [ ] SSL certificates installed
- [ ] Load balancer configured
- [ ] Health checks implemented
- [ ] Backup strategy in place 