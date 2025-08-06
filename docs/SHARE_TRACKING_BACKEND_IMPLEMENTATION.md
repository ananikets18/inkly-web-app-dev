# Share Tracking Backend Implementation

## Overview
This document outlines the backend implementation for tracking share events in the Inkly application, based on the current share functionality already implemented in the frontend.

## Current Frontend Implementation

### Share Flow
1. **InkCard** → **MoreOptionsDropdown** → **ShareModal**
2. **Share Options**: X (Twitter), LinkedIn, WhatsApp
3. **Event Tracking**: `handleButtonClick("click")` in homepage

### Current Share URLs
```typescript
// Base URL structure
shareUrl = `/ink/${inkId}` // e.g., "/ink/123"

// Social platform URLs
const links = {
  twitter: `https://x.com/intent/tweet?url=${encoded}`,
  linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}`,
  whatsapp: `https://api.whatsapp.com/send?text=${encoded}`,
};
```

## Backend Implementation

### 1. Database Schema

```sql
-- Share events table
CREATE TABLE share_events (
  id SERIAL PRIMARY KEY,
  ink_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  platform VARCHAR(20) NOT NULL, -- 'twitter', 'linkedin', 'whatsapp', 'copy'
  share_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_share_events_ink_id ON share_events(ink_id);
CREATE INDEX idx_share_events_user_id ON share_events(user_id);
CREATE INDEX idx_share_events_platform ON share_events(platform);
CREATE INDEX idx_share_events_created_at ON share_events(created_at);
```

### 2. API Endpoints

#### POST /api/shares/track
```typescript
interface ShareEventRequest {
  inkId: string;
  platform: 'twitter' | 'linkedin' | 'whatsapp' | 'copy';
  shareUrl: string;
}

interface ShareEventResponse {
  success: boolean;
  message: string;
  shareId?: string;
}
```

#### GET /api/shares/analytics/:inkId
```typescript
interface ShareAnalyticsResponse {
  inkId: string;
  totalShares: number;
  platformBreakdown: {
    twitter: number;
    linkedin: number;
    whatsapp: number;
    copy: number;
  };
  recentShares: Array<{
    platform: string;
    timestamp: string;
    userId: string;
  }>;
}
```

### 3. Backend Implementation (Node.js/Express)

```typescript
// routes/shares.ts
import express from 'express';
import { pool } from '../db/connection';

const router = express.Router();

// Track share event
router.post('/track', async (req, res) => {
  try {
    const { inkId, platform, shareUrl } = req.body;
    const userId = req.user?.id || 'anonymous';
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    const query = `
      INSERT INTO share_events (ink_id, user_id, platform, share_url, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const result = await pool.query(query, [
      inkId,
      userId,
      platform,
      shareUrl,
      ipAddress,
      userAgent
    ]);

    res.json({
      success: true,
      message: 'Share tracked successfully',
      shareId: result.rows[0].id
    });

  } catch (error) {
    console.error('Share tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track share event'
    });
  }
});

// Get share analytics for an ink
router.get('/analytics/:inkId', async (req, res) => {
  try {
    const { inkId } = req.params;

    // Get total shares
    const totalQuery = `
      SELECT COUNT(*) as total_shares
      FROM share_events
      WHERE ink_id = $1
    `;
    const totalResult = await pool.query(totalQuery, [inkId]);

    // Get platform breakdown
    const platformQuery = `
      SELECT platform, COUNT(*) as count
      FROM share_events
      WHERE ink_id = $1
      GROUP BY platform
    `;
    const platformResult = await pool.query(platformQuery, [inkId]);

    // Get recent shares
    const recentQuery = `
      SELECT platform, created_at, user_id
      FROM share_events
      WHERE ink_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `;
    const recentResult = await pool.query(recentQuery, [inkId]);

    const platformBreakdown = {
      twitter: 0,
      linkedin: 0,
      whatsapp: 0,
      copy: 0
    };

    platformResult.rows.forEach(row => {
      platformBreakdown[row.platform] = parseInt(row.count);
    });

    res.json({
      inkId,
      totalShares: parseInt(totalResult.rows[0].total_shares),
      platformBreakdown,
      recentShares: recentResult.rows.map(row => ({
        platform: row.platform,
        timestamp: row.created_at,
        userId: row.user_id
      }))
    });

  } catch (error) {
    console.error('Share analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch share analytics'
    });
  }
});

export default router;
```

### 4. Frontend Integration

#### Update ShareModal.tsx
```typescript
// Add tracking function
const trackShare = async (platform: string) => {
  try {
    const response = await fetch('/api/shares/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inkId: inkId, // Pass inkId as prop
        platform,
        shareUrl: url
      })
    });

    if (!response.ok) {
      console.error('Failed to track share');
    }
  } catch (error) {
    console.error('Share tracking error:', error);
  }
};

// Update handleSocialShare
const handleSocialShare = (platform: string) => {
  const encoded = encodeURIComponent(url);
  const links: Record<string, string> = {
    twitter: `https://x.com/intent/tweet?url=${encoded}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encoded}`,
  };

  // Track the share event
  trackShare(platform);

  window.open(links[platform], "_blank");
  toast({
    title: "Shared!",
    description: `Shared on ${platform}`,
    duration: 2000,
  });

  setTimeout(() => {
    onClose();
  }, 1500);
};
```

#### Update MoreOptionsDropdown.tsx
```typescript
// Add tracking for copy link
const handleCopy = () => {
  if (isCopyLocked) return;
  
  navigator.clipboard.writeText(url);
  
  // Track copy event
  trackShare('copy');
  
  toast({
    title: "Link copied!",
    description: "Link copied to clipboard",
    duration: 2000,
  });
  
  onShared?.();
  setIsCopyLocked(true);
  setTimeout(() => setIsCopyLocked(false), 3000);
};
```

### 5. Analytics Dashboard Integration

#### Add to Studio Analytics
```typescript
// components/studio/StudioAnalytics.tsx
const ShareAnalytics = ({ inkId }: { inkId: string }) => {
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    const fetchShareAnalytics = async () => {
      const response = await fetch(`/api/shares/analytics/${inkId}`);
      const data = await response.json();
      setShareData(data);
    };

    fetchShareAnalytics();
  }, [inkId]);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Share Analytics</h3>
      {shareData && (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Total Shares:</span>
            <span className="font-semibold">{shareData.totalShares}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Twitter:</span>
              <span>{shareData.platformBreakdown.twitter}</span>
            </div>
            <div className="flex justify-between">
              <span>LinkedIn:</span>
              <span>{shareData.platformBreakdown.linkedin}</span>
            </div>
            <div className="flex justify-between">
              <span>WhatsApp:</span>
              <span>{shareData.platformBreakdown.whatsapp}</span>
            </div>
            <div className="flex justify-between">
              <span>Copy Link:</span>
              <span>{shareData.platformBreakdown.copy}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 6. Environment Variables

```env
# .env
DATABASE_URL=postgresql://username:password@localhost:5432/inkly_db
NODE_ENV=production
```

### 7. Database Connection

```typescript
// db/connection.ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

## Summary

This implementation provides:
- ✅ **Simple tracking** of all share events
- ✅ **Platform breakdown** analytics
- ✅ **User attribution** for share events
- ✅ **Integration** with existing frontend
- ✅ **Analytics dashboard** for creators
- ✅ **Minimal overhead** and complexity

The backend tracks shares across all platforms while maintaining the existing user experience and adding valuable analytics for content creators. 