'use client';

import { Canvas } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SneakerModel } from './SneakerModel';
import { FloatingScene } from './FloatingScene';
import { normalizeMousePosition, type MousePosition } from '@/lib/parallax';

interface LandingExperienceProps {
  onEnter: () => void;
}

/**
 * Loading fallback for 3D scene
 */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background to-card">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading experience...</p>
      </div>
    </div>
  );
}

/**
 * 3D Canvas component - only renders on client
 */
function Scene3D({ 
  mousePosition, 
  isZooming, 
  isMobile 
}: { 
  mousePosition: MousePosition; 
  isZooming: boolean; 
  isMobile: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      className="absolute inset-0"
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      {/* Lighting - simplified on mobile */}
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        color="#FF6B35"
        castShadow={!isMobile}
      />
      {!isMobile && (
        <spotLight
          position={[-10, -10, -10]}
          angle={0.15}
          penumbra={1}
          intensity={0.5}
          color="#4ECDC4"
        />
      )}
      
      {/* Floating sneaker model */}
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        <SneakerModel
          mousePosition={mousePosition}
          isZooming={isZooming}
        />
      </Float>
      
      {/* Particle system - reduced on mobile */}
      {!isMobile && <FloatingScene />}
      
      {/* Environment lighting */}
      <Environment preset="city" />
    </Canvas>
  );
}

/**
 * LandingExperience component provides the complete 3D landing page
 * with interactive sneaker model, particles, and overlay UI
 * Optimized for performance with reduced quality on mobile
 */
export function LandingExperience({ onEnter }: LandingExperienceProps) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Ensure we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Detect mobile devices for performance optimization
  useEffect(() => {
    if (!isClient) return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isClient]);
  
  // Track mouse/touch position for parallax effect
  useEffect(() => {
    if (!isClient) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const normalized = normalizeMousePosition(
        e.clientX,
        e.clientY,
        window.innerWidth,
        window.innerHeight
      );
      setMousePosition(normalized);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const normalized = normalizeMousePosition(
          touch.clientX,
          touch.clientY,
          window.innerWidth,
          window.innerHeight
        );
        setMousePosition(normalized);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isClient]);
  
  // Handle enter button click
  const handleEnter = () => {
    setIsZooming(true);
    setShowOverlay(false);
    
    // Transition to auth page after animation
    setTimeout(() => {
      onEnter();
    }, 1500);
  };
  
  // Show loading until client is ready
  if (!isClient) {
    return <LoadingFallback />;
  }
  
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-[#0F0F1A] to-[#1A1A2E]">
      {/* Three.js Canvas with performance optimizations */}
      <Suspense fallback={<LoadingFallback />}>
        <Scene3D 
          mousePosition={mousePosition} 
          isZooming={isZooming} 
          isMobile={isMobile} 
        />
      </Suspense>
      
      {/* Overlay UI */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
          >
            {/* Logo */}
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-wider"
            >
              SNEAKERGRAM
            </motion.h1>
            
            {/* Tagline */}
            <motion.p
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-400 mb-12"
            >
              Your Kicks. Your Community.
            </motion.p>
            
            {/* CTA Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className="pointer-events-auto px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-primary/50 transition-shadow duration-300 animate-pulse"
            >
              TAP TO ENTER
            </motion.button>
            
            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
