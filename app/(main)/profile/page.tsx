'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Profile Page - Redirects to user's own profile
 * Redirects to /profile/[username] for the current user
 */
export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to the user's own profile page
      router.replace(`/profile/${user.username}`);
    } else if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace('/login');
    }
  }, [user, isAuthenticated, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-32 bg-card rounded-lg mb-4"></div>
          <div className="h-12 bg-card rounded-lg mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 bg-card rounded-lg"></div>
            <div className="h-48 bg-card rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
