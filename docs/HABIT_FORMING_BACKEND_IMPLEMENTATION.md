# Habit-Forming Backend Implementation Guide

## 🎯 Overview

This document outlines the backend implementation for the core habit-forming features: Daily Goals, Achievement System, and Streak Tracking.

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  daily_goal_target INTEGER DEFAULT 1,
  daily_goal_reset_time TIME DEFAULT '00:00:00',
  timezone VARCHAR(50) DEFAULT 'UTC'
);
```

### Daily Goals Table
```sql
CREATE TABLE daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_date DATE NOT NULL,
  target_count INTEGER NOT NULL DEFAULT 1,
  completed_count INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, target_date)
);
```

### Streaks Table
```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### Achievements Table
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  rarity VARCHAR(20) DEFAULT 'common',
  requirement_type VARCHAR(50), -- 'streak', 'count', 'reflection', etc.
  requirement_value INTEGER,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### User Achievements Table
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

### User Stats Table
```sql
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_inks INTEGER DEFAULT 0,
  total_reflections INTEGER DEFAULT 0,
  total_reactions_received INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

## 🔄 API Endpoints

### Daily Goals API

#### GET /api/daily-goals/current
```typescript
// Get current user's daily goal status
interface DailyGoalResponse {
  targetDate: string;
  targetCount: number;
  completedCount: number;
  isCompleted: boolean;
  progressPercentage: number;
  remainingCount: number;
}

// Implementation
export async function getCurrentDailyGoal(userId: string): Promise<DailyGoalResponse> {
  const today = new Date().toISOString().split('T')[0];
  
  const dailyGoal = await prisma.dailyGoals.findUnique({
    where: {
      userId_targetDate: {
        userId,
        targetDate: today
      }
    }
  });

  if (!dailyGoal) {
    // Create new daily goal for today
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { dailyGoalTarget: true }
    });

    const newGoal = await prisma.dailyGoals.create({
      data: {
        userId,
        targetDate: today,
        targetCount: user?.dailyGoalTarget || 1,
        completedCount: 0
      }
    });

    return formatDailyGoalResponse(newGoal);
  }

  return formatDailyGoalResponse(dailyGoal);
}
```

#### POST /api/daily-goals/complete
```typescript
// Mark daily goal as completed
interface CompleteGoalRequest {
  inkId: string;
}

export async function completeDailyGoal(userId: string, inkId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const dailyGoal = await prisma.dailyGoals.findUnique({
    where: {
      userId_targetDate: {
        userId,
        targetDate: today
      }
    }
  });

  if (!dailyGoal) {
    throw new Error('Daily goal not found');
  }

  const updatedGoal = await prisma.dailyGoals.update({
    where: { id: dailyGoal.id },
    data: {
      completedCount: {
        increment: 1
      },
      isCompleted: {
        set: dailyGoal.completedCount + 1 >= dailyGoal.targetCount
      }
    }
  });

  // Check for achievement unlocks
  await checkAndUnlockAchievements(userId);

  return formatDailyGoalResponse(updatedGoal);
}
```

### Streak API

#### GET /api/streaks/current
```typescript
interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakStartDate: string;
  isAtRisk: boolean;
}

export async function getCurrentStreak(userId: string): Promise<StreakResponse> {
  const streak = await prisma.streaks.findUnique({
    where: { userId }
  });

  if (!streak) {
    // Initialize streak for new user
    const newStreak = await prisma.streaks.create({
      data: {
        userId,
        currentStreak: 0,
        longestStreak: 0
      }
    });
    return formatStreakResponse(newStreak);
  }

  return formatStreakResponse(streak);
}
```

#### POST /api/streaks/update
```typescript
// Update streak when user posts an ink
export async function updateStreak(userId: string) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const streak = await prisma.streaks.findUnique({
    where: { userId }
  });

  if (!streak) {
    // Create new streak
    return await prisma.streaks.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: todayStr,
        streakStartDate: todayStr
      }
    });
  }

  const lastActivity = new Date(streak.lastActivityDate);
  const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

  let newCurrentStreak = streak.currentStreak;
  let newLongestStreak = streak.longestStreak;
  let newStreakStartDate = streak.streakStartDate;

  if (daysDiff === 0) {
    // Same day, no change to streak
    return streak;
  } else if (daysDiff === 1) {
    // Consecutive day
    newCurrentStreak = streak.currentStreak + 1;
    newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);
  } else if (daysDiff > 1) {
    // Streak broken, start new streak
    newCurrentStreak = 1;
    newStreakStartDate = todayStr;
  }

  const updatedStreak = await prisma.streaks.update({
    where: { userId },
    data: {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: todayStr,
      streakStartDate: newStreakStartDate
    }
  });

  // Check for streak-based achievements
  await checkStreakAchievements(userId, newCurrentStreak);

  return updatedStreak;
}
```

### Achievements API

#### GET /api/achievements
```typescript
interface AchievementResponse {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export async function getUserAchievements(userId: string): Promise<AchievementResponse[]> {
  const userAchievements = await prisma.userAchievements.findMany({
    where: { userId },
    include: {
      achievement: true
    }
  });

