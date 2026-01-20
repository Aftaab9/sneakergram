/**
 * SneakerViewer3D Component
 * Interactive CSS-based 3D sneaker viewer for the community page
 * Uses CSS transforms instead of Three.js to avoid SSR/hydration issues
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { RotateCcw, ZoomIn, X, Play, Pause } from 'lucide-react';

interface SneakerViewer3DProps {
  onClose?: () => void;
  isFullscreen?: boolean;
}

// Multiple angles of the sneaker for pseudo-3D effect
const SNEAKER_IMAGES = [
  '/data/best/air jordan red.png',
  '/data/best/nike jordan black and reds.png',
  '/data/best/Air jordan blue.jpg',
  '/data/best/stylish-yellow-black-sneakers-free-png.png',
];

/**
 * Main SneakerViewer3D Component - CSS-based 3D effect
 */
export function SneakerViewer3D({ onClose, isFullscreen = false }: SneakerViewer3DProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Auto-rotate effect
  useEffect(() => {
    if (!isAutoRotate || isDragging) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: prev.y + 1,
      }));
    }, 30);

    return () => clearInterval(interval);
  }, [isAutoRotate, isDragging]);

  // Change image based on rotation
  useEffect(() => {
    const normalizedY = ((rotation.y % 360) + 360) % 360;
    const imageIndex = Math.floor(normalizedY / 90) % SNEAKER_IMAGES.length;
    setCurrentImage(imageIndex);
  }, [rotation.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotate(false);
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;
    
    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }));
    
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotate(false);
    const touch = e.touches[0];
    lastPosition.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastPosition.current.x;
    const deltaY = touch.clientY - lastPosition.current.y;
    
    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }));
    
    lastPosition.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)));
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsAutoRotate(true);
  };

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
            <p className="text-xs text-muted">Interactive 3D View</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              aria-label={isAutoRotate ? 'Pause rotation' : 'Play rotation'}
            >
              {isAutoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={resetView}
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
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3D Viewer Area */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{ perspective: '1000px' }}
      >
        {/* Sneaker with 3D transform */}
        <motion.div
          className="relative w-64 h-64 md:w-80 md:h-80"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Main sneaker image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={SNEAKER_IMAGES[currentImage]}
              alt="Nike Air Shoes"
              fill
              className="object-contain drop-shadow-2xl"
              style={{ 
                filter: 'drop-shadow(0 20px 40px rgba(138, 43, 226, 0.4))',
              }}
              unoptimized
              priority
              draggable={false}
            />
          </div>

          {/* Reflection effect */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-20 blur-sm"
            style={{
              transform: 'scaleY(-1) translateY(100%)',
              maskImage: 'linear-gradient(to bottom, transparent, black)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
            }}
          >
            <Image
              src={SNEAKER_IMAGES[currentImage]}
              alt=""
              fill
              className="object-contain"
              unoptimized
              draggable={false}
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* Glow effect */}
        <div 
          className="absolute w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none"
          style={{
            transform: `translateX(${rotation.y * 0.5}px) translateY(${rotation.x * 0.5}px)`,
          }}
        />
      </div>

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

      {/* Image indicator dots */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1">
        {SNEAKER_IMAGES.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === currentImage ? 'bg-primary' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default SneakerViewer3D;
