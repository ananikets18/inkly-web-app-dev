"use client";

import FeedLoader from "../../components/FeedLoader";
import { useState } from "react";

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(false);
  // Example: In the future, use SWR/React Query for real data
  // const { data, isLoading } = useSWR('/api/about', fetcher)
  // if (isLoading) return <FeedLoader message="Loading about..." />
  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <FeedLoader message="Loading about..." />}
      {/* The rest of your about page rendering logic */}
      <div style={{ padding: 32, fontSize: 32 }}>About Page</div>
    </div>
  );
} 