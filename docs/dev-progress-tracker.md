# 🛠️ Inkly Web App – Development Progress Tracker

> 📆 Status as of: June 2025  
> 🧩 Tracking core features for MVP launch

---

## ✅ Status Summary

| Stage         | Tasks Count |
|---------------|-------------|
| Backlog       | 27          |
| In Progress   | 4           |
| In Review     | 3           |
| Done          | 6           |
| Total         | 40          |

---

## 🔁 Phase-wise Breakdown

### 🎯 Phase 1: Ink Creation & Posting

- [x] GitHub repo setup + .gitignore
- [x] Git workflow documentation
- [x] Homepage + Details UI (v0 export)
- [ ] Create Ink page `/create`
- [ ] Emotion picker (emoji + text)
- [ ] POST `/api/inks` backend route
- [ ] Prisma model for `Ink`

---

### 💬 Phase 2: Reactions & Feeling Tracker

- [ ] Reaction bar UI
- [ ] POST `/api/reactions`
- [ ] Track per-user reaction (1 per ink)
- [ ] GET `/api/inks/:id/reactions`
- [ ] Reaction counts display

---

### 🏅 Phase 3: Badges & XP System

- [ ] XP progress bar component
- [ ] Badge grid UI
- [ ] Badge unlock logic (e.g., 3 inks = Contributor)
- [ ] Badge modal/toast
- [ ] XP rollback logic on ink delete
- [ ] GET `/api/badges/unlocked`

---

### 🔔 Phase 4: Notifications & Real-Time Events

- [ ] Notification toast UI
- [ ] `/notifications` page
- [ ] Redis pub/sub setup
- [ ] WebSocket or fallback polling
- [ ] XP/streak daily cron (optional)

---

### 👤 Phase 5: Profile & Auth

- [ ] `/profile/[username]` page
- [ ] XP + badges shown on profile
- [ ] NextAuth/Clerk integration
- [ ] User onboarding (select interest tags)

---

## 📉 Manual Burndown Table

| Date        | Tasks Remaining | Done | Notes                       |
|-------------|------------------|------|-----------------------------|
| June 22     | 34               | 6    | Initial setup + repo done   |
| June 25     | 30               | 10   | Create & Reaction UI WIP    |
| June 28     | 22               | 18   | Badges & XP partially done  |
| July 1      | 12               | 28   | Auth + notifications finish |
| July 3      | 0                | 40   | MVP Ready 🚀                |

---

## 🚀 Upcoming Additions

- [ ] Add README with tech stack + usage
- [ ] Setup Vercel Preview on PR
- [ ] Add `/docs/api-reference.md`
- [ ] Create mock data generator

---

## 23-06-2025 Sprint
- Worked with inkly UI
- Removed modal 
- Removed the signed in state
- Added the annymous state


> 📌 Track your sprint every 3 days. Move tasks across your GitHub Project board and update this file accordingly.
