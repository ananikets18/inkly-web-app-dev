"use client"

import React, { createContext, useContext, useState, useRef } from "react";

interface FeedState {
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  scrollY: number;
  setScrollY: React.Dispatch<React.SetStateAction<number>>;
  hasVisited: boolean;
  setHasVisited: (v: boolean) => void;
}

const FeedContext = createContext<FeedState | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [scrollY, setScrollY] = useState(0);
  const [hasVisited, setHasVisited] = useState(false);

  return (
    <FeedContext.Provider value={{ visibleCount, setVisibleCount, scrollY, setScrollY, hasVisited, setHasVisited }}>
      {children}
    </FeedContext.Provider>
  );
};

export function useFeedContext() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeedContext must be used within FeedProvider");
  return ctx;
} 