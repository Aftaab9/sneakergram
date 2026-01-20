/**
 * VirtualScroll Component
 * Implements virtual scrolling for long lists to improve performance
 * Only renders items that are visible in the viewport
 */

'use client';

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { throttle } from '@/lib/performance';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
  containerHeight?: number;
}

/**
 * VirtualScroll component for efficient rendering of long lists
 * 
 * @example
 * ```tsx
 * <VirtualScroll
 *   items={posts}
 *   itemHeight={600}
 *   renderItem={(post) => <PostCard post={post} />}
 *   overscan={2}
 * />
 * ```
 */
export function VirtualScroll<T>({
  items,
  itemHeight,
  renderItem,
  overscan = 3,
  className = '',
  containerHeight,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const viewportHeight = containerHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);
  const totalHeight = items.length * itemHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  // Throttled scroll handler
  const handleScroll = useCallback((e: Event) => {
    const throttledHandler = throttle(() => {
      const target = e.target as HTMLDivElement;
      setScrollTop(target.scrollTop);
    }, 16);
    
    throttledHandler();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight || '100vh' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
