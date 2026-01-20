/**
 * Authentication Store
 * Manages user authentication state and operations
 * Implements demo mode that accepts any credentials
 */

import { create } from 'zustand';
import { User, LoginInput, SignupInput, VerificationLevel } from '@/types';
import { mockUsers } from '@/lib/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get user by email from localStorage registered users registry
 */
function getUserByEmail(email: string): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const allUsersKey = 'sneakergram_all_users';
    const allUsersData = localStorage.getItem(allUsersKey);
    if (allUsersData) {
      const users: User[] = JSON.parse(allUsersData);
      const user = users.find(u => u.email === email);
      if (user) {
        // Convert date strings back to Date objects
        user.createdAt = new Date(user.createdAt);
        user.updatedAt = new Date(user.updatedAt);
        return user;
      }
    }
  } catch (error) {
    console.error('Failed to get user by email:', error);
  }
  
  return null;
}

/**
 * Save user to all users registry
 */
function saveUserToRegistry(user: User): void {
  if (typeof window === 'undefined') return;
  
  try {
    const allUsersKey = 'sneakergram_all_users';
    const allUsersData = localStorage.getItem(allUsersKey);
    const users: User[] = allUsersData ? JSON.parse(allUsersData) : [];
    
    // Remove existing user with same email if exists
    const filteredUsers = users.filter(u => u.email !== user.email);
    filteredUsers.push(user);
    
    localStorage.setItem(allUsersKey, JSON.stringify(filteredUsers));
  } catch (error) {
    console.error('Failed to save user to registry:', error);
  }
}

/**
 * Get user from localStorage (current session)
 */
function getUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedUser = localStorage.getItem('sneakergram_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Convert date strings back to Date objects
      user.createdAt = new Date(user.createdAt);
      user.updatedAt = new Date(user.updatedAt);
      return user;
    }
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
  }
  
  return null;
}

/**
 * Save user to localStorage (current session)
 */
function saveUserToStorage(user: User): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('sneakergram_user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
}

/**
 * Remove user from localStorage (current session)
 */
function removeUserFromStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('sneakergram_user');
  } catch (error) {
    console.error('Failed to remove user from localStorage:', error);
  }
}

/**
 * Check if username already exists
 */
function usernameExists(username: string): boolean {
  // Check mock users
  if (mockUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return true;
  }
  
  // Check localStorage for registered users
  if (typeof window === 'undefined') return false;
  
  try {
    const registeredUsers = localStorage.getItem('sneakergram_registered_users');
    if (registeredUsers) {
      const users: string[] = JSON.parse(registeredUsers);
      return users.some(u => u.toLowerCase() === username.toLowerCase());
    }
  } catch (error) {
    console.error('Failed to check registered users:', error);
  }
  
  return false;
}

/**
 * Add username to registered users list
 */
function addRegisteredUsername(username: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const registeredUsers = localStorage.getItem('sneakergram_registered_users');
    const users: string[] = registeredUsers ? JSON.parse(registeredUsers) : [];
    users.push(username);
    localStorage.setItem('sneakergram_registered_users', JSON.stringify(users));
  } catch (error) {
    console.error('Failed to add registered username:', error);
  }
}

/**
 * Authentication Store
 * Implements demo mode authentication and signup with localStorage persistence
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  /**
   * Demo mode login - accepts any credentials
   * Property 41: Demo mode accepts all credentials
   * Validates: Requirements 15.2
   */
  login: async (credentials: LoginInput) => {
    // Simulate network delay for realistic demo (reduced for testing)
    await new Promise(resolve => setTimeout(resolve, 50));

    // Demo mode: Accept any credentials
    // Check if user exists in mock data first
    let user: User | null = mockUsers.find(u => u.email === credentials.email) || null;

    if (!user) {
      // Check if user exists in the all users registry
      user = getUserByEmail(credentials.email);
      
      if (!user) {
        // Check if user exists in current session storage
        const storedUser = getUserFromStorage();
        if (storedUser && storedUser.email === credentials.email) {
          user = storedUser;
        } else {
          // Create a demo user for any credentials
          user = {
            id: generateUserId(),
            username: credentials.email.split('@')[0],
            displayName: credentials.email.split('@')[0],
            email: credentials.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
            bio: 'New sneaker enthusiast',
            shoeSize: '10',
            verified: false,
            verificationLevel: VerificationLevel.EMAIL,
            followers: 0,
            following: 0,
            collection: [],
            wishlist: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
      }
    }

    // Save to localStorage and update state
    saveUserToStorage(user);
    set({ user, isAuthenticated: true, loading: false });
  },

  /**
   * Signup with localStorage persistence
   * Property 2: Valid signup data creates account
   * Validates: Requirements 2.2
   */
  signup: async (data: SignupInput) => {
    // Simulate network delay for realistic demo (reduced for testing)
    await new Promise(resolve => setTimeout(resolve, 50));

    // Validate required fields
    if (!data.username || !data.email || !data.password || !data.displayName) {
      throw new Error('All required fields must be provided');
    }

    // Check if username already exists
    if (usernameExists(data.username)) {
      throw new Error('Username already exists');
    }

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      username: data.username,
      displayName: data.displayName,
      email: data.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      bio: data.bio || '',
      shoeSize: data.shoeSize || '10',
      verified: false,
      verificationLevel: VerificationLevel.EMAIL,
      followers: 0,
      following: 0,
      collection: [],
      wishlist: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to localStorage (current session)
    saveUserToStorage(newUser);
    
    // Save to all users registry (persistent across sessions)
    saveUserToRegistry(newUser);
    
    // Add username to registered users list
    addRegisteredUsername(data.username);

    // Update state
    set({ user: newUser, isAuthenticated: true, loading: false });
  },

  /**
   * Logout - clear user session
   */
  logout: () => {
    removeUserFromStorage();
    set({ user: null, isAuthenticated: false, loading: false });
  },

  /**
   * Initialize auth state from localStorage on app load
   */
  initializeAuth: () => {
    const user = getUserFromStorage();
    if (user) {
      set({ user, isAuthenticated: true, loading: false });
    } else {
      set({ loading: false });
    }
  },
}));

/**
 * Utility function to get current user
 */
export function getCurrentUser(): User | null {
  return useAuthStore.getState().user;
}

/**
 * Utility function to check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated;
}

/**
 * Utility function to require authentication
 * Throws error if user is not authenticated
 */
export function requireAuth(): User {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}
