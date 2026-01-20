/**
 * Scene3DLanding Component
 * 3D scene for the landing page with Nike Air Shoes GLB model
 */

'use client';

import { Suspense, useRef, useEffect, useState, Component, ReactNode } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface Scene3DLandingProps {
  mousePosition: MousePosition;
  isZooming: boolean;
  onError?: () => void;
}

const MODEL_PATH = '/data/best/uploads_files_4278121_Nike_Air_Shoes.glb';

/**
 * Simple Error Boundary
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SimpleErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    this.props.onError?.();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Error Fallback Component
 */
function ErrorFallback({ onError }: { onError?: () => void }) {
  useEffect(() => {
    onError?.();
  }, [onError]);

  return (
    <div className="w-full h-full flex items-center justify-center text-muted">
      <p>3D not available</p>
    </div>
  );
}

/**
 * Loading Component
 */
function LoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Inner 3D Scene Component - Only loaded when Three.js is available
 */
function Scene3DInner({ mousePosition, isZooming }: { mousePosition: MousePosition; isZooming: boolean }) {
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [ThreeComponents, setThreeComponents] = useState<{
    Canvas: React.ComponentType<React.PropsWithChildren<Record<string, unknown>>>;
    useFrame: (callback: (state: { clock: { elapsedTime: number } }, delta: number) => void) => void;
    useGLTF: (path: string) => { scene: THREE.Object3D };
    OrbitControls: React.ComponentType<Record<string, unknown>>;
    Environment: React.ComponentType<{ preset: string }>;
    ContactShadows: React.ComponentType<Record<string, unknown>>;
    Float: React.ComponentType<React.PropsWithChildren<Record<string, unknown>>>;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadThree = async () => {
      try {
        const [fiber, drei] = await Promise.all([
          import('@react-three/fiber'),
          import('@react-three/drei')
        ]);

        if (mounted) {
          setThreeComponents({
            Canvas: fiber.Canvas as React.ComponentType<React.PropsWithChildren<Record<string, unknown>>>,
            useFrame: fiber.useFrame,
            useGLTF: drei.useGLTF,
            OrbitControls: drei.OrbitControls as React.ComponentType<Record<string, unknown>>,
            Environment: drei.Environment as React.ComponentType<{ preset: string }>,
            ContactShadows: drei.ContactShadows as React.ComponentType<Record<string, unknown>>,
            Float: drei.Float as React.ComponentType<React.PropsWithChildren<Record<string, unknown>>>,
          });
          setThreeLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load Three.js:', err);
      }
    };

    loadThree();

    return () => {
      mounted = false;
    };
  }, []);

  if (!threeLoaded || !ThreeComponents) {
    return <LoadingSpinner />;
  }

  const { Canvas, OrbitControls, Environment, ContactShadows, Float } = ThreeComponents;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 1, 5], fov: 45 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <spotLight
        position={[-10, 5, -10]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#ff6b35"
      />
      <pointLight position={[0, -5, 0]} intensity={0.3} color="#8b5cf6" />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* 3D Model */}
      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <NikeAirShoes mousePosition={mousePosition} isZooming={isZooming} ThreeComponents={ThreeComponents} />
        </Float>
      </Suspense>
      
      {/* Shadow */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
      
      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate={false}
      />
    </Canvas>
  );
}

/**
 * Nike Air Shoes 3D Model Component
 */
function NikeAirShoes({ 
  mousePosition, 
  isZooming,
  ThreeComponents 
}: { 
  mousePosition: MousePosition; 
  isZooming: boolean;
  ThreeComponents: {
    useFrame: (callback: (state: { clock: { elapsedTime: number } }, delta: number) => void) => void;
    useGLTF: (path: string) => { scene: THREE.Object3D };
  };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { useFrame, useGLTF } = ThreeComponents;
  const { scene } = useGLTF(MODEL_PATH);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Auto-rotation
      groupRef.current.rotation.y += delta * 0.5;
      
      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Parallax effect based on mouse position
      if (!isZooming) {
        const targetRotationX = (mousePosition.y - 0.5) * 0.3;
        const targetRotationZ = (mousePosition.x - 0.5) * 0.2;
        groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
        groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.05;
      }
      
      // Zoom animation
      if (isZooming) {
        groupRef.current.position.z += delta * 15;
        groupRef.current.scale.x += delta * 3;
        groupRef.current.scale.y += delta * 3;
        groupRef.current.scale.z += delta * 3;
      }
    }
  });
  
  return (
    <group ref={groupRef} scale={[2.5, 2.5, 2.5]} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * Main Scene3DLanding Component
 */
function Scene3DLanding({ mousePosition, isZooming, onError }: Scene3DLandingProps) {
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if WebGL is supported
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasError(true);
        onError?.();
      }
    } catch {
      setHasError(true);
      onError?.();
    }
  }, [onError]);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  if (hasError) {
    return <ErrorFallback onError={onError} />;
  }

  return (
    <SimpleErrorBoundary
      fallback={<ErrorFallback onError={onError} />}
      onError={() => {
        setHasError(true);
        onError?.();
      }}
    >
      <Scene3DInner mousePosition={mousePosition} isZooming={isZooming} />
    </SimpleErrorBoundary>
  );
}

export default Scene3DLanding;
