import { useState } from "react";

interface InkLike { id: string }

export function useInkActions(ink: InkLike) {
  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(() => {
    if (typeof window !== "undefined") {
      const bookmarks = JSON.parse(localStorage.getItem("inkly-bookmarks") || "[]");
      return bookmarks.includes(ink.id);
    }
    return false;
  });
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  const toggleBookmark = () => {
    setIsBookmarked((prev: boolean) => {
      const newVal = !prev;
      if (typeof window !== "undefined") {
        let bookmarks: string[] = JSON.parse(localStorage.getItem("inkly-bookmarks") || "[]");
        if (newVal) {
          bookmarks = Array.from(new Set([...bookmarks, ink.id]));
        } else {
          bookmarks = bookmarks.filter((id: string) => id !== ink.id);
        }
        localStorage.setItem("inkly-bookmarks", JSON.stringify(bookmarks));
      }
      setShowBookmarkToast(true);
      setTimeout(() => setShowBookmarkToast(false), 1500);
      return newVal;
    });
  };

  // Reaction state
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const handleReaction = (reactionId: string | null) => {
    setSelectedReaction((prev) => (prev === reactionId ? null : reactionId));
    // Optionally: add sound/toast here
  };

  // Reflect modal state
  const [showReflectModal, setShowReflectModal] = useState(false);
  const openReflectModal = () => setShowReflectModal(true);
  const closeReflectModal = () => setShowReflectModal(false);

  return {
    isBookmarked,
    toggleBookmark,
    showBookmarkToast,
    selectedReaction,
    handleReaction,
    showReflectModal,
    openReflectModal,
    closeReflectModal,
  };
} 