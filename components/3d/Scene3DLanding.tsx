/**
 * Scene3DLanding Component
 * 3D scene for the landing page with Nike Air Shoes GLB model
 */

'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

interface MousePosition {
  x: number;
  y: number;
}

interface Scene3DLandingProps {
  mousePosition: MousePosition;
  isZooming: boolean;
  onError?: () => void;
}

/**
 * Nike Air Shoes 3D Model Component
 */
function NikeAirShoes({ mousePosition, isZooming }: { mousePosition: MousePosition; isZooming: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Load the GLB model
  const { scene } = useGLTF('/data/best/uploads_files_4278121_Nike_Air_Shoes.glb');
  
  useEffect(() => {
    if (scene) {
      setModelLoaded(true);
      // Apply materials to make the model look better
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
  
  // Animation
  useFrame((state, delta) => {
    if (groupRef.current && modelLoaded) {
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
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <group ref={groupRef} scale={[2.5, 2.5, 2.5]} position={[0, 0, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

/**
 * Scene Setup Component
 */
function SceneSetup() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 1, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return null;
}

/**
 * Loading Fallback
 */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff6b35" wireframe />
    </mesh>
  );
}

/**
 * Main Scene3DLanding Component
 */
function Scene3DLanding({ mousePosition, isZooming, onError }: Scene3DLandingProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
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

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted">
        <p>3D not supported</p>
      </div>
    );
  }

  return (
    <Canvas
      shadows
      camera={{ position: [0, 1, 5], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <SceneSetup />
      
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
        <NikeAirShoes mousePosition={mousePosition} isZooming={isZooming} />
      </Suspense>
      
      {/* Shadow */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
      
      {/* Controls - disabled for landing page */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate={false}
      />
    </Canvas>
  );
}

// Preload the model
useGLTF.preload('/data/best/uploads_files_4278121_Nike_Air_Shoes.glb');

export default Scene3DLanding;
