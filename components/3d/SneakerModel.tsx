'use client';

import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { calculateParallaxRotation, type MousePosition } from '@/lib/parallax';

interface SneakerModelProps {
  mousePosition: MousePosition;
  isZooming: boolean;
}

/**
 * SneakerModel component loads and displays a GLB sneaker model
 * with auto-rotation and parallax effects based on mouse position
 */
export function SneakerModel({ mousePosition, isZooming }: SneakerModelProps) {
  const groupRef = useRef<Group>(null);
  
  // Load the GLB model from the 3d_data directory
  const { scene } = useGLTF('/3d_data/source/model.glb');
  
  // Auto-rotation and parallax effect
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Auto-rotation on Y-axis
      groupRef.current.rotation.y += delta * 0.3;
      
      // Parallax effect based on mouse position
      if (!isZooming) {
        const parallaxRotation = calculateParallaxRotation(mousePosition);
        groupRef.current.rotation.x = parallaxRotation.x;
        groupRef.current.rotation.z = parallaxRotation.z;
      }
      
      // Zoom animation when transitioning
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

// Preload the model
useGLTF.preload('/3d_data/source/model.glb');
