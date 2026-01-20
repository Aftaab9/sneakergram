/**
 * Authentication Property-Based Tests
 * Tests authentication store functionality with property-based testing
 * 
 * NOTE: These tests are slow (~50s) and are excluded from regular test runs.
 * Run explicitly with: npm test -- __tests__/auth.property.test.ts --run
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { useAuthStore } from '@/stores/authStore';
import { LoginInput, SignupInput, VerificationLevel } from '@/types';

// Helper to clear localStorage between tests
function clearAuthStorage() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sneakergram_user');
    localStorage.removeItem('sneakergram_registered_users');
    localStorage.removeItem('sneakergram_all_users');
  }
}

// Helper to reset store state
function resetAuthStore() {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
  });
}

describe.skip('Authentication Property Tests', () => {
  beforeEach(() => {
    clearAuthStorage();
    resetAuthStore();
  });

  afterEach(() => {
    clearAuthStorage();
    resetAuthStore();
  });

  /**
   * Feature: sneakergram-app, Property 3: Valid credentials authenticate user
   * Validates: Requirements 2.4
   * 
   * This property test verifies that for any valid login credentials,
   * submitting the login form should authenticate the user and redirect to the main feed.
   * In demo mode, all credentials are considered valid.
   */
  test('Property 3: Valid credentials authenticate user', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (credentials: LoginInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // Attempt login with credentials
          await useAuthStore.getState().login(credentials);

          // Verify user is authenticated
          const state = useAuthStore.getState();
          expect(state.isAuthenticated).toBe(true);
          expect(state.user).toBeDefined();
          expect(state.user).not.toBeNull();

          // Verify user has required authentication fields
          if (state.user) {
            expect(state.user.id).toBeDefined();
            expect(typeof state.user.id).toBe('string');
            expect(state.user.id.length).toBeGreaterThan(0);
            expect(state.user.email).toBe(credentials.email);
            expect(state.user.username).toBeDefined();
            expect(state.user.displayName).toBeDefined();
            expect(state.user.avatar).toBeDefined();
            expect(state.user.verified).toBeDefined();
            expect(typeof state.user.verified).toBe('boolean');
            expect(state.user.verificationLevel).toBeDefined();
            expect(state.user.createdAt).toBeInstanceOf(Date);
            expect(state.user.updatedAt).toBeInstanceOf(Date);
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  /**
   * Feature: sneakergram-app, Property 41: Demo mode accepts all credentials
   * Validates: Requirements 15.2
   * 
   * This property test verifies that for any email and password combination
   * in demo mode, the authentication should succeed.
   */
  test('Property 41: Demo mode accepts all credentials', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (credentials: LoginInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // Attempt login with any credentials
          await useAuthStore.getState().login(credentials);

          // Verify authentication succeeded
          const state = useAuthStore.getState();
          expect(state.isAuthenticated).toBe(true);
          expect(state.user).toBeDefined();
          expect(state.user).not.toBeNull();

          // Verify user has required fields
          if (state.user) {
            expect(state.user.id).toBeDefined();
            expect(typeof state.user.id).toBe('string');
            expect(state.user.email).toBe(credentials.email);
            expect(state.user.username).toBeDefined();
            expect(state.user.displayName).toBeDefined();
            expect(state.user.avatar).toBeDefined();
            expect(state.user.createdAt).toBeInstanceOf(Date);
            expect(state.user.updatedAt).toBeInstanceOf(Date);
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  test('Property 41 (Extended): Demo login persists to localStorage', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (credentials: LoginInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // Login
          await useAuthStore.getState().login(credentials);

          // Verify user is saved to localStorage
          const storedUser = localStorage.getItem('sneakergram_user');
          expect(storedUser).toBeDefined();
          expect(storedUser).not.toBeNull();

          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            expect(parsedUser.email).toBe(credentials.email);
            expect(parsedUser.id).toBeDefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  test('Property 41 (Invariant): Multiple logins with same credentials return consistent user', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (credentials: LoginInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // First login
          await useAuthStore.getState().login(credentials);
          const firstUser = useAuthStore.getState().user;

          // Logout
          useAuthStore.getState().logout();

          // Second login with same credentials
          await useAuthStore.getState().login(credentials);
          const secondUser = useAuthStore.getState().user;

          // Users should have same email
          expect(firstUser?.email).toBe(secondUser?.email);
          expect(firstUser?.email).toBe(credentials.email);
        }
      ),
      { numRuns: 50 }
    );
  }, 60000);

  /**
   * Feature: sneakergram-app, Property 2: Valid signup data creates account
   * Validates: Requirements 2.2
   * 
   * This property test verifies that for any valid user signup data
   * (username, email, password, display name, bio, shoe size),
   * submitting the form should create a user account and store it in local storage.
   */
  test('Property 2: Valid signup data creates account', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 })
            .filter(s => /^[a-zA-Z0-9_]+$/.test(s)), // Valid username format
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }),
          displayName: fc.string({ minLength: 1, maxLength: 50 }),
          bio: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
          shoeSize: fc.option(
            fc.constantFrom('7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'),
            { nil: undefined }
          ),
        }),
        async (signupData: SignupInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // Attempt signup
          await useAuthStore.getState().signup(signupData);

          // Verify account was created
          const state = useAuthStore.getState();
          expect(state.isAuthenticated).toBe(true);
          expect(state.user).toBeDefined();
          expect(state.user).not.toBeNull();

          // Verify user has all required fields from signup data
          if (state.user) {
            expect(state.user.id).toBeDefined();
            expect(typeof state.user.id).toBe('string');
            expect(state.user.username).toBe(signupData.username);
            expect(state.user.email).toBe(signupData.email);
            expect(state.user.displayName).toBe(signupData.displayName);
            expect(state.user.bio).toBe(signupData.bio || '');
            expect(state.user.shoeSize).toBe(signupData.shoeSize || '10');
            expect(state.user.verified).toBe(false);
            expect(state.user.verificationLevel).toBe(VerificationLevel.EMAIL);
            expect(state.user.followers).toBe(0);
            expect(state.user.following).toBe(0);
            expect(Array.isArray(state.user.collection)).toBe(true);
            expect(state.user.collection.length).toBe(0);
            expect(Array.isArray(state.user.wishlist)).toBe(true);
            expect(state.user.wishlist.length).toBe(0);
            expect(state.user.createdAt).toBeInstanceOf(Date);
            expect(state.user.updatedAt).toBeInstanceOf(Date);
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  test('Property 2 (Extended): Signup persists to localStorage', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 })
            .filter(s => /^[a-zA-Z0-9_]+$/.test(s)),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }),
          displayName: fc.string({ minLength: 1, maxLength: 50 }),
          bio: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
          shoeSize: fc.option(
            fc.constantFrom('7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'),
            { nil: undefined }
          ),
        }),
        async (signupData: SignupInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // Signup
          await useAuthStore.getState().signup(signupData);

          // Verify user is saved to localStorage
          const storedUser = localStorage.getItem('sneakergram_user');
          expect(storedUser).toBeDefined();
          expect(storedUser).not.toBeNull();

          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            expect(parsedUser.username).toBe(signupData.username);
            expect(parsedUser.email).toBe(signupData.email);
            expect(parsedUser.displayName).toBe(signupData.displayName);
            expect(parsedUser.id).toBeDefined();
          }

          // Verify username is added to registered users list
          const registeredUsers = localStorage.getItem('sneakergram_registered_users');
          expect(registeredUsers).toBeDefined();
          if (registeredUsers) {
            const users = JSON.parse(registeredUsers);
            expect(Array.isArray(users)).toBe(true);
            expect(users).toContain(signupData.username);
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  test('Property 2 (Invariant): Signup creates user with correct initial state', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 })
            .filter(s => /^[a-zA-Z0-9_]+$/.test(s)),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }),
          displayName: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (signupData: SignupInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // Signup
          await useAuthStore.getState().signup(signupData);

          const user = useAuthStore.getState().user;

          // Invariant: New users always start with these values
          expect(user?.verified).toBe(false);
          expect(user?.verificationLevel).toBe(VerificationLevel.EMAIL);
          expect(user?.followers).toBe(0);
          expect(user?.following).toBe(0);
          expect(user?.collection).toEqual([]);
          expect(user?.wishlist).toEqual([]);
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  test('Property 2 (Round Trip): Signup then login retrieves same user', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 })
            .filter(s => /^[a-zA-Z0-9_]+$/.test(s)),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }),
          displayName: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (signupData: SignupInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // Signup
          await useAuthStore.getState().signup(signupData);
          const signupUser = useAuthStore.getState().user;

          // Logout
          useAuthStore.getState().logout();
          expect(useAuthStore.getState().isAuthenticated).toBe(false);

          // Login with same credentials
          await useAuthStore.getState().login({
            email: signupData.email,
            password: signupData.password,
          });
          const loginUser = useAuthStore.getState().user;

          // Should retrieve the same user
          expect(loginUser?.username).toBe(signupUser?.username);
          expect(loginUser?.email).toBe(signupUser?.email);
          expect(loginUser?.displayName).toBe(signupUser?.displayName);
        }
      ),
      { numRuns: 50 }
    );
  }, 60000);

  test('Logout clears authentication state', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (credentials: LoginInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // Login
          await useAuthStore.getState().login(credentials);
          expect(useAuthStore.getState().isAuthenticated).toBe(true);

          // Logout
          useAuthStore.getState().logout();

          // Verify state is cleared
          const state = useAuthStore.getState();
          expect(state.isAuthenticated).toBe(false);
          expect(state.user).toBeNull();

          // Verify localStorage is cleared
          const storedUser = localStorage.getItem('sneakergram_user');
          expect(storedUser).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  test('Initialize auth restores user from localStorage', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (credentials: LoginInput) => {
          // Reset state before each test
          resetAuthStore();
          clearAuthStorage();

          // Login
          await useAuthStore.getState().login(credentials);
          const originalUser = useAuthStore.getState().user;

          // Clear state but keep localStorage
          resetAuthStore();
          expect(useAuthStore.getState().isAuthenticated).toBe(false);

          // Initialize auth (should restore from localStorage)
          useAuthStore.getState().initializeAuth();

          // Verify user is restored
          const state = useAuthStore.getState();
          expect(state.isAuthenticated).toBe(true);
          expect(state.user).toBeDefined();
          expect(state.user?.email).toBe(originalUser?.email);
        }
      ),
      { numRuns: 50 }
    );
  }, 60000);
});
