import { useState, useCallback, useRef, useEffect } from 'react';

interface UseOptimizedLoadingOptions {
  batchSize?: number;
  batchDelay?: number;
  maxItems?: number;
  threshold?: number;
}

export function useOptimizedLoading({
  batchSize = 4,
  batchDelay = 50,
  maxItems = 80,
  threshold = 300
}: UseOptimizedLoadingOptions = {}) {
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef(0);

  // Cleanup function to prevent memory leaks
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
    loadingRef.current = false;
    setIsLoadingMore(false);
  }, []);

  const batchAddItems = useCallback((totalToAdd: number) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setIsLoadingMore(true);
    
    let added = 0;
    const addBatch = () => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setVisibleCount((prev) => {
          const next = Math.min(
            prev + batchSize, 
            prev + (totalToAdd - added), 
            prev + maxItems
          );
          added += batchSize;
          return next;
        });
        
        if (added < totalToAdd) {
          timeoutRef.current = setTimeout(addBatch, batchDelay);
        } else {
          setIsLoadingMore(false);
          loadingRef.current = false;
        }
      });
    };
    
    addBatch();
  }, [batchSize, batchDelay, maxItems]);

  const checkAndLoadMore = useCallback(() => {
    if (loadingRef.current || isLoadingMore) return;
    
    const now = Date.now();
    // Throttle scroll events to prevent excessive calls
    if (now - lastScrollTime.current < 100) return;
    lastScrollTime.current = now;
    
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.body.offsetHeight;
    
    if (scrollPosition >= documentHeight - threshold) {
      // Clear any pending scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce the load more action
      scrollTimeoutRef.current = setTimeout(() => {
        batchAddItems(8); // Restored to original batch size
      }, 50);
    }
  }, [isLoadingMore, batchAddItems, threshold]);

  const reset = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    visibleCount,
    setVisibleCount,
    isLoadingMore,
    batchAddItems,
    checkAndLoadMore,
    reset
  };
}
