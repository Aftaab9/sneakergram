/**
 * Users API Adapter
 * Provides abstraction layer for user data access
 */

import { User, SignupInput, LoginInput, VerificationLevel } from '@/types';
import { mockUsers } from '../mockData';

// API Interface
export interface UsersAPI {
  getUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(input: SignupInput): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  followUser(userId: string, targetUserId: string): Promise<void>;
  unfollowUser(userId: string, targetUserId: string): Promise<void>;
  authenticate(credentials: LoginInput): Promise<User | null>;
  searchUsers(query: string): Promise<User[]>;
}

// Mock Implementation
class MockUsersAPI implements UsersAPI {
  private users: User[] = [...mockUsers];

  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.users];
  }

  async getUserById(userId: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.users.find(u => u.id === userId) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.users.find(u => u.username === username) || null;
  }

  async createUser(input: SignupInput): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if username or email already exists
    const existingUser = this.users.find(
      u => u.username === input.username || u.email === input.email
    );
    
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: input.username,
      displayName: input.displayName,
      email: input.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${input.username}`,
      bio: input.bio || '',
      shoeSize: input.shoeSize || '',
      verified: false,
      verificationLevel: VerificationLevel.EMAIL,
      followers: 0,
      following: 0,
      collection: [],
      wishlist: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updates, { updatedAt: new Date() });
    return user;
  }

  async followUser(userId: string, targetUserId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = this.users.find(u => u.id === userId);
    const targetUser = this.users.find(u => u.id === targetUserId);
    
    if (user && targetUser) {
      user.following++;
      targetUser.followers++;
    }
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = this.users.find(u => u.id === userId);
    const targetUser = this.users.find(u => u.id === targetUserId);
    
    if (user && targetUser) {
      user.following--;
      targetUser.followers--;
    }
  }

  async authenticate(credentials: LoginInput): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Demo mode: accept any credentials
    // In production, this would verify against stored credentials
    const user = this.users.find(u => u.email === credentials.email);
    
    // For demo, return first user if no match found
    return user || this.users[0];
  }

  async searchUsers(query: string): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    return this.users.filter(
      u =>
        u.username.toLowerCase().includes(lowerQuery) ||
        u.displayName.toLowerCase().includes(lowerQuery) ||
        u.bio.toLowerCase().includes(lowerQuery)
    );
  }
}

// Export current implementation
export const usersAPI: UsersAPI = new MockUsersAPI();
