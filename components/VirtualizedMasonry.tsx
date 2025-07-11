"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Masonry from "react-masonry-css";

interface VirtualizedMasonryProps {
  items: React.ReactNode[];
  breakpointCols: { [key: string]: number };
  className?: string;
  columnClassName?: string;
  itemHeight?: number;
  overscan?: number;
}

export default function VirtualizedMasonry({
  items,
  breakpointCols,
  className = "my-masonry-grid",
  columnClassName = "my-masonry-grid_column",
  itemHeight = 300,
  overscan = 5
}: VirtualizedMasonryProps) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Debounced scroll handler
  const debouncedScrollHandler = useCallback(
    () => {
      requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const containerTop = container.offsetTop;

        const start = Math.max(0, Math.floor((scrollTop - containerTop - overscan * itemHeight) / itemHeight));
        const end = Math.min(
          items.length,
          Math.ceil((scrollTop + viewportHeight - containerTop + overscan * itemHeight) / itemHeight)
        );

        setVisibleRange({ start, end });
      });
    },
    [items.length, itemHeight, overscan]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      debouncedScrollHandler();
    };

    const handleScrollEnd = () => {
      setIsScrolling(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [debouncedScrollHandler]);

  // Update container height when items change
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(items.length * itemHeight);
    }
  }, [items.length, itemHeight]);

  // Memoize visible items to prevent unnecessary re-renders
  const visibleItems = useMemo(() => {
    if (!items.length) return [];

    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => {
      const actualIndex = visibleRange.start + index;
      return (
        <div
          key={actualIndex}
          style={{
            transform: `translateY(${actualIndex * itemHeight}px)`,
            position: 'absolute',
            width: '100%',
            transition: 'transform 0.2s ease-out',
            willChange: 'transform'
          }}
        >
          {item}
        </div>
      );
    });
  }, [items, visibleRange, itemHeight]);

  return (
    <div
      ref={containerRef}
      style={{ 
        height: containerHeight, 
        position: 'relative',
        overflow: 'hidden'
      }}
      className={className}
    >
      <Masonry
        breakpointCols={breakpointCols}
        className={className}
        columnClassName={columnClassName}
      >
        {visibleItems}
      </Masonry>
    </div>
  );
}