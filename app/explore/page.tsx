"use client";

import FeedLoader from "../../components/FeedLoader";
import { useState } from "react";

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(false);
  // Example: In the future, use SWR/React Query for real data
  // const { data, isLoading } = useSWR('/api/explore', fetcher)
  // if (isLoading) return <FeedLoader message="Loading explore..." />
  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <FeedLoader message="Loading explore..." />}
      {/* The rest of your explore page rendering logic */}
      <div style={{ padding: 32, fontSize: 32 }}>Explore Page</div>
    </div>
  );
} 