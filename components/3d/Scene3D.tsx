'use client';

import { Canvas } from '@react-three/fiber';
import { Float, Environment, useGLTF, Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo, Suspense, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Points as PointsType } from 'three';
import type { MousePosition } from '@/lib/parallax';

interface Scene3DProps {
  mousePosition: MousePosition;
  isZooming: boolean;
  isMobile: boolean;
  onError: () => void;
}

/**
 * Scene3D - Three.js canvas with sneaker model and particles
 */
export function Scene3D({ mousePosition, isZooming, isMobile, onError }: Scene3DProps) {
  useEffect(() => {
    // Preload the model
    useGLTF.preload('/3d_data/source/model.glb');
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      className="absolute inset-0"
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={() => {
        // Canvas created successfully
      }}
      onError={() => onError()}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#FF6B35" />
      {!isMobile && (
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} color="#4ECDC4" />
      )}
      
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <SneakerModel mousePosition={mousePosition} isZooming={isZooming} />
        </Float>
        {!isMobile && <ParticleField />}
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

/**
 * SneakerModel - GLB model with rotation and parallax
 */
function SneakerModel({ mousePosition, isZooming }: { mousePosition: MousePosition; isZooming: boolean }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF('/3d_data/source/model.glb');

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
      
      if (!isZooming) {
        groupRef.current.rotation.x = mousePosition.y * 0.3;
        groupRef.current.rotation.z = mousePosition.x * 0.1;
      }
      
      if (isZooming) {
        groupRef.current.position.z += delta * 10;
        groupRef.current.scale.x += delta * 2;
        groupRef.current.scale.y += delta * 2;
        groupRef.current.scale.z += delta * 2;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={2} />
    </group>
  );
}

/**
 * ParticleField - Floating particles for ambient effect
 */
function ParticleField() {
  const pointsRef = useRef<PointsType>(null);
  
  // Generate stable particle positions using useMemo with empty deps
  const positions = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    // Use seeded random for consistent positions
    const seed = 12345;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed + i) * 10000;
      return x - Math.floor(x);
    };
    
    for (let i = 0; i < 500; i++) {
      const i3 = i * 3;
      pos[i3] = (seededRandom(i * 3) - 0.5) * 20;
      pos[i3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * 20;
      pos[i3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#FF6B35" size={0.05} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}
