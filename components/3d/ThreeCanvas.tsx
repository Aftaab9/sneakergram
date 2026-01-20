'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ThreeCanvasProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component that safely loads React Three Fiber
 * Handles the ReactCurrentOwner compatibility issue
 */
export function ThreeCanvas({ children, fallback }: ThreeCanvasProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [CanvasComponent, setCanvasComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Dynamically import Canvas to avoid SSR issues
    import('@react-three/fiber')
      .then((mod) => {
        setCanvasComponent(() => mod.Canvas);
      })
      .catch((err) => {
        console.error('Failed to load React Three Fiber:', err);
        setError(true);
      });
  }, []);

  if (error) {
    return <>{fallback}</>;
  }

  if (!CanvasComponent) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
