/**
 * SneakerViewer3D Component
 * Interactive 3D sneaker viewer for the community page
 */

'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Float, Html } from '@react-three/drei';
import type { Group } from 'three';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { RotateCcw, ZoomIn, Maximize2 } from 'lucide-react';

const MODEL_PATH = '/data/best/uploads_files_4278121_Nike_Air_Shoes.glb';

interface SneakerViewer3DProps {
  onClose?: () => void;
  isFullscreen?: boolean;
}

/**
 * Nike Air Shoes 3D Model Component
 */
function NikeAirShoes() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);
  
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 1.5;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [scene]);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={[3, 3, 3]} position={[0, 0, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

/**
 * Loading Fallback
 */
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted">Loading 3D Model...</p>
      </div>
    </Html>
  );
}

/**
 * Main SneakerViewer3D Component
 */
export function SneakerViewer3D({ onClose, isFullscreen = false }: SneakerViewer3DProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if WebGL is supported
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    }
  }, []);

  // Preload model
  useEffect(() => {
    useGLTF.preload(MODEL_PATH);
  }, []);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card rounded-xl border border-border">
        <div className="text-center p-8">
          <p className="text-muted mb-2">3D viewer not supported</p>
          <p className="text-xs text-muted/60">Your browser doesn&apos;t support WebGL</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative bg-gradient-to-br from-card via-black to-card rounded-xl border border-border overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50' : 'w-full aspect-square'
      }`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Nike Air Shoes</h3>
            <p className="text-xs text-muted">Interactive 3D Model</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Reset view"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
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
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
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
        <Suspense fallback={<LoadingFallback />}>
          <NikeAirShoes />
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
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Drag to rotate
          </span>
          <span className="flex items-center gap-1">
            <ZoomIn className="w-3 h-3" /> Scroll to zoom
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default SneakerViewer3D;
