import React from "react";

export default function FeedLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 w-full">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-3" />
      <span className="text-base text-gray-600 font-medium">{message}</span>
    </div>
  );
}
