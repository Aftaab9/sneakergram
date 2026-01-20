'use client';

import { User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

export interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onFollow?: (userId: string) => void;
  onEdit?: () => void;
}

/**
 * ProfileHeader component displays user profile information
 * 
 * @example
 * ```tsx
 * <ProfileHeader 
 *   user={user} 
 *   isOwnProfile={true}
 *   onEdit={handleEdit}
 * />
 * ```
 */
export function ProfileHeader({ user, isOwnProfile, onFollow, onEdit }: ProfileHeaderProps) {
  // Map verification level to badge variant
  const getBadgeVariant = () => {
    switch (user.verificationLevel) {
      case 'email':
        return 'info';
      case 'id':
        return 'success';
      case 'gold':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4"
    >
      {/* Avatar and Basic Info */}
      <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
        <Avatar
          src={user.avatar}
          alt={user.displayName}
          size="lg"
          verified={user.verified}
          verificationLevel={user.verificationLevel}
        />
        
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{user.displayName}</h1>
            {user.verified && (
              <Badge variant={getBadgeVariant()} size="sm">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-gray-400 mb-3">@{user.username}</p>
          
          {/* Stats */}
          <div className="flex gap-4 sm:gap-6 text-sm">
            <div>
              <span className="font-bold text-foreground">{user.collection.length}</span>
              <span className="text-gray-400 ml-1">kicks</span>
            </div>
            <div>
              <span className="font-bold text-foreground">{user.followers.toLocaleString()}</span>
              <span className="text-gray-400 ml-1">followers</span>
            </div>
            <div>
              <span className="font-bold text-foreground">{user.following.toLocaleString()}</span>
              <span className="text-gray-400 ml-1">following</span>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="w-full sm:w-auto">
          {isOwnProfile ? (
            <Button variant="secondary" onClick={onEdit} className="w-full sm:w-auto">
              Edit Profile
            </Button>
          ) : (
            <Button variant="primary" onClick={() => onFollow?.(user.id)} className="w-full sm:w-auto">
              Follow
            </Button>
          )}
        </div>
      </div>
      
      {/* Bio */}
      {user.bio && (
        <p className="text-foreground mb-3 text-sm sm:text-base">{user.bio}</p>
      )}
      
      {/* Additional Info */}
      <div className="flex gap-4 text-sm text-gray-400">
        {user.shoeSize && (
          <div className="flex items-center gap-1">
            <span>👟</span>
            <span>Size {user.shoeSize}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
