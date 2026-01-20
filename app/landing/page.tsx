'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import 3D components to avoid SSR issues
const Scene3DLanding = dynamic(() => import('@/components/3d/Scene3DLanding'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

// Fallback images if 3D doesn't load
const LANDING_IMAGES = [
  '/data/best/360_F_410655365_MjietOoPZAMAdqA74M6EXqRL3F8g5dHH.jpg',
  '/data/best/air jordan red.png',
  '/data/best/nike jordan black and reds.png',
  '/data/best/Air jordan blue.jpg',
  '/data/best/stylish-yellow-black-sneakers-free-png.png',
];

export default function LandingPage() {
  const router = useRouter();
  const [isZooming, setIsZooming] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [use3D, setUse3D] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

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

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 3D Sneaker Model or Fallback Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        {use3D ? (
          <div className="w-full h-full max-w-[600px] max-h-[600px]">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <Scene3DLanding 
                mousePosition={mousePosition} 
                isZooming={isZooming}
                onError={() => setUse3D(false)}
              />
            </Suspense>
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
        <div className="absolute inset-0 flex flex-col items-center justify-between py-16 z-10">
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
            className="flex flex-col items-center gap-4"
          >
            {/* 3D Toggle */}
            <button
              onClick={() => setUse3D(!use3D)}
              className="text-xs text-muted hover:text-foreground transition-colors mb-2"
            >
              {use3D ? '🎮 3D Mode' : '🖼️ 2D Mode'} - Tap to switch
            </button>

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
