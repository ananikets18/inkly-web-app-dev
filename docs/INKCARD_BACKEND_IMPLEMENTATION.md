# InkCard Backend Implementation Guide

## Overview

The InkCard component is the core content display unit in Inkly, handling user interactions like reactions, bookmarks, following, sharing, and reporting. This document outlines the complete backend implementation needed to support all InkCard features.

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Authentication & Authorization](#authentication--authorization)
4. [Real-time Features](#real-time-features)
5. [Performance Optimizations](#performance-optimizations)
6. [Security Considerations](#security-considerations)
7. [Implementation Phases](#implementation-phases)

## Database Schema

### Core Tables

#### 1. `inks` Table
```sql
CREATE TABLE inks (
  id BIGSERIAL PRIMARY KEY,
  ink_id VARCHAR(50) UNIQUE NOT NULL, -- Human-readable ID like "brave-fox-123"
  content TEXT NOT NULL,
  author_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 1,
  tags TEXT[], -- Array of tags
  content_type VARCHAR(50) DEFAULT 'mixed', -- story, poem, reflection, etc.
  quality_score INTEGER DEFAULT 50, -- 0-100 quality rating
  is_featured BOOLEAN DEFAULT false,
  featured_at TIMESTAMP WITH TIME ZONE,
  moderation_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, flagged
  moderation_notes TEXT,
  created_by_ip INET,
  user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_inks_author_id ON inks(author_id);
CREATE INDEX idx_inks_created_at ON inks(created_at DESC);
CREATE INDEX idx_inks_is_published ON inks(is_published);
CREATE INDEX idx_inks_moderation_status ON inks(moderation_status);
CREATE INDEX idx_inks_content_type ON inks(content_type);
CREATE INDEX idx_inks_ink_id ON inks(ink_id);
```

#### 2. `users` Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
    avatar_url TEXT,
  avatar_color VARCHAR(50) DEFAULT 'from-purple-500 to-pink-500',
    bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_creator BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  is_moderator BOOLEAN DEFAULT false,
  badge_type VARCHAR(20), -- creator, admin, moderator, contributor, writer, author
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    ink_count INTEGER DEFAULT 0,
    total_views BIGINT DEFAULT 0,
    total_echoes BIGINT DEFAULT 0
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_badge_type ON users(badge_type);
CREATE INDEX idx_users_is_verified ON users(is_verified);
```

#### 3. `reactions` Table
```sql
CREATE TABLE reactions (
  id BIGSERIAL PRIMARY KEY,
  ink_id BIGINT REFERENCES inks(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) NOT NULL, -- love, exciting, thought-provoking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ink_id, user_id) -- One reaction per user per ink
);

-- Indexes
CREATE INDEX idx_reactions_ink_id ON reactions(ink_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id);
CREATE INDEX idx_reactions_type ON reactions(reaction_type);
```

#### 4. `bookmarks` Table
```sql
CREATE TABLE bookmarks (
  id BIGSERIAL PRIMARY KEY,
  ink_id BIGINT REFERENCES inks(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  collection_id BIGINT REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ink_id, user_id, collection_id)
);

-- Indexes
CREATE INDEX idx_bookmarks_ink_id ON bookmarks(ink_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_collection_id ON bookmarks(collection_id);
```

#### 5. `collections` Table
```sql
CREATE TABLE collections (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false, -- Default "Saved" collection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_is_public ON collections(is_public);
```

#### 6. `follows` Table
```sql
CREATE TABLE follows (
  id BIGSERIAL PRIMARY KEY,
  follower_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  following_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Indexes
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

#### 7. `reports` Table
```sql
CREATE TABLE reports (
  id BIGSERIAL PRIMARY KEY,
  ink_id BIGINT REFERENCES inks(id) ON DELETE CASCADE,
  reporter_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL,
    description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
  moderator_id BIGINT REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reports_ink_id ON reports(ink_id);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
```

#### 8. `views` Table (for detailed analytics)
```sql
CREATE TABLE views (
  id BIGSERIAL PRIMARY KEY,
  ink_id BIGINT REFERENCES inks(id) ON DELETE CASCADE,
  viewer_id BIGINT REFERENCES users(id), -- NULL for anonymous views
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(100)
);

-- Indexes
CREATE INDEX idx_views_ink_id ON views(ink_id);
CREATE INDEX idx_views_viewed_at ON views(viewed_at);
CREATE INDEX idx_views_viewer_id ON views(viewer_id);
```

#### 9. `shares` Table
```sql
CREATE TABLE shares (
  id BIGSERIAL PRIMARY KEY,
  ink_id BIGINT REFERENCES inks(id) ON DELETE CASCADE,
  sharer_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50), -- twitter, linkedin, whatsapp, copy_link
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_shares_ink_id ON shares(ink_id);
CREATE INDEX idx_shares_sharer_id ON shares(sharer_id);
CREATE INDEX idx_shares_platform ON shares(platform);
```

## API Endpoints

### 1. Ink Management

#### GET `/api/inks`
```typescript
// Get paginated inks with filters
interface GetInksRequest {
  page?: number;
  limit?: number;
  author?: string;
  content_type?: string;
  tags?: string[];
  sort?: 'latest' | 'popular' | 'trending';
  following_only?: boolean;
}

interface GetInksResponse {
  inks: Ink[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
```

#### GET `/api/inks/:inkId`
```typescript
// Get single ink with full details
interface GetInkResponse {
  ink: Ink;
  author: User;
  userReaction?: Reaction;
  isBookmarked: boolean;
  bookmarkCollections: Collection[];
  isFollowingAuthor: boolean;
  echoUsers: EchoUser[];
}
```

#### POST `/api/inks`
```typescript
// Create new ink
interface CreateInkRequest {
  content: string;
  tags?: string[];
  content_type?: string;
  is_published?: boolean;
}

interface CreateInkResponse {
  ink: Ink;
  reading_time: ReadingTime;
  quality_score: number;
}
```

#### PUT `/api/inks/:inkId`
```typescript
// Update ink
interface UpdateInkRequest {
  content?: string;
  tags?: string[];
  content_type?: string;
  is_published?: boolean;
}
```

#### DELETE `/api/inks/:inkId`
```typescript
// Soft delete ink
interface DeleteInkResponse {
  success: boolean;
  message: string;
}
```

### 2. Reactions

#### POST `/api/inks/:inkId/reactions`
```typescript
// Add/update reaction
interface AddReactionRequest {
  reaction_type: 'love' | 'exciting' | 'thought-provoking';
}

interface AddReactionResponse {
  reaction: Reaction;
  total_reactions: number;
  reaction_counts: {
    love: number;
    exciting: number;
    'thought-provoking': number;
  };
}
```

#### DELETE `/api/inks/:inkId/reactions`
```typescript
// Remove reaction
interface RemoveReactionResponse {
  success: boolean;
  total_reactions: number;
  reaction_counts: {
    love: number;
    exciting: number;
    'thought-provoking': number;
  };
}
```

### 3. Bookmarks

#### POST `/api/inks/:inkId/bookmarks`
```typescript
// Add bookmark
interface AddBookmarkRequest {
  collection_id?: number; // If not provided, adds to default collection
}

interface AddBookmarkResponse {
  bookmark: Bookmark;
  collection: Collection;
  total_bookmarks: number;
}
```

#### DELETE `/api/inks/:inkId/bookmarks`
```typescript
// Remove bookmark
interface RemoveBookmarkResponse {
  success: boolean;
  total_bookmarks: number;
}
```

#### GET `/api/inks/:inkId/bookmarks`
```typescript
// Get bookmark status and collections
interface GetBookmarkStatusResponse {
  is_bookmarked: boolean;
  collections: Collection[];
  total_bookmarks: number;
}
```

### 4. Collections

#### GET `/api/collections`
```typescript
// Get user's collections
interface GetCollectionsResponse {
  collections: Collection[];
  default_collection: Collection;
}
```

#### POST `/api/collections`
```typescript
// Create new collection
interface CreateCollectionRequest {
  name: string;
  description?: string;
  is_public?: boolean;
}

interface CreateCollectionResponse {
  collection: Collection;
}
```

#### PUT `/api/collections/:collectionId`
```typescript
// Update collection
interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  is_public?: boolean;
}
```

#### DELETE `/api/collections/:collectionId`
```typescript
// Delete collection (moves bookmarks to default)
interface DeleteCollectionResponse {
  success: boolean;
  moved_bookmarks: number;
}
```

### 5. Following

#### POST `/api/users/:username/follow`
```typescript
// Follow user
interface FollowUserResponse {
  success: boolean;
  is_following: boolean;
  follower_count: number;
}
```

#### DELETE `/api/users/:username/follow`
```typescript
// Unfollow user
interface UnfollowUserResponse {
  success: boolean;
  is_following: boolean;
  follower_count: number;
}
```

#### GET `/api/users/:username/following`
```typescript
// Get following status
interface GetFollowingStatusResponse {
  is_following: boolean;
  follower_count: number;
  following_count: number;
}
```

### 6. Reports

#### POST `/api/inks/:inkId/reports`
```typescript
// Report ink
interface ReportInkRequest {
  reason: string;
  description?: string;
}

interface ReportInkResponse {
  success: boolean;
  report_id: number;
}
```

### 7. Views

#### POST `/api/inks/:inkId/views`
```typescript
// Record view
interface RecordViewRequest {
  session_id?: string;
  referrer?: string;
}

interface RecordViewResponse {
  success: boolean;
  view_count: number;
}
```

### 8. Shares

#### POST `/api/inks/:inkId/shares`
```typescript
// Record share
interface RecordShareRequest {
  platform: 'twitter' | 'linkedin' | 'whatsapp' | 'copy_link';
}

interface RecordShareResponse {
  success: boolean;
  share_count: number;
}
```

## Authentication & Authorization

### JWT Token Structure
```typescript
interface JWTPayload {
  user_id: number;
  username: string;
  email: string;
  is_verified: boolean;
  badge_type?: string;
  iat: number;
  exp: number;
}
```

### Authorization Middleware
```typescript
// Middleware to check user permissions
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Check if user can modify ink
const canModifyInk = (req: Request, res: Response, next: NextFunction) => {
  const { inkId } = req.params;
  const userId = req.user.user_id;
  
  const ink = await getInkById(inkId);
  if (!ink || (ink.author_id !== userId && !req.user.is_admin)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  next();
};
```

## Real-time Features

### WebSocket Events
```typescript
// Client-side WebSocket events
interface WebSocketEvents {
  'reaction:added': {
    ink_id: number;
    user_id: number;
    reaction_type: string;
    total_reactions: number;
  };
  
  'reaction:removed': {
    ink_id: number;
    user_id: number;
    total_reactions: number;
  };
  
  'bookmark:added': {
    ink_id: number;
    user_id: number;
    collection_id: number;
    total_bookmarks: number;
  };
  
  'bookmark:removed': {
    ink_id: number;
    user_id: number;
    total_bookmarks: number;
  };
  
  'follow:added': {
    follower_id: number;
    following_id: number;
    follower_count: number;
  };
  
  'follow:removed': {
    follower_id: number;
    following_id: number;
    follower_count: number;
  };
  
  'view:recorded': {
    ink_id: number;
    view_count: number;
  };
  
  'share:recorded': {
    ink_id: number;
    platform: string;
    share_count: number;
  };
}
```

### Redis for Caching
```typescript
// Cache structure for performance
interface CacheKeys {
  `ink:${inkId}`: Ink;
  `ink:${inkId}:reactions`: ReactionCounts;
  `ink:${inkId}:bookmarks`: number;
  `ink:${inkId}:views`: number;
  `user:${userId}:bookmarks`: Bookmark[];
  `user:${userId}:following`: boolean[];
  `user:${userId}:reactions`: Reaction[];
}
```

## Performance Optimizations

### 1. Database Optimizations
```sql
-- Materialized views for analytics
CREATE MATERIALIZED VIEW ink_analytics AS
SELECT 
  i.id,
  i.ink_id,
  i.view_count,
  i.share_count,
  COUNT(r.id) as reaction_count,
  COUNT(DISTINCT b.user_id) as bookmark_count,
  COUNT(DISTINCT f.follower_id) as author_followers
FROM inks i
LEFT JOIN reactions r ON i.id = r.ink_id
LEFT JOIN bookmarks b ON i.id = b.ink_id
LEFT JOIN users u ON i.author_id = u.id
LEFT JOIN follows f ON u.id = f.following_id
WHERE i.is_published = true AND i.is_deleted = false
GROUP BY i.id, i.ink_id, i.view_count, i.share_count;

-- Refresh every 5 minutes
REFRESH MATERIALIZED VIEW ink_analytics;
```

### 2. API Response Optimization
```typescript
// Optimized ink response with all related data
interface OptimizedInkResponse {
  ink: {
    id: number;
    ink_id: string;
    content: string;
    created_at: string;
    view_count: number;
    share_count: number;
    reading_time: ReadingTime;
    author: {
      id: number;
      username: string;
      display_name: string;
      avatar_url?: string;
      avatar_color: string;
      badge_type?: string;
      is_verified: boolean;
      follower_count: number;
    };
  };
  user_interactions: {
    reaction?: Reaction;
    is_bookmarked: boolean;
    bookmark_collections: Collection[];
    is_following_author: boolean;
  };
  analytics: {
    reaction_counts: ReactionCounts;
    bookmark_count: number;
    echo_users: EchoUser[];
  };
}
```

### 3. Caching Strategy
```typescript
// Redis caching implementation
class InkCache {
  private redis: Redis;
  
  async getInk(inkId: string): Promise<Ink | null> {
    const cached = await this.redis.get(`ink:${inkId}`);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const ink = await this.fetchInkFromDB(inkId);
    if (ink) {
      await this.redis.setex(`ink:${inkId}`, 300, JSON.stringify(ink)); // 5 min cache
    }
    return ink;
  }
  
  async invalidateInk(inkId: string): Promise<void> {
    await this.redis.del(`ink:${inkId}`);
    await this.redis.del(`ink:${inkId}:reactions`);
    await this.redis.del(`ink:${inkId}:bookmarks`);
  }
}
```

## Security Considerations

### 1. Rate Limiting
```typescript
// Rate limiting for API endpoints
const rateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Specific limits for actions
const reactionRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 reactions per minute
  message: 'Too many reactions'
});
```

### 2. Input Validation
```typescript
// Content validation middleware
const validateInkContent = (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;
  
  if (!content || content.trim().length < 10) {
    return res.status(400).json({ error: 'Content too short' });
  }
  
  if (content.length > 5000) {
    return res.status(400).json({ error: 'Content too long' });
  }
  
  // Check for inappropriate content
  if (containsProfanity(content)) {
    return res.status(400).json({ error: 'Content contains inappropriate language' });
  }
  
  next();
};
```

### 3. SQL Injection Prevention
```typescript
// Use parameterized queries
const getInkById = async (inkId: string): Promise<Ink | null> => {
  const query = `
    SELECT i.*, u.username, u.display_name, u.avatar_url, u.avatar_color, u.badge_type, u.is_verified
    FROM inks i
    JOIN users u ON i.author_id = u.id
    WHERE i.ink_id = $1 AND i.is_published = true AND i.is_deleted = false
  `;
  
  const result = await pool.query(query, [inkId]);
  return result.rows[0] || null;
};
```

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Database schema setup
- [ ] Basic CRUD operations for inks
- [ ] User authentication system
- [ ] Basic API endpoints

### Phase 2: Interactions (Week 3-4)
- [ ] Reactions system
- [ ] Bookmarks and collections
- [ ] Following system
- [ ] View tracking

### Phase 3: Advanced Features (Week 5-6)
- [ ] Reporting system
- [ ] Real-time updates (WebSocket)
- [ ] Analytics and caching
- [ ] Performance optimizations

### Phase 4: Polish & Security (Week 7-8)
- [ ] Rate limiting
- [ ] Input validation
- [ ] Security hardening
- [ ] Testing and documentation

## Testing Strategy

### Unit Tests
```typescript
// Example test for reaction functionality
describe('Reaction API', () => {
  it('should add reaction to ink', async () => {
    const response = await request(app)
      .post('/api/inks/123/reactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ reaction_type: 'love' });
    
    expect(response.status).toBe(200);
    expect(response.body.reaction.reaction_type).toBe('love');
  });
});
```

### Integration Tests
```typescript
// Test complete user journey
describe('InkCard User Journey', () => {
  it('should handle complete interaction flow', async () => {
    // 1. Create ink
    const ink = await createInk(testUser, testContent);
    
    // 2. Add reaction
    const reaction = await addReaction(testUser2, ink.id, 'love');
    
    // 3. Bookmark ink
    const bookmark = await addBookmark(testUser2, ink.id);
    
    // 4. Follow author
    const follow = await followUser(testUser2, ink.author_id);
    
    // 5. Verify all interactions are recorded
    const inkWithInteractions = await getInkWithInteractions(ink.id, testUser2.id);
    expect(inkWithInteractions.user_interactions.reaction).toBeDefined();
    expect(inkWithInteractions.user_interactions.is_bookmarked).toBe(true);
    expect(inkWithInteractions.user_interactions.is_following_author).toBe(true);
  });
});
```

## Monitoring & Analytics

### Key Metrics to Track
- Ink creation rate
- Reaction engagement rate
- Bookmark save rate
- Follow conversion rate
- View-to-interaction ratio
- API response times
- Error rates

### Logging Strategy
```typescript
// Structured logging for analytics
interface InteractionLog {
  event_type: 'reaction_added' | 'bookmark_added' | 'follow_added' | 'view_recorded';
  user_id: number;
  ink_id: number;
  timestamp: string;
  metadata: Record<string, any>;
}

// Log all interactions for analytics
const logInteraction = async (log: InteractionLog) => {
  await analyticsService.log(log);
  await redis.lpush('interaction_logs', JSON.stringify(log));
};
```

This comprehensive backend implementation will support all InkCard features with proper performance, security, and scalability considerations. 