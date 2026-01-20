'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import 3D component with no SSR
const Scene3DLanding = dynamic(
  () => import('@/components/3d/Scene3DLanding').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

// Fallback images
const LANDING_IMAGES = [
  '/data/best/360_F_410655365_MjietOoPZAMAdqA74M6EXqRL3F8g5dHH.jpg',
  '/data/best/air jordan red.png',
  '/data/best/nike jordan black and reds.png',
  '/data/best/Air jordan blue.jpg',
  '/data/best/stylish-yellow-black-sneakers-free-png.png',
];

// Fixed particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { x: 10, y: 20 }, { x: 25, y: 45 }, { x: 40, y: 15 }, { x: 55, y: 70 },
  { x: 70, y: 30 }, { x: 85, y: 55 }, { x: 15, y: 80 }, { x: 30, y: 10 },
  { x: 45, y: 60 }, { x: 60, y: 25 }, { x: 75, y: 85 }, { x: 90, y: 40 },
  { x: 5, y: 50 }, { x: 20, y: 75 }, { x: 35, y: 35 }, { x: 50, y: 90 },
  { x: 65, y: 5 }, { x: 80, y: 65 }, { x: 95, y: 20 }, { x: 12, y: 95 },
];

export default function LandingPage() {
  const router = useRouter();
  const [isZooming, setIsZooming] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [use3D, setUse3D] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % LANDING_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEnter = () => {
    setIsZooming(true);
    setTimeout(() => router.push('/login'), 600);
  };

  const handle3DError = () => {
    setUse3D(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
      
      {/* Animated Background Particles - Only render after mount */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLE_POSITIONS.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              animate={{
                y: [-20, -100, -20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* 3D Sneaker Model or Fallback Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        {mounted && use3D ? (
          <div className="w-full h-full max-w-[600px] max-h-[600px]">
            <Scene3DLanding 
              mousePosition={mousePosition} 
              isZooming={isZooming}
              onError={handle3DError}
            />
          </div>
        ) : (
          <motion.div
            initial={{ scale: 1, rotate: -5 }}
            animate={isZooming 
              ? { scale: 15, opacity: 0 } 
              : { y: [0, -20, 0], rotate: [-5, 5, -5], scale: [1, 1.05, 1] }
            }
            transition={isZooming 
              ? { duration: 0.6, ease: 'easeInOut' } 
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px]"
          >
            <Image
              src={LANDING_IMAGES[currentImage]}
              alt="Featured Sneaker"
              fill
              className="object-contain drop-shadow-2xl"
              priority
              unoptimized
              style={{ filter: 'drop-shadow(0 20px 40px rgba(138, 43, 226, 0.4))' }}
            />
          </motion.div>
        )}
      </div>

      {/* UI Overlay */}
      {!isZooming && (
        <div className="absolute inset-0 flex flex-col items-center justify-between py-16 z-10 pointer-events-none">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Sneakergram
            </h1>
            <p className="text-muted mt-2 text-sm md:text-base">
              Your Kicks. Your Community.
            </p>
          </motion.div>

          <div className="flex-1" />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4 pointer-events-auto"
          >
            {/* 3D Toggle */}
            {mounted && (
              <button
                onClick={() => setUse3D(!use3D)}
                className="text-xs text-muted hover:text-foreground transition-colors mb-2"
              >
                {use3D ? '🎮 3D Mode' : '🖼️ 2D Mode'} - Tap to switch
              </button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold text-base hover:opacity-90 transition-opacity"
            >
              Get Started
            </motion.button>
            <p className="text-muted text-xs">Join 50,000+ sneakerheads</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
