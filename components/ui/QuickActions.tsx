'use client';

import { useState } from 'react';
import { Plus, Camera, ShoppingBag, Calendar, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CreatePost } from '@/components/feed/CreatePost';

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const router = useRouter();

  const actions = [
    {
      icon: Camera,
      label: 'Create Post',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {
        setIsOpen(false);
        setShowCreatePost(true);
      },
    },
    {
      icon: ShoppingBag,
      label: 'List Sneaker',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => {
        setIsOpen(false);
        router.push('/marketplace?action=create');
      },
    },
    {
      icon: Calendar,
      label: 'Browse Events',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => {
        setIsOpen(false);
        router.push('/events');
      },
    },
    {
      icon: Sparkles,
      label: 'Book Service',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      onClick: () => {
        setIsOpen(false);
        router.push('/services');
      },
    },
  ];

  return (
    <>
      {/* Quick Actions Menu */}
      <div className="fixed bottom-20 right-4 z-50 lg:bottom-6 lg:right-6">
        {/* Action Buttons */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 mb-2">
            {actions.map((action, index) => (
              <div
                key={action.label}
                className="flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                  {action.label}
                </span>
                <button
                  onClick={action.onClick}
                  className={`${action.color} text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110`}
                  aria-label={action.label}
                >
                  <action.icon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-primary text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 ${
            isOpen ? 'rotate-45' : ''
          }`}
          aria-label="Quick actions"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>

      {/* Create Post Modal */}
      <CreatePost isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
    </>
  );
}
