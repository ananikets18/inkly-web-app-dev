"use client"

import FeedLoader from "../../components/FeedLoader";
import { useState } from "react";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    // Example: In the future, use SWR/React Query for real data
    // const { data, isLoading } = useSWR('/api/help', fetcher)
    // if (isLoading) return <FeedLoader message="Loading help..." />
    return (
        <div className="min-h-screen bg-gray-50">
            {isLoading && <FeedLoader message="Loading help..." />}
            <div style={{ padding: 32, fontSize: 32 }}>Settings Page</div>
        </div>
    );
} 