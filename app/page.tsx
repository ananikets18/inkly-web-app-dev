"use client";

import { useState, useEffect } from "react";
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

// FUTURE INTEGRATION NOTE:
// To fetch real API data for the feed, use SWR (https://swr.vercel.app/) or React Query (https://tanstack.com/query/latest).
// 1. Replace the sampleContents/authorNames arrays with a fetcher function that calls your backend API.
// 2. Use the SWR or useQuery hook to fetch and cache data.
// 3. The batching and state persistence logic will work seamlessly with paginated API data.
// Example (SWR):
//   const { data, isLoading } = useSWR('/api/feed?page=1', fetcher)
// Example (React Query):
//   const { data, isLoading } = useQuery(['feed', page], () => fetchFeed(page))
// See documentation for advanced features like infinite scroll, caching, and optimistic updates.

const masonryBreakpoints = {
  default: 5,     // ≥1536px
  1536: 4,        // ≥1280px and <1536px
  1280: 3,        // ≥1024px and <1280px
  1024: 2,        // ≥768px and <1024px
  768: 1,         // <768px (mobile only)
};

const INITIAL_COUNT = 8;
const CARD_LIMIT = 80;
const BATCH_SIZE = 2; // Number of cards to add per batch
const BATCH_DELAY = 80; // ms delay between batches

export default function HomePage() {
  const { visibleCount, setVisibleCount, scrollY, setScrollY, hasVisited, setHasVisited } = useFeedContext();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [postReactions, setPostReactions] = useState<{ [key: number]: { reaction: string; count: number } }>({});
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, scrollY);
    setMounted(true);
    if (!hasVisited) setHasVisited(true);
    return () => {
      setScrollY(window.scrollY);
    };
  }, []);

  const { playSound } = useSoundEffects();

  const sampleContents = [
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
  ];

  const authorNames = [
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
  ];
  const avatarColors = [
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
  ];

  const handleButtonClick = (type: "click" | "like" | "follow" | "bookmark") => playSound(type);
  const handleButtonHover = () => playSound("hover");

  const handleReaction = (postId: number, reactionId: string | null) => {
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
  };

  // Batching function for loading more cards
  const batchAddCards = (totalToAdd: number) => {
    let added = 0;
    function addBatch() {
      setVisibleCount((prev) => {
        const next = Math.min(prev + BATCH_SIZE, prev + (totalToAdd - added), prev + CARD_LIMIT);
        added += BATCH_SIZE;
        return next;
      });
      added += BATCH_SIZE;
      if (added < totalToAdd) {
        setTimeout(addBatch, BATCH_DELAY);
      } else {
        setIsLoadingMore(false);
      }
    }
    addBatch();
  };

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !isLoadingMore) {
        setIsLoadingMore(true);
        // Use batching instead of single setTimeout
        batchAddCards(10);
      }
    }, 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex sm:flex-row flex-col">
        <SideNav />
        <main className="flex-1 px-2 sm:px-4 py-6" role="main">
          {isLoading && <FeedLoader message="Loading feed..." />}
          {!mounted ? (
            <Masonry
              breakpointCols={masonryBreakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {Array.from({ length: INITIAL_COUNT }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </Masonry>
          ) : (
            <Masonry
              breakpointCols={masonryBreakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {Array.from({ length: visibleCount })
                .slice(Math.max(0, visibleCount - CARD_LIMIT))
                .map((_, idx) => {
                  const realIdx = Math.max(0, visibleCount - CARD_LIMIT) + idx;
                  const content = sampleContents[realIdx % sampleContents.length];
                  const author = authorNames[realIdx % authorNames.length];
                  const isLong = realIdx === 0;
                  const displayContent = isLong ? content.repeat(2) : content;
                  const postReaction = postReactions[realIdx];
                  const readingTime = calculateReadingTime(displayContent);
                  const avatarColor = avatarColors[realIdx % avatarColors.length];
                  return (
                    <ResponsiveInkCard
                      key={realIdx}
                      id={realIdx}
                      content={displayContent}
                      author={author}
                      avatarColor={avatarColor}
                      isLong={isLong}
                      reaction={postReaction}
                      readingTime={readingTime}
                      onHover={handleButtonHover}
                      onReact={(reactionId) => handleReaction(realIdx, reactionId)}
                      onBookmark={() => handleButtonClick("bookmark")}
                      onShare={() => handleButtonClick("click")}
                      onFollow={() => handleButtonClick("follow")}
                      shareUrl={""}
                      bookmarkCount={0}
                      views={0}
                      reactionCount={0}
                      reflectionCount={0}
                      echoCount={0}
                      onClick={() => console.log("open modal")}
                    />
                  );
                })}
              {isLoadingMore && (
                <>
                  <div className="flex flex-col items-center justify-center py-6 w-full col-span-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">Loading more...</span>
                  </div>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <SkeletonCard key={`skeleton-more-${idx}`} />
                  ))}
                </>
              )}
            </Masonry>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
