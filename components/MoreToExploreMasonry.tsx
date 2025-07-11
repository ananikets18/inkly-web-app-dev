import { useState, useEffect, useRef, useMemo } from "react";
import Masonry from "react-masonry-css";
import ResponsiveInkCard from "@/components/ResponsiveInkCard";

type SampleInkCard = {
  id: number;
  content: string;
  author: string;
  avatarColor: string;
  isLong: boolean;
  readingTime: { text: string; minutes: number };
  views: number;
  echoCount: number;
  reaction: { reaction: string; count: number };
  bookmarkCount: number;
  hasReflected: boolean;
  hasInkified: boolean;
  reactionCount: number;
  reflectionCount: number;
  shareCount: number;
  shareUrl: string;
  onClick: () => void;
  onHover: () => void;
  onReact: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onFollow: () => void;
};

const masonryBreakpoints = { default: 5, 1600: 4, 1200: 3, 900: 2, 600: 1 };
const INITIAL_COUNT = 20;
const LOAD_MORE_COUNT = 10;

function generateSampleInks(count: number, offset = 0): SampleInkCard[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1000 + offset,
    content: `Sample ink content #${i + 1 + offset}. This is a demo for the masonry grid.\nFeel free to customize this!`,
    author: `Author ${i + 1 + offset}`,
    avatarColor: [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500"
    ][i % 5],
    isLong: false,
    readingTime: { text: "1 min", minutes: 1 },
    views: 100 + i * 7,
    echoCount: 0,
    reaction: { reaction: '', count: 0 },
    bookmarkCount: 0,
    hasReflected: false,
    hasInkified: false,
    reactionCount: 0,
    reflectionCount: 0,
    shareCount: 0,
    shareUrl: "#",
    onClick: () => {},
    onHover: () => {},
    onReact: () => {},
    onBookmark: () => {},
    onShare: () => {},
    onFollow: () => {},
  }));
}

export default function MoreToExploreMasonry() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!hasMore) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((c) => {
              const next = c + LOAD_MORE_COUNT;
              if (next >= 100) { // Simulate a max for demo
                setHasMore(false);
                return 100;
              }
              return next;
            });
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { rootMargin: "200px" }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
      observer.disconnect();
    };
  }, [isLoadingMore, hasMore]);

  const cards = useMemo(() => generateSampleInks(visibleCount), [visibleCount]);
  const skeletons = useMemo(() => Array.from({ length: 4 }).map((_, idx) => (
    <div key={`skeleton-${idx}`} className="bg-gray-100 rounded-xl h-64 animate-pulse mb-6" />
  )), []);

  return (
    <section aria-label="More to Explore" className="w-full">
      <div className="w-full h-[1.5px] bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 opacity-70 mt-12 mb-4 rounded-full" />
      <Masonry
        breakpointCols={masonryBreakpoints}
        className="my-masonry-grid px-2 sm:px-4 lg:px-8 mt-4"
        columnClassName="my-masonry-grid_column"
      >
        {cards.map((ink: SampleInkCard) => (
          <ResponsiveInkCard key={ink.id} {...ink} small={true} />
        ))}
        {isLoadingMore && skeletons}
      </Masonry>
      {/* Sentinel for IntersectionObserver */}
      {hasMore && (
        <div ref={loaderRef} aria-hidden="true" className="h-8 w-full" />
      )}
      {/* ARIA live region for loading state */}
      <div aria-live="polite" className="sr-only">
        {isLoadingMore ? "Loading more content..." : ""}
      </div>
    </section>
  );
} 