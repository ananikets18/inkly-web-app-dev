# Drafts API Implementation Guide

## 📋 Overview
Complete backend implementation for drafts functionality with REST API, database schema, and security.

---

## 🗄️ Database Schema

```sql
CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  theme INTEGER DEFAULT 0 CHECK (theme >= 0 AND theme <= 20),
  font_size INTEGER DEFAULT 1 CHECK (font_size >= 0 AND font_size <= 3),
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'followers')),
  tags TEXT[] DEFAULT '{}',
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Indexes
CREATE INDEX idx_drafts_user_id ON drafts(user_id);
CREATE INDEX idx_drafts_updated_at ON drafts(updated_at);
CREATE INDEX idx_drafts_visibility ON drafts(visibility);
CREATE INDEX idx_drafts_tags ON drafts USING GIN(tags);
```

---

## 🚀 API Endpoints

### Base URL: `https://api.inkly.com/v1`

### 1. Get All Drafts
```http
GET /drafts?search=query&page=1&limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "drafts": [
      {
        "id": "uuid",
        "content": "Draft content...",
        "theme": 0,
        "fontSize": 1,
        "visibility": "public",
        "tags": ["inspiration"],
        "wordCount": 150,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 2. Get Single Draft
```http
GET /drafts/:id
Authorization: Bearer <token>
```

### 3. Create Draft
```http
POST /drafts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Draft content...",
  "theme": 0,
  "fontSize": 1,
  "visibility": "public",
  "tags": ["inspiration"]
}
```

### 4. Update Draft
```http
PUT /drafts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated content...",
  "theme": 1,
  "fontSize": 2,
  "visibility": "private"
}
```

### 5. Delete Draft
```http
DELETE /drafts/:id
Authorization: Bearer <token>
```

### 6. Bulk Delete
```http
DELETE /drafts/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": ["uuid1", "uuid2"]
}
```

---

## 🔐 Authentication

```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

---

## 🛠️ Implementation

### Controller Example
```typescript
// controllers/drafts.ts
export const getDrafts = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const userId = req.user.userId;

    let query = `
      SELECT * FROM drafts 
      WHERE user_id = $1 AND deleted_at IS NULL
    `;
    const params = [userId];

    if (search) {
      query += ` AND (content ILIKE $2 OR tags::text ILIKE $2)`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, (page - 1) * limit);

    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: {
        drafts: result.rows,
        pagination: { page, limit, total: result.rows.length }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
};
```

### Validation
```typescript
// middleware/validation.ts
import Joi from 'joi';

export const validateDraftCreate = (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().required().min(1).max(5000),
    theme: Joi.number().integer().min(0).max(20).default(0),
    fontSize: Joi.number().integer().min(0).max(3).default(1),
    visibility: Joi.string().valid('public', 'private', 'followers').default('public'),
    tags: Joi.array().items(Joi.string()).default([])
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
```

---

## 🔒 Security

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/v1', limiter);
```

### Input Sanitization
```typescript
// Sanitize content before saving
const sanitizeContent = (content: string): string => {
  return content
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .substring(0, 5000);
};
```

---

## 📊 Performance

### Database Optimization
```sql
-- Composite index for user drafts
CREATE INDEX idx_drafts_user_updated ON drafts(user_id, updated_at) WHERE deleted_at IS NULL;

-- Full-text search
CREATE INDEX idx_drafts_content_search ON drafts USING gin(to_tsvector('english', content));
```

### Caching
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const getCachedDraft = async (id: string) => {
  const cached = await redis.get(`draft:${id}`);
  return cached ? JSON.parse(cached) : null;
};
```

---

## 🧪 Testing

### Unit Tests
```typescript
// tests/drafts.test.ts
describe('Drafts API', () => {
  it('should create a draft', async () => {
    const response = await request(app)
      .post('/api/v1/drafts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test draft',
        theme: 0,
        fontSize: 1,
        visibility: 'public'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.content).toBe('Test draft');
  });
});
```

---

## 🚀 Deployment

### Environment Variables
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inkly
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

### Docker Setup
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📈 Monitoring

### Health Check
```typescript
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    await redis.ping();
    res.json({ status: 'healthy' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy' });
  }
});
```

### Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## ✅ Implementation Checklist

- [ ] Database schema creation
- [ ] Authentication middleware
- [ ] API endpoints (CRUD operations)
- [ ] Input validation & sanitization
- [ ] Error handling & logging
- [ ] Rate limiting & security
- [ ] Database indexes & optimization
- [ ] Caching strategy
- [ ] Unit & integration tests
- [ ] Health checks & monitoring
- [ ] Docker deployment
- [ ] Documentation

This provides a **production-ready, secure, and scalable** backend for drafts functionality. 