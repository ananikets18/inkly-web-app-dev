# 🎉 Emoji Burst Overlay for Inkly

This document provides technical guidance for collaborators working on the **Emoji Burst Animation** feature in Inkly's home feed. It is intended to be part of the open-source documentation for the project.

---

## 🧩 Purpose

The **Emoji Burst Overlay** visually amplifies the emotional feedback given by users when reacting to an Ink. It adds bursts of emojis (matching the selected reaction) from the bottom of the screen with smooth animations and a subtle backdrop blur.

---

## 🏗️ Component Structure

### 1. **`EmojiBurstOverlay.tsx`**

Location: `/components/EmojiBurstOverlay.tsx`

```tsx
interface Props {
  icon: React.ReactNode
  triggerKey: string // forces re-render for each burst
}
```

* Emits 20–30 emojis animated via `framer-motion`
* Fades and floats from the bottom edge
* Uses `triggerKey` to re-trigger burst on each reaction

### 2. **`page.tsx`** (Home Feed)

Add this overlay inside a high z-index container:

```tsx
<div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
  {burstEmoji && <EmojiBurstOverlay icon={burstEmoji} triggerKey={burstKey} />}
</div>
```

Overlay container must:

* Be `fixed` and cover entire screen
* Have `pointer-events: none` to avoid interaction block
* Be rendered *outside* of card layout but within root structure

---

## 🎛️ Configurable Behavior

### Reaction → Emoji Map

Update `reaction-button.tsx`:

```tsx
const reactions: Reaction[] = [
  {
    id: "love",
    icon: () => <svg>...</svg>,
    animation: { scale: 1.2, rotate: [0, 8, -8, 0] },
    sound: "love",
    ...
  },
  ...
]
```

### Overlay Colors

The blur overlay uses Tailwind utility:

```tsx
<div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" />
```

Can be updated per theme:

* `bg-black/20`: light mode
* `bg-white/10`: dark mode

---

## 🎨 UX Goals

* Emojis emerge from bottom edge
* Cover full width from left to right
* Respect `z-index` so overlay is *behind* reaction buttons
* Emojis animate up and fade out

---

## 🛠️ Dev Notes

* Clear emoji state after 1200ms to avoid residuals
* Ensure `useEffect` cleanup in both `EmojiBurstOverlay` and `HomePage`
* Use `Math.random()` for natural scatter effect

---

## 🔮 Ideas for Future

* Add sound variants per reaction
* Reaction popularity sorting
* Analytics/logging hook
* Mobile responsiveness with touch fallback

---

## 📁 File References

* `components/EmojiBurstOverlay.tsx`
* `components/ReactionButton.tsx`
* `app/page.tsx` (or `app/home/page.tsx` in App Router)

---

## 👥 Contributor Tips

* Keep animation durations short and non-blocking
* When testing on mobile, disable scroll locks or overlays may clip
* Always reset z-index stacking in deeply nested layouts

---

Contributions welcome! 🎨✨

---
