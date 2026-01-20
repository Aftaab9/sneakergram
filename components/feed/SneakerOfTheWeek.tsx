'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trophy, TrendingUp, Heart, Share2, ShoppingCart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BEST_SNEAKER_IMAGES } from '@/lib/bestImages';

interface SneakerOfWeek {
  id: string;
  name: string;
  brand: string;
  image: string;
  votes: number;
  price: number;
  releaseDate: string;
  description: string;
  trending: boolean;
}

const SNEAKERS_OF_WEEK: SneakerOfWeek[] = [
  {
    id: 'sotw-1',
    name: 'Travis Scott x Fragment',
    brand: 'Air Jordan 1 High',
    image: BEST_SNEAKER_IMAGES.travisScottFragment,
    votes: 15234,
    price: 2500,
    releaseDate: '2021-07-29',
    description: 'The ultimate collab between Travis Scott and Fragment Design',
    trending: true,
  },
  {
    id: 'sotw-2',
    name: 'Reverse Panda',
    brand: 'Air Jordan 1',
    image: BEST_SNEAKER_IMAGES.reversePanda,
    votes: 12890,
    price: 180,
    releaseDate: '2024-02-19',
    description: 'Clean black and white colorway that goes with everything',
    trending: true,
  },
  {
    id: 'sotw-3',
    name: 'Animal Instinct 2.0',
    brand: 'Air Jordan 3',
    image: BEST_SNEAKER_IMAGES.airJordan3Animal,
    votes: 9876,
    price: 225,
    releaseDate: '2019-03-30',
    description: 'Bold animal print with premium materials',
    trending: false,
  },
];

export function SneakerOfTheWeek() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const currentSneaker = SNEAKERS_OF_WEEK[currentIndex];

  // Auto-rotate every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SNEAKERS_OF_WEEK.length);
      setHasVoted(false);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleVote = () => {
    if (!hasVoted) {
      setHasVoted(true);
      // In real app, send vote to backend
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 border border-primary/30 rounded-2xl overflow-hidden mb-4 shadow-glow-strong">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-foreground">Sneaker of the Week</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Ends in 3 days</span>
        </div>
      </div>

      {/* Sneaker Showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSneaker.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Image */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-black">
            <Image
              src={currentSneaker.image}
              alt={currentSneaker.name}
              fill
              className="object-contain p-8"
              unoptimized
            />
            
            {/* Trending Badge */}
            {currentSneaker.trending && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                <TrendingUp className="w-3 h-3" />
                TRENDING
              </div>
            )}

            {/* Rank Badge */}
            <div className="absolute top-4 left-4 bg-yellow-500 text-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
              #{currentIndex + 1}
            </div>
          </div>

          {/* Details */}
          <div className="p-4 bg-black/60 backdrop-blur-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-xl font-bold text-foreground mb-1">
                  {currentSneaker.name}
                </h4>
                <p className="text-sm text-gray-400">{currentSneaker.brand}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">${currentSneaker.price}</p>
                <p className="text-xs text-gray-400">Market Value</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 mb-4 line-clamp-2">
              {currentSneaker.description}
            </p>

            {/* Votes */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-primary to-pink-500"
                />
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentSneaker.votes.toLocaleString()} votes
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleVote}
                disabled={hasVoted}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                  hasVoted
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-foreground hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                <span className="text-sm">{hasVoted ? 'Voted' : 'Vote'}</span>
              </button>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-center gap-2 py-3 bg-gray-800 text-foreground rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Details</span>
              </button>

              <button className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm">Buy</span>
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {SNEAKERS_OF_WEEK.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`View sneaker ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Extended Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 bg-black/40 backdrop-blur-sm overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Release Date</span>
                <span className="text-foreground font-medium">{currentSneaker.releaseDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Retail Price</span>
                <span className="text-foreground font-medium">${currentSneaker.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Resale Value</span>
                <span className="text-green-500 font-medium">+{Math.floor(Math.random() * 200)}%</span>
              </div>
              <button className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share with Friends
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
