/**
 * Performance Utilities
 * Debouncing, throttling, and other performance optimization helpers
 */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * since the last time it was invoked
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per specified time period
 * 
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Create a lazy loader for dynamic imports
 * 
 * @param importFunc - Dynamic import function
 * @returns Lazy loaded component
 */
export function lazyLoad<T extends React.ComponentType<Record<string, unknown>>>(
  importFunc: () => Promise<{ default: T }>
) {
  return importFunc;
}

/**
 * Check if an element is in viewport
 * Used for lazy loading and scroll animations
 * 
 * @param element - DOM element to check
 * @param offset - Offset in pixels (default: 0)
 * @returns True if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
}

/**
 * Request idle callback wrapper with fallback
 * Schedules work to be done when browser is idle
 * 
 * @param callback - Function to execute when idle
 * @param options - Idle callback options
 * @returns Idle callback ID
 */
export function requestIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  // Fallback for browsers that don't support requestIdleCallback
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => 50,
    } as IdleDeadline);
  }, 1) as unknown as number;
}

/**
 * Cancel idle callback with fallback
 * 
 * @param id - Idle callback ID to cancel
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Preload an image
 * 
 * @param src - Image source URL
 * @returns Promise that resolves when image is loaded
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch multiple state updates together
 * Useful for reducing re-renders
 * 
 * @param updates - Array of update functions
 */
export function batchUpdates(updates: Array<() => void>): void {
  // React 18+ automatically batches updates
  // This is a helper for explicit batching if needed
  updates.forEach(update => update());
}

/**
 * Memoize expensive computations
 * 
 * @param fn - Function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, unknown>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}
