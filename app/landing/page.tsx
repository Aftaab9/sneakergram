'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Best quality images from public/data/best
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % LANDING_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setIsZooming(true);
    setTimeout(() => router.push('/login'), 600);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />

      {/* Animated Sneaker */}
      <div className="absolute inset-0 flex items-center justify-center">
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
