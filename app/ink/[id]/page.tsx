"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import InkDetails from "@/components/InkDetails";
import FeedLoader from "@/components/FeedLoader";
import Masonry from "react-masonry-css";
import ResponsiveInkCard from "@/components/ResponsiveInkCard";
import MoreToExploreMasonry from "@/components/MoreToExploreMasonry";

interface Ink {
  id: string;
  content: string;
  author: string;
  username: string;
  createdAt: string;
  readingTime: string;
  views: string;
  tags: string[];
  mood?: string;
  type?: string;
}

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

export default function InkPage() {
  // All hooks at the top!
  const params = useParams();
  const router = useRouter();
  const [ink, setInk] = useState<Ink | null>(null);
  const [loading, setLoading] = useState(true);

  // More to Explore hooks
  const masonryBreakpoints = { default: 5, 1600: 4, 1200: 3, 900: 2, 600: 1 };
  const INITIAL_COUNT = 20;
  const LOAD_MORE_COUNT = 10;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const generateSampleInks = (count: number, offset = 0): SampleInkCard[] => Array.from({ length: count }).map((_, i) => ({
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
  const handleScroll = useCallback(() => {
    if (isLoadingMore) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.body.offsetHeight;
    if (documentHeight - scrollPosition < 300) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((c) => c + LOAD_MORE_COUNT);
        setIsLoadingMore(false);
      }, 800); // Simulate network delay
    }
  }, [isLoadingMore]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  const cards = useMemo(() => generateSampleInks(visibleCount), [visibleCount]);
  const skeletons = useMemo(() => Array.from({ length: 4 }).map((_, idx) => (
    <div key={`skeleton-${idx}`} className="bg-gray-100 rounded-xl h-64 animate-pulse mb-6" />
  )), []);

  // The rest of your hooks
  const sampleMessages = [
    // Poems
    "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten.",
    "Hope was not a bird, but a fire quietly kept alive beneath her ribs.",
    // Dialogues
    '"Are you coming?" she asked. He smiled, "Always."',
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
  const [randomMessage, setRandomMessage] = useState<string | null>(null);
  useEffect(() => {
    setRandomMessage(sampleMessages[Math.floor(Math.random() * sampleMessages.length)]);
  }, []);

  useEffect(() => {
    const id = typeof params === "object" && "id" in params ? (params as any).id : undefined;
    if (!id) return;

    // Fetch ink data from localStorage
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("inkly-inks");
      if (data) {
        const inks = JSON.parse(data);
        const found = inks.find((i: Ink) => i.id === id);
        if (found) setInk(found);
      }
      setLoading(false);
    }
  }, [params]);

  // Now your early returns
  if (loading) {
    if (!randomMessage) return null; // or a spinner
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FeedLoader message={randomMessage} />
      </div>
    );
  }

  if (!ink) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Ink not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <SideNav />
        <main className="flex-1 px-0 py-0 md:py-6 sm:px-6">
          <div className="max-w-3xl mx-auto my-5 md:my-10">
            {/* Back button removed, now handled in Header */}

            {/* Content */}
            <div className="bg-white shadow-sm border border-gray-200 p-3">
              <InkDetails ink={ink} />
            </div>
          </div>
          <MoreToExploreMasonry />
        </main>
      </div>
    </div>
  );
}
