/**
 * Performance Monitoring Utilities
 * Track and log performance metrics for optimization
 */

/**
 * Measure component render time
 * 
 * @param componentName - Name of the component
 * @param callback - Function to measure
 */
export function measureRenderTime(componentName: string, callback: () => void): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    callback();
    return;
  }

  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (duration > 16) { // More than one frame at 60fps
    console.warn(`[Performance] ${componentName} took ${duration.toFixed(2)}ms to render`);
  }
}

/**
 * Log bundle size information
 */
export function logBundleSize(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return;
  }

  // Use Performance API to get resource timing
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const jsResources = resources.filter(r => r.name.endsWith('.js'));
  const cssResources = resources.filter(r => r.name.endsWith('.css'));
  
  const totalJsSize = jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
  const totalCssSize = cssResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
  
  console.log('[Performance] Bundle Sizes:', {
    js: `${(totalJsSize / 1024).toFixed(2)} KB`,
    css: `${(totalCssSize / 1024).toFixed(2)} KB`,
    total: `${((totalJsSize + totalCssSize) / 1024).toFixed(2)} KB`,
  });
}

/**
 * Monitor Core Web Vitals
 */
export function monitorWebVitals(): void {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
    console.log('[Performance] LCP:', lastEntry.renderTime || lastEntry.loadTime);
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch {
    // LCP not supported
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: PerformanceEntry) => {
      const fidEntry = entry as PerformanceEntry & { processingStart?: number };
      console.log('[Performance] FID:', (fidEntry.processingStart || 0) - entry.startTime);
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch {
    // FID not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsScore = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: PerformanceEntry) => {
      const clsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
      if (!clsEntry.hadRecentInput) {
        clsScore += clsEntry.value || 0;
      }
    });
    console.log('[Performance] CLS:', clsScore);
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch {
    // CLS not supported
  }
}

/**
 * Track long tasks (tasks that block the main thread for >50ms)
 */
export function trackLongTasks(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.warn('[Performance] Long task detected:', {
        duration: `${entry.duration.toFixed(2)}ms`,
        startTime: entry.startTime,
      });
    });
  });

  try {
    observer.observe({ entryTypes: ['longtask'] });
  } catch {
    // Long tasks not supported
  }
}

/**
 * Get memory usage (Chrome only)
 */
export function getMemoryUsage(): { used: string; total: string; percentage: string } | null {
  if (typeof window === 'undefined') return null;

  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  if (!memory) return null;

  const used = memory.usedJSHeapSize;
  const total = memory.jsHeapSizeLimit;
  const percentage = ((used / total) * 100).toFixed(2);

  return {
    used: `${(used / 1024 / 1024).toFixed(2)} MB`,
    total: `${(total / 1024 / 1024).toFixed(2)} MB`,
    percentage: `${percentage}%`,
  };
}

/**
 * Initialize performance monitoring
 * Call this in your root layout or app component
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Monitor web vitals
  monitorWebVitals();

  // Track long tasks
  trackLongTasks();

  // Log bundle size after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      logBundleSize();
      
      const memory = getMemoryUsage();
      if (memory) {
        console.log('[Performance] Memory Usage:', memory);
      }
    }, 1000);
  });
}
