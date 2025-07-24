"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import BottomNav from "../components/BottomNav";
import ResponsiveInkCard from "../components/ResponsiveInkCard";
import { useSoundEffects } from "../hooks/use-sound-effects";
import { calculateReadingTime } from "../utils/reading-time";
import { reactions } from "../components/reaction-button";
import Masonry from "react-masonry-css";
import { debounce } from "lodash";  
import SkeletonCard from "@/components/SkeletonCard";  
import { useFeedContext } from "../hooks/feed-context";
import FeedLoader from "../components/FeedLoader";
import { useOptimizedLoading } from "../hooks/useOptimizedLoading";
import PerformanceMonitor from "../components/PerformanceMonitor";
import { generateRandomInkId } from "@/utils/random-ink-id";
// import { getTagsAndMood } from "@/utils/getTagsAndMood";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Flame } from "lucide-react";

// app/page.tsx
// Main feed page. Renders list of inks and passes echo users to InkDetails.
// For future: Integrate with backend API for real data, pagination, and echo user lists.

const masonryBreakpoints = {
  default: 5,     // ≥1536px
  1536: 4,        // ≥1280px and <1536px
  1280: 3,        // ≥1024px and <1280px
  1024: 2,        // ≥768px and <1024px
  768: 1,         // <768px (mobile only)
};

const INITIAL_COUNT = 8;
const CARD_LIMIT = 80; // Restored to original value

// Debounce timing for scroll handler
const SCROLL_DEBOUNCE_MS = 100;

// --- Echo Logic for Feed ---
// Each ink card can have an array of echo users (echoUsers) representing users who have echoed it
// This should come from backend in real app, but is mocked here
// When navigating to InkDetails, pass echoUsers as initialEchoUsers prop
// Example: <InkDetails ink={ink} initialEchoUsers={ink.echoUsers} />

