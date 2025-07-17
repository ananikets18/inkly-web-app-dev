import { useState } from "react";

interface InkLike { id: string }

export function useInkActions(ink: InkLike) {
  // Bookmark state (in-memory only, resets on reload)
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  const toggleBookmark = () => {
    setIsBookmarked((prev: boolean) => {
      const newVal = !prev;
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
