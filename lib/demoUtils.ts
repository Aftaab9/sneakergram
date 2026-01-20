/**
 * Demo Mode Utilities
 * Helper functions for demo-specific features
 * Validates: Requirements 15.1, 15.3, 15.4
 */

/**
 * Reset all demo data and clear local storage
 * Validates: Requirements 15.1
 */
export function resetDemoData(): void {
  // Clear all localStorage
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
  
  // Reload the page to reset all state
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/**
 * Add artificial delay to simulate loading
 * Validates: Requirements 15.3, 15.4
 * 
 * @param minDuration - Minimum duration in milliseconds (default: 500ms)
 * @returns Promise that resolves after the delay
 */
export async function artificialDelay(minDuration = 500): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, minDuration);
  });
}

/**
 * Wrap an async function with artificial delay
 * Ensures loading states are visible for demo purposes
 * 
 * @param fn - Async function to wrap
 * @param minDuration - Minimum duration in milliseconds
 * @returns Wrapped function with artificial delay
 */
export function withArtificialDelay<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  minDuration = 500
): T {
  return (async (...args: Parameters<T>) => {
    const startTime = Date.now();
    const result = await fn(...args);
    const elapsed = Date.now() - startTime;
    
    // Add delay if operation completed too quickly
    if (elapsed < minDuration) {
      await artificialDelay(minDuration - elapsed);
    }
    
    return result;
  }) as T;
}

/**
 * Triple-tap detector for demo reset
 * Tracks taps on an element and triggers callback after 3 taps within timeWindow
 * 
 * @param callback - Function to call after triple-tap
 * @param timeWindow - Time window in milliseconds for triple-tap (default: 1000ms)
 * @returns Object with handleTap function and reset function
 */
export function createTripleTapDetector(
  callback: () => void,
  timeWindow = 1000
) {
  let tapCount = 0;
  let tapTimer: NodeJS.Timeout | null = null;
  
  const handleTap = () => {
    tapCount++;
    
    // Clear existing timer
    if (tapTimer) {
      clearTimeout(tapTimer);
    }
    
    // Check if we've reached 3 taps
    if (tapCount === 3) {
      callback();
      tapCount = 0;
      tapTimer = null;
      return;
    }
    
    // Set timer to reset tap count
    tapTimer = setTimeout(() => {
      tapCount = 0;
      tapTimer = null;
    }, timeWindow);
  };
  
  const reset = () => {
    tapCount = 0;
    if (tapTimer) {
      clearTimeout(tapTimer);
      tapTimer = null;
    }
  };
  
  return { handleTap, reset };
}

/**
 * Check if app is running in demo mode
 * Demo mode is always enabled for this application
 * 
 * @returns true (always in demo mode)
 */
export function isDemoMode(): boolean {
  return true;
}