export default function HomePage() {
  const { scrollY, setScrollY, hasVisited, setHasVisited } = useFeedContext();
  const [postReactions, setPostReactions] = useState<{ [key: string]: { reaction: string; count: number } }>({});
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");
  const [streak, setStreak] = useState<{ count: number; lastDate: string } | null>(null);

  // Use optimized loading hook with original settings
  const { visibleCount, isLoadingMore, checkAndLoadMore } = useOptimizedLoading({
    batchSize: 4,        // Restored to original batch size
    batchDelay: 50,      // Restored to original delay
    maxItems: CARD_LIMIT,
    threshold: 300       // Restored to original threshold
  });

  useEffect(() => {
    window.scrollTo(0, scrollY);
    setMounted(true);
    if (!hasVisited) setHasVisited(true);
    
    // Show performance monitor in development
    if (process.env.NODE_ENV === 'development') {
      setShowPerformanceMonitor(true);
    }
    
    // Streak info
    if (typeof window !== 'undefined') {
      const streakInfo = localStorage.getItem('inkly-streak-info');
      if (streakInfo) {
        try {
          const parsed = JSON.parse(streakInfo);
          setStreak(parsed);
        } catch {}
      }
    }
    
    return () => {
      setScrollY(window.scrollY);
    };
  }, [mounted]);

  // --- DEV ONLY: Force streak banner/nudge to show for testing ---
  // useEffect(() => {
  //   setStreak({ count: 4, lastDate: (() => {
  //     // Set lastDate to yesterday to trigger the nudge
  //     const d = new Date();
  //     d.setDate(d.getDate() - 1);
  //     return d.toISOString().slice(0, 10);
  //   })() });
  // }, []);

  // --- Nudge logic ---
  const [showStreakNudge, setShowStreakNudge] = useState(false);
  useEffect(() => {
    if (!streak) return;
    const today = new Date();
    const lastDate = new Date(streak.lastDate);
    const diffDays = Math.floor((today.setHours(0,0,0,0) - lastDate.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
    if (streak.count >= 2 && diffDays === 1) {
      setShowStreakNudge(true);
    } else {
      setShowStreakNudge(false);
    }
  }, [streak]);

  const { playSound } = useSoundEffects();

  // Memoize static data to prevent re-creation on every render
  const sampleContents = useMemo(() => [
    // Large Poem Demo
    `Beneath the silver whisper of the moon,
A thousand dreams awaken, drift, and swoon.
The city sleeps, but in the quiet deep,
A poet's heart is far too wild to sleep.

She pens the ache of longing in the night,
Each stanza trembling, searching for the light.
Her verses spill like rivers on the page—
A gentle storm, a captive bird uncaged.

The world may never know the words she weaves,
The secret hopes she tucks beneath her sleeves.
But in the hush, her ink becomes the sea—
Endless, wild, and beautifully free.`,
    // Poems
    "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten.",
    "Hope was not a bird, but a fire quietly kept alive beneath her ribs.",
    // Dialogues
    "\"Are you coming?\" she asked. He smiled, 'Always.'",
    "'Promise me you'll stay.' 'Until the stars forget to shine.'",
    // Quotes
    "Whisper to the universe what you seek and it shall echo back tenfold.",
    "Every time your heart is broken, a doorway cracks open to a world full of new beginnings.",
    // Affirmations
    "A silent affirmation each morning shaped her every decision.",
    "Manifest with intention. Trust the magic in your breath.",
    // Dank tales
    "Once upon a meme, a frog ruled the internet.",
    "In a world of cats, be a keyboard warrior.",
    // Confessions
    "Confession: I still believe in magic.",
    "Sometimes I pretend to be busy just to avoid people.",
    // Facts
    "Did you know? Honey never spoils. Archaeologists have found edible honey in ancient tombs.",
    "Octopuses have three hearts and blue blood.",
    // Other
    "She wasn't soft because life was easy. She was soft like the sea—calm on the surface but carrying storms in the deep.",
    "Some stories aren't written. They're felt.",
  ], []);

  const authorNames = useMemo(() => [
    "sarah_mitchell",   // Creator badge
    "Maya Chen",        // Regular user
    "alex_thompson",    // Admin badge
    "Jordan Kim",       // Regular user
    "mike_rodriguez",   // Moderator badge
    "Sam Taylor",       // Regular user
    "emma_wilson",      // Contributor badge
    "Riley Park",       // Regular user
    "david_chen",       // Writer badge
    "Alex Rivera",      // Regular user
    "lisa_park",        // Author badge
    "jessica_brown",    // Verified tick only
    "michael_lee"       // Verified tick only
  ], []);

  const avatarColors = useMemo(() => [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-rose-500",
    "from-yellow-500 to-orange-500",
    "from-emerald-500 to-green-500",
    "from-violet-500 to-purple-500",
    "from-sky-500 to-blue-500",
    "from-amber-500 to-yellow-500",
    "from-cyan-500 to-blue-500",
    "from-rose-500 to-pink-500"
  ], []);

  const handleButtonClick = useCallback((type: "click" | "like" | "follow" | "bookmark") => playSound(type), [playSound]);
  const handleButtonHover = useCallback(() => playSound("hover"), [playSound]);

  const handleReaction = useCallback((postId: string, reactionId: string | null) => {
    if (!reactionId) return;
    const selected = reactions.find((r) => r.id === reactionId);
    if (selected) {
      setPostReactions((prev) => ({
        ...prev,
        [postId]: {
          reaction: reactionId,
          count: (prev[postId]?.count || 0) + 1,
        },
      }));
    }
  }, []);

  // Generate stable random inkIds for each card (8-char alphanumeric)
  const inkIds = useMemo(() => {
    const ids = Array.from({ length: CARD_LIMIT }).map(() => generateRandomInkId());
    // Clear and reset localStorage to avoid old-format IDs
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('inkly-inks');
    }
    return ids;
  }, []);

  // Persist all generated ink cards in localStorage for detail page access
  useEffect(() => {
    if (mounted) {
      const now = new Date();
      const inks = Array.from({ length: visibleCount }).map((_, idx) => {
        const id = inkIds[idx];
        const content = sampleContents[idx % sampleContents.length];
        const author = authorNames[idx % authorNames.length];
        const readingTime = calculateReadingTime(content).text;
        const views = Math.floor(Math.random() * 1000) + 100; // mock views
        const username = `@${author.toLowerCase().replace(/\s+/g, "_")}`;
        // const { tags, mood } = getTagsAndMood(content);
        return {
          id,
          content,
          author,
          createdAt: now.toISOString(),
          reaction: postReactions[id]?.reaction || null,
          reactionCount: postReactions[id]?.count || 0,
          bookmarkCount: 0, // You can wire this up to state if you want
          reflectionCount: 0, // You can wire this up to state if you want
          readingTime,
          views,
          username,
          // tags,
          // mood,
        };
      });
      localStorage.setItem('inkly-inks', JSON.stringify(inks));
    }
  }, [mounted, visibleCount, inkIds, sampleContents, authorNames, postReactions]);

  // Memoize the cards array to prevent unnecessary re-renders
  const cards = useMemo(() => {
    if (!mounted) return [];
    
    return Array.from({ length: visibleCount })
      .map((_, idx) => {
        const content = sampleContents[idx % sampleContents.length];
        const author = authorNames[idx % authorNames.length];
        const isLong = idx === 0;
        const displayContent = isLong ? content.repeat(2) : content;
        const postReaction = postReactions[inkIds[idx]];
        const readingTime = calculateReadingTime(displayContent);
        const avatarColor = avatarColors[idx % avatarColors.length];
        const inkId = inkIds[idx];
        const numericId = parseInt(inkId.replace(/\D/g, '').slice(0, 6) || idx.toString());
        
        return (
          <ResponsiveInkCard
            key={inkId}
            id={numericId}
            inkId={inkId}
            content={displayContent}
            author={author}
            avatarColor={avatarColor}
            isLong={isLong}
            reaction={postReaction}
            readingTime={readingTime}
            onHover={handleButtonHover}
            onReact={(reactionId) => handleReaction(inkId, reactionId)}
            onBookmark={() => handleButtonClick("bookmark")}
            onShare={() => handleButtonClick("click")}
            onFollow={() => handleButtonClick("follow")}
            shareUrl={"/ink/" + inkId}
            bookmarkCount={0}
            reactionCount={0}
            reflectionCount={0}
            echoCount={0}
            onClick={() => console.log("open modal")}
          />
        );
      });
  }, [mounted, visibleCount, sampleContents, authorNames, avatarColors, postReactions, handleButtonHover, handleReaction, handleButtonClick, inkIds, calculateReadingTime]);

  // Memoize skeleton cards
  const skeletonCards = useMemo(() => 
    Array.from({ length: INITIAL_COUNT }).map((_, idx) => (
      <SkeletonCard key={idx} />
    )), []
  );

  const loadingMoreSkeletons = useMemo(() => 
    Array.from({ length: 4 }).map((_, idx) => ( // Restored to original skeleton count
      <SkeletonCard key={`skeleton-more-${idx}`} />
    )), []
  );

  // Scroll-based infinite load
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) return;
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.body.offsetHeight;
      if (documentHeight - scrollPosition < 300) {
        checkAndLoadMore();
      }
    };
    const debounced = debounce(handleScroll, SCROLL_DEBOUNCE_MS);
    window.addEventListener('scroll', debounced);
    return () => window.removeEventListener('scroll', debounced);
  }, [checkAndLoadMore, isLoadingMore]);

  // Autofill the viewport if the feed is too short
  useEffect(() => {
    function fillViewportIfNeeded() {
      if (isLoadingMore) return;
      const documentHeight = document.body.offsetHeight;
      const viewportHeight = window.innerHeight;
      if (documentHeight < viewportHeight && visibleCount < CARD_LIMIT) {
        checkAndLoadMore();
      }
    }
    // Call on mount and after each load
    fillViewportIfNeeded();
    // Also call after a short delay in case layout shifts
    const timeout = setTimeout(fillViewportIfNeeded, 200);
    return () => clearTimeout(timeout);
  }, [visibleCount, isLoadingMore, checkAndLoadMore]);

  // Accessibility: ARIA live region for new content
  const [ariaMessage, setAriaMessage] = useState("");
  useEffect(() => {
    if (isLoadingMore) {
      setAriaMessage("Loading more content...");
    } else if (visibleCount > 8) {
      setAriaMessage("More content loaded.");
    }
  }, [isLoadingMore, visibleCount]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex sm:flex-row flex-col">
        <SideNav />
        <main className="flex-1 sm:px-2 sm:px-4 py-3" role="main">
          {/* ARIA live region for accessibility */}
          <div aria-live="polite" className="sr-only">{ariaMessage}</div>
          {isLoading && <FeedLoader message="Loading feed..." />}

          {/* --- STREAK NUDGE --- */}
          {showStreakNudge && streak && (
            <div
              className="flex flex-col sm:flex-row items-center gap-2 mb-4 px-4 py-2 rounded-lg border shadow transition-colors
                bg-gradient-to-r from-yellow-100 to-orange-200 border-yellow-300 text-yellow-900
                dark:from-yellow-900 dark:to-orange-900 dark:border-yellow-700 dark:text-yellow-100"
              role="status"
              aria-label={`Don't lose your ${streak.count}-day streak! Ink something today to keep it alive!`}
            >
              <div className="flex items-center gap-2 w-full">
                <Flame className="w-5 h-5 text-orange-500 mr-1 animate-bounce" aria-hidden="true" />
                <span className="font-semibold text-sm md:text-base flex-1">
                  Don’t lose your <span className="sr-only">streak: </span>{streak.count}-day streak! Ink something today to keep it alive! <b aria-hidden="true">🔥</b>
                </span>
                <a
                  href="/create"
                  className="ml-2 px-3 py-1 rounded-md bg-orange-500 text-white font-semibold text-sm shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors dark:bg-orange-600 dark:hover:bg-orange-500 dark:focus:ring-orange-300"
                  tabIndex={0}
                  aria-label="Start Writing"
                >
                  Start Writing
                </a>
              </div>
            </div>
          )}

          {/* --- STREAK BANNER --- */}
          {streak && streak.count >= 2 && !showStreakNudge && (
            <section
              className="flex flex-col sm:flex-row items-center gap-3 mb-4 px-4 py-2 rounded-lg border shadow transition-colors
                bg-gradient-to-r from-orange-200 via-yellow-100 to-orange-100 border-orange-300 text-orange-800
                dark:from-orange-900 dark:via-yellow-900 dark:to-orange-900 dark:border-orange-700 dark:text-orange-100"
              role="status"
              aria-label={`You are on a ${streak.count}-day writing streak!`}
            >
              <span className="animate-pulse"><Flame className="w-6 h-6 text-orange-500" aria-hidden="true" /></span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="font-semibold text-base sm:text-lg">
                    {streak.count >= 5 ? (
                      <>
                        <span className="sr-only">Streak Master: </span>🔥 <b>Streak Master!</b> {streak.count} days in a row!
                      </>
                    ) : (
                      <>
                        <span className="sr-only">Streak: </span>🔥 {streak.count} day streak! Keep it going!
                      </>
                    )}
                  </span>
                  <span className="ml-2 text-xs sm:text-sm text-orange-700 dark:text-orange-200">
                    {streak.count < 5
                      ? `Only ${5 - streak.count} more day${5 - streak.count > 1 ? "s" : ""} to unlock the Streak Master badge!`
                      : "You've unlocked the Streak Master badge!"}
                  </span>
                </div>
                <div className="w-full bg-orange-100 dark:bg-orange-950 rounded-full h-1 mt-2" aria-hidden="true">
                  <div
                    className="bg-orange-400 dark:bg-orange-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((streak.count / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Removed Tabs, TabsList, TabsTrigger, TabsContent */}
          {!mounted ? (
            <Masonry
              breakpointCols={masonryBreakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {skeletonCards}
            </Masonry>
          ) : (
            <Masonry
              breakpointCols={masonryBreakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {cards}
              {isLoadingMore && (
                <>
                  <div className="flex flex-col items-center justify-center py-6 w-full col-span-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">Loading more...</span>
                  </div>
                  {loadingMoreSkeletons}
                </>
              )}
              {/* Accessible Load More button for keyboard/screen reader users */}
              {visibleCount < CARD_LIMIT && !isLoadingMore && (
                <button
                  className="sr-only"
                  tabIndex={0}
                  aria-label="Load more content"
                  onClick={() => checkAndLoadMore()}
                >
                  Load more
                </button>
              )}
            </Masonry>
          )}
        </main>
      </div>
      <BottomNav />
      <PerformanceMonitor 
        cardCount={cards.length} 
        isVisible={showPerformanceMonitor} 
      />
    </div>
  );
}