  const allAchievements = await prisma.achievements.findMany();

  return allAchievements.map(achievement => {
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
    return {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      rarity: achievement.rarity,
      isUnlocked: !!userAchievement,
      unlockedAt: userAchievement?.unlockedAt?.toISOString(),
      xpReward: achievement.xpReward
    };
  });
}
```

#### POST /api/achievements/unlock
```typescript
export async function unlockAchievement(userId: string, achievementId: string) {
  const existing = await prisma.userAchievements.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId
      }
    }
  });

  if (existing) {
    return existing; // Already unlocked
  }

  const userAchievement = await prisma.userAchievements.create({
    data: {
      userId,
      achievementId
    },
    include: {
      achievement: true
    }
  });

  // Send notification
  await sendAchievementNotification(userId, userAchievement.achievement);

  return userAchievement;
}
```

## 🔍 Achievement Checking Logic

### Main Achievement Checker
```typescript
export async function checkAndUnlockAchievements(userId: string) {
  const userStats = await getUserStats(userId);
  const streak = await getCurrentStreak(userId);
  
  const achievements = await prisma.achievements.findMany();
  
  for (const achievement of achievements) {
    const isUnlocked = await checkAchievementUnlock(userId, achievement, userStats, streak);
    
    if (isUnlocked) {
      await unlockAchievement(userId, achievement.id);
    }
  }
}
```

### Individual Achievement Checkers
```typescript
async function checkAchievementUnlock(
  userId: string, 
  achievement: Achievement, 
  userStats: UserStats, 
  streak: Streak
): Promise<boolean> {
  const alreadyUnlocked = await prisma.userAchievements.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id
      }
    }
  });

  if (alreadyUnlocked) return false;

  switch (achievement.requirementType) {
    case 'first_ink':
      return userStats.totalInks >= 1;
    
    case 'streak':
      return streak.currentStreak >= achievement.requirementValue;
    
    case 'reflection_count':
      return userStats.totalReflections >= achievement.requirementValue;
    
    case 'total_inks':
      return userStats.totalInks >= achievement.requirementValue;
    
    case 'reactions_received':
      return userStats.totalReactionsReceived >= achievement.requirementValue;
    
    default:
      return false;
  }
}
```

## ⏰ Scheduled Tasks

### Daily Goal Reset
```typescript
// Cron job: Runs daily at 00:00 UTC
export async function resetDailyGoals() {
  const users = await prisma.users.findMany({
    select: { id: true, dailyGoalTarget: true, timezone: true }
  });

  for (const user of users) {
    const userTimezone = user.timezone || 'UTC';
    const userNow = new Date().toLocaleString('en-US', { timeZone: userTimezone });
    const userDate = new Date(userNow).toISOString().split('T')[0];

    // Create new daily goal for today
    await prisma.dailyGoals.upsert({
      where: {
        userId_targetDate: {
          userId: user.id,
          targetDate: userDate
        }
      },
      update: {},
      create: {
        userId: user.id,
        targetDate: userDate,
        targetCount: user.dailyGoalTarget,
        completedCount: 0,
        isCompleted: false
      }
    });
  }
}
```

### Streak Risk Checker
```typescript
// Cron job: Runs daily at 09:00 UTC
export async function checkStreakRisk() {
  const users = await prisma.streaks.findMany({
    where: {
      currentStreak: {
        gte: 2 // Only check users with 2+ day streaks
      }
    },
    include: {
      user: true
    }
  });

  for (const streak of users) {
    const lastActivity = new Date(streak.lastActivityDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // User is at risk of breaking streak
      await sendStreakRiskNotification(streak.userId, streak.currentStreak);
    }
  }
}
```

## 🔔 Notification System

### Achievement Notification
```typescript
export async function sendAchievementNotification(userId: string, achievement: Achievement) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { email: true, username: true }
  });

  // Send push notification
  await sendPushNotification(userId, {
    title: '🏆 Achievement Unlocked!',
    body: `You've earned the "${achievement.name}" achievement!`,
    data: {
      type: 'achievement',
      achievementId: achievement.id
    }
  });

  // Send email notification
  await sendEmail(user.email, {
    subject: 'New Achievement Unlocked!',
    template: 'achievement-unlocked',
    data: {
      username: user.username,
      achievementName: achievement.name,
      achievementDescription: achievement.description,
      achievementIcon: achievement.icon
    }
  });
}
```

### Streak Risk Notification
```typescript
export async function sendStreakRiskNotification(userId: string, currentStreak: number) {
  await sendPushNotification(userId, {
    title: '🔥 Don\'t Break Your Streak!',
    body: `You're on a ${currentStreak}-day streak. Write an ink today to keep it alive!`,
    data: {
      type: 'streak_risk',
      currentStreak
    }
  });
}
```

## 📊 Analytics & Reporting

### Weekly Progress
```typescript
export async function getWeeklyProgress(userId: string): Promise<number[]> {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);

  const dailyGoals = await prisma.dailyGoals.findMany({
    where: {
      userId,
      targetDate: {
        gte: weekStart.toISOString().split('T')[0],
        lte: today.toISOString().split('T')[0]
      }
    },
    orderBy: { targetDate: 'asc' }
  });

  const progress = new Array(7).fill(0);
  
  dailyGoals.forEach(goal => {
    const dayIndex = new Date(goal.targetDate).getDay();
    progress[dayIndex] = goal.completedCount;
  });

  return progress;
}
```

### Goal Completion Rate
```typescript
export async function getGoalCompletionRate(userId: string, days: number = 30): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const dailyGoals = await prisma.dailyGoals.findMany({
    where: {
      userId,
      targetDate: {
        gte: startDate.toISOString().split('T')[0]
      }
    }
  });

  const completedDays = dailyGoals.filter(goal => goal.isCompleted).length;
  const totalDays = dailyGoals.length;

  return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
}
```

## 🚀 Implementation Checklist

### Phase 1: Core Database
- [ ] Create database schema
- [ ] Set up Prisma client
- [ ] Create database migrations
- [ ] Seed initial achievements

### Phase 2: Basic APIs
- [ ] Daily goals CRUD operations
- [ ] Streak tracking logic
- [ ] Achievement checking system
- [ ] User stats tracking

### Phase 3: Notifications
- [ ] Push notification setup
- [ ] Email notification templates
- [ ] Achievement unlock notifications
- [ ] Streak risk notifications

### Phase 4: Scheduled Tasks
- [ ] Daily goal reset cron job
- [ ] Streak risk checker
- [ ] Analytics aggregation
- [ ] Performance monitoring

### Phase 5: Frontend Integration
- [ ] Update frontend API calls
- [ ] Real-time notifications
- [ ] Achievement animations
- [ ] Progress tracking

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/inkly"

# Redis (for caching)
REDIS_URL="redis://localhost:6379"

# Push Notifications
FIREBASE_SERVER_KEY="your-firebase-server-key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Cron Jobs
CRON_SECRET="your-cron-secret"
```

## 📈 Performance Considerations

1. **Caching**: Cache user stats and achievements
2. **Batch Processing**: Process notifications in batches
3. **Database Indexing**: Index frequently queried fields
4. **Rate Limiting**: Prevent API abuse
5. **Monitoring**: Track API response times and errors

This implementation provides a robust foundation for habit-forming features with proper data persistence, real-time notifications, and scalable architecture. 