"use client";

import FeedLoader from "../../components/FeedLoader";
import { useState } from "react";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  // Example: In the future, use SWR/React Query for real data
  // const { data, isLoading } = useSWR('/api/profile', fetcher)
  // if (isLoading) return <FeedLoader message="Loading profile..." />
  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <FeedLoader message="Loading profile..." />}
      {/* The rest of your profile page rendering logic */}
      <div style={{ padding: 32, fontSize: 32 }}>Profile Page</div>
    </div>
  );
} 