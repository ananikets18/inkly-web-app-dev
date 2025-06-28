"use client";

import FeedLoader from "../../components/FeedLoader";
import { useState } from "react";

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  // Example: In the future, use SWR/React Query for real data
  // const { data, isLoading } = useSWR('/api/notifications', fetcher)
  // if (isLoading) return <FeedLoader message="Loading notifications..." />
  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <FeedLoader message="Loading notifications..." />}
      {/* The rest of your notifications page content */}
      <div style={{ padding: 32, fontSize: 32 }}>Notifications Page</div>
    </div>
  );
} 