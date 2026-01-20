# Design Document

## Overview

SneakerGram is a full-stack social media application built with Next.js 14 (App Router), TypeScript, and modern web technologies. The architecture follows a modular, component-based approach with clear separation between presentation, business logic, and data layers. The application is designed to start with mock data for rapid prototyping and demo purposes, but with a scalable architecture that can seamlessly transition to real backend services (Supabase, external APIs) without major refactoring.

### Key Design Principles

1. **Progressive Enhancement**: Start with mock data, easily swap to real APIs
2. **Component Modularity**: Reusable, self-contained UI components
3. **Type Safety**: Strict TypeScript throughout the application
4. **Performance First**: Optimized animations, lazy loading, code splitting
5. **Mobile-First**: Responsive design starting from 375px
6. **Dark Theme**: Sneaker culture aesthetic with glassmorphism

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 14 App Router                 │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer                                      │
│  ├── Pages (app/)                                        │
│  ├── Components (components/)                            │
│  └── Hooks (hooks/)                                      │
├─────────────────────────────────────────────────────────┤
│  Business Logic Layer                                    │
│  ├── State Management (Zustand)                          │
│  ├── Data Fetching Hooks                                 │
│  └── Utility Functions                                   │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                              │
│  ├── Mock Data (lib/mockData.ts)                         │
│  ├── API Adapters (lib/api/)                             │
│  └── Supabase Client (lib/supabase.ts)                   │
├─────────────────────────────────────────────────────────┤
│  External Services                                       │
│  ├── Supabase (Future: Auth, Database, Storage)          │
│  ├── Gemini API (AI Features)                            │
│  └── Kaggle Dataset (Sneaker Images)                     │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Animations**: Framer Motion 10.x
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **State Management**: Zustand 4.x
- **UI Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Carousel**: Embla Carousel React
- **Backend (Future)**: Supabase
- **AI Integration**: Google Gemini API


## Components and Interfaces

### Component Structure

```
components/
├── 3d/
│   ├── SneakerModel.tsx          # GLB model loader and renderer
│   ├── FloatingScene.tsx         # Particle system and ambient effects
│   └── LandingExperience.tsx     # Complete 3D landing page
├── ui/
│   ├── Button.tsx                # Reusable button with variants
│   ├── Card.tsx                  # Glassmorphism card component
│   ├── Input.tsx                 # Styled input fields
│   ├── Modal.tsx                 # Modal with animations
│   ├── Avatar.tsx                # User avatar with verification badge
│   ├── Badge.tsx                 # Status and verification badges
│   └── BottomNav.tsx             # Main navigation bar
├── feed/
│   ├── PostCard.tsx              # Main post display component
│   ├── CreatePost.tsx            # Post creation modal
│   ├── SneakerOfDay.tsx          # Featured sneaker card
│   ├── LikeButton.tsx            # Animated like button
│   └── CommentSection.tsx        # Comments display and input
├── marketplace/
│   ├── ListingCard.tsx           # Marketplace listing display
│   ├── CreateListing.tsx         # Listing creation form
│   ├── PriceTag.tsx              # Price with market comparison
│   ├── BidModal.tsx              # Bidding interface
│   └── RentOption.tsx            # Rental details component
├── profile/
│   ├── ProfileHeader.tsx         # User profile header
│   ├── SneakerCollection.tsx     # Collection grid
│   ├── WishlistGrid.tsx          # Wishlist display
│   └── VerificationBadge.tsx     # Verification status indicator
├── messages/
│   ├── ChatList.tsx              # Conversation list
│   ├── ChatWindow.tsx            # Message thread display
│   └── MessageBubble.tsx         # Individual message
├── services/
│   ├── ServiceCard.tsx           # Service offering display
│   ├── AuthenticationService.tsx # Sneaker authentication UI
│   └── RentalService.tsx         # Rental booking interface
└── shared/
    ├── Header.tsx                # Page header component
    ├── SearchBar.tsx             # Search input with filters
    ├── SneakerTag.tsx            # Tappable sneaker chip
    └── LoadingSpinner.tsx        # Loading states
```

### Key Component Interfaces

```typescript
// Post Component
interface Post {
  id: string;
  user: User;
  type: 'collection' | 'pickup' | 'fitcheck';
  images: string[];
  caption: string;
  sneakerTags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  canBid: boolean;
  createdAt: Date;
}

// Listing Component
interface Listing {
  id: string;
  seller: User;
  sneaker: Sneaker;
  images: string[];
  size: string;
  condition: number; // 1-10
  price: number;
  marketValue: number;
  type: 'sale' | 'rent' | 'auction';
  rentPrice?: number;
  rentDeposit?: number;
  currentBid?: number;
  bidEndTime?: Date;
  verified: boolean;
  createdAt: Date;
}

// User Component
interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  shoeSize: string;
  verified: boolean;
  verificationLevel: 'email' | 'id' | 'gold';
  followers: number;
  following: number;
  collection: string[]; // sneaker IDs
  wishlist: string[];
}

// Sneaker Component
interface Sneaker {
  id: string;
  brand: string;
  model: string;
  colorway: string;
  releaseDate: string;
  retailPrice: number;
  marketValue: number;
  images: string[];
  sizes: string[];
  description: string;
  ownedByUsers: number;
}
```


## Data Models

### Core Data Models

```typescript
// User Model
type User = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  shoeSize: string;
  verified: boolean;
  verificationLevel: 'email' | 'id' | 'gold';
  followers: number;
  following: number;
  collection: string[];
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Sneaker Model
type Sneaker = {
  id: string;
  brand: string;
  model: string;
  colorway: string;
  releaseDate: string;
  retailPrice: number;
  marketValue: number;
  images: string[];
  sizes: string[];
  description: string;
  ownedByUsers: number;
  category: 'jordan' | 'nike' | 'adidas' | 'yeezy' | 'newbalance' | 'other';
};

// Post Model
type Post = {
  id: string;
  userId: string;
  type: 'collection' | 'pickup' | 'fitcheck';
  images: string[];
  caption: string;
  sneakerTags: string[];
  likes: number;
  comments: Comment[];
  likedBy: string[];
  savedBy: string[];
  canBid: boolean;
  bidSneakerId?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Comment Model
type Comment = {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: Date;
};

// Listing Model
type Listing = {
  id: string;
  sellerId: string;
  sneakerId: string;
  images: string[];
  size: string;
  condition: number;
  price: number;
  type: 'sale' | 'rent' | 'auction';
  rentPrice?: number;
  rentDeposit?: number;
  rentAvailableFrom?: Date;
  rentAvailableTo?: Date;
  currentBid?: number;
  bidHistory?: Bid[];
  bidEndTime?: Date;
  verified: boolean;
  status: 'active' | 'sold' | 'rented' | 'closed';
  createdAt: Date;
  updatedAt: Date;
};

// Bid Model
type Bid = {
  id: string;
  listingId: string;
  userId: string;
  amount: number;
  createdAt: Date;
};

// Message Model
type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  type: 'text' | 'listing' | 'offer' | 'system';
  listingId?: string;
  offerAmount?: number;
  createdAt: Date;
  read: boolean;
};

// Conversation Model
type Conversation = {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  listingContext?: string;
};

// Notification Model
type Notification = {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'bid' | 'save' | 'verification' | 'pricedrop' | 'follow';
  actorId?: string;
  postId?: string;
  listingId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

// Service Model
type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  turnaroundTime: string;
  category: 'authentication' | 'rental' | 'cleaning' | 'restoration';
};
```

### Data Storage Strategy

**Phase 1 (Demo - Current)**:
- All data stored in `lib/mockData.ts`
- User session in localStorage
- State management with Zustand for runtime data

**Phase 2 (Production - Future)**:
- Supabase PostgreSQL for relational data (users, posts, listings)
- Supabase Storage for images and media
- Supabase Auth for authentication
- Real-time subscriptions for messages and notifications
- External API integration for market values


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Parallax responds to all input positions

*For any* mouse or touch position on the 3D landing scene, the sneaker model should apply parallax movement proportional to the input coordinates.

**Validates: Requirements 1.3**

### Property 2: Valid signup data creates account

*For any* valid user signup data (username, email, password, display name, bio, shoe size), submitting the form should create a user account and store it in local storage.

**Validates: Requirements 2.2**

### Property 3: Valid credentials authenticate user

*For any* valid login credentials in demo mode, submitting the login form should authenticate the user and redirect to the main feed.

**Validates: Requirements 2.4**

### Property 4: Posts contain all required fields

*For any* post displayed in the feed, it should contain user information, images, caption, sneaker tags, and engagement metrics (likes, comments).

**Validates: Requirements 3.2**

### Property 5: Double-tap increments likes

*For any* post, double-tapping the image should increment the like count by one and mark the post as liked by the current user.

**Validates: Requirements 3.3**

### Property 6: Like button toggles state

*For any* post, tapping the like button once should like the post, and tapping again should unlike it (round trip property).

**Validates: Requirements 3.4**

### Property 7: Posts display all action buttons

*For any* post in the feed, it should display like, comment, share, BID, and tag buttons below the image.

**Validates: Requirements 3.5**

### Property 8: Multiple images enable carousel

*For any* post with multiple images, the UI should display a swipeable carousel with navigation functionality.

**Validates: Requirements 4.2**

### Property 9: Sneaker tags display as chips

*For any* post with sneaker tags, the tags should be displayed as tappable chips below the image.

**Validates: Requirements 4.3**

### Property 10: Submitted posts appear in feed

*For any* valid post submission, the post should appear in the feed with timestamp and user information.

**Validates: Requirements 4.4**

### Property 11: Multiple images show navigation dots

*For any* post with N images (where N > 1), the UI should display N navigation dots indicating the current image position.

**Validates: Requirements 4.5**

### Property 12: Search results are grouped correctly

*For any* search query, the results should be grouped into three categories: users, sneakers, and posts.

**Validates: Requirements 5.2**

### Property 13: Filters show only matching items

*For any* filter selection and dataset, the displayed results should only include items that match the selected category.

**Validates: Requirements 5.4**

### Property 14: Trending sneakers show ownership count

*For any* sneaker displayed in the trending section, it should show the count of users who own that sneaker.

**Validates: Requirements 5.5**

### Property 15: Listings contain all required fields

*For any* listing displayed in the marketplace, it should show sneaker images, name, size, condition, price, market value comparison, and seller information.

**Validates: Requirements 6.2**

### Property 16: Listing creation accepts all required data

*For any* valid listing data (sneaker details, photos, size, condition, type, price), the system should accept and create the listing.

**Validates: Requirements 6.3**

### Property 17: Rental listings show rental-specific fields

*For any* listing with type "rent", it should display daily rental price, available dates, and required deposit.

**Validates: Requirements 6.4**

### Property 18: Auction listings show auction-specific fields

*For any* listing with type "auction", it should display current bid, bid input field, countdown timer, and bid history.

**Validates: Requirements 6.5**

### Property 19: Below-market prices are highlighted

*For any* listing where price < marketValue, the price should be highlighted in green with market comparison text.

**Validates: Requirements 6.6**

### Property 20: Profiles display all header information

*For any* user profile, it should display avatar, username, bio, and stats for kicks, followers, and following.

**Validates: Requirements 7.1**

### Property 21: Profiles show all tabs

*For any* user profile, it should display tabs for collection, posts, wishlist, listings, and reviews.

**Validates: Requirements 7.2**

### Property 22: Verified sneakers show badges

*For any* sneaker in a user's collection with verified=true, it should display a verification badge.

**Validates: Requirements 7.3**

### Property 23: Wishlist items show market data

*For any* sneaker in a user's wishlist, it should display market price and availability indicators.

**Validates: Requirements 7.4**

### Property 24: Verification completion adds badge

*For any* sneaker that completes verification, the system should apply a verification badge to that sneaker.

**Validates: Requirements 8.3**

### Property 25: Verified sneakers display checkmark and date

*For any* verified sneaker, it should display a green checkmark badge and verification date.

**Validates: Requirements 8.4**

### Property 26: Verification levels show correct colors

*For any* user with a verification level, the badge should display the correct color: blue for email, green for ID, gold for trusted seller.

**Validates: Requirements 8.5**

### Property 27: Conversations display all required fields

*For any* conversation in the messages list, it should display avatar, name, last message preview, timestamp, and unread count.

**Validates: Requirements 9.1**

### Property 28: Messages have distinct styling by sender

*For any* message in a conversation, it should have different styling depending on whether it was sent or received.

**Validates: Requirements 9.2**

### Property 29: Sent messages appear in chat

*For any* message sent by a user, it should appear in the chat window and update the conversation list.

**Validates: Requirements 9.3**

### Property 30: Listing conversations show context

*For any* conversation related to a listing, the chat header should display the listing context.

**Validates: Requirements 9.4**

### Property 31: Shared listings display as embedded cards

*For any* listing shared in a chat, it should display as an embedded card with image and details.

**Validates: Requirements 9.5**

### Property 32: Notifications display all required fields

*For any* notification, it should display an appropriate icon, message, and timestamp.

**Validates: Requirements 10.1**

### Property 33: Notifications are grouped by time

*For any* set of notifications, they should be grouped into "today", "yesterday", and "this week" sections based on their timestamps.

**Validates: Requirements 10.2**

### Property 34: Unread notifications show indicator

*For any* notification with read=false, it should display an unread indicator.

**Validates: Requirements 10.3**

### Property 35: Notification taps navigate correctly

*For any* notification type, tapping it should navigate to the relevant content (post, listing, profile, etc.).

**Validates: Requirements 10.4**

### Property 36: Sneakers display market value

*For any* sneaker in the database, it should display a current market value from the API or mock data.

**Validates: Requirements 11.2**

### Property 37: Sneaker details show all information

*For any* sneaker detail page, it should display description, available sizes, and ownership count.

**Validates: Requirements 11.3**

### Property 38: Size-specific pricing returns values

*For any* sneaker ID and size combination, the market value function should return a numeric price.

**Validates: Requirements 11.4**

### Property 39: Navigation items navigate correctly

*For any* bottom navigation item, tapping it should navigate to the corresponding page and highlight the active item.

**Validates: Requirements 13.2**

### Property 40: Active navigation shows primary color

*For any* active navigation item, it should display its icon in the primary color (#FF6B35).

**Validates: Requirements 13.4**

### Property 41: Demo mode accepts all credentials

*For any* email and password combination in demo mode, the authentication should succeed.

**Validates: Requirements 15.2**

### Property 42: Errors display designed screens

*For any* error that occurs in the application, the system should display a designed error screen with a helpful message instead of crashing.

**Validates: Requirements 15.5**

### Property 43: Service cards display all fields

*For any* service in the services section, it should display icon, name, description, and call-to-action button.

**Validates: Requirements 16.4**

### Property 44: Service bookings show confirmation

*For any* service booking, the system should display a confirmation screen with service details and next steps.

**Validates: Requirements 16.5**


## Error Handling

### Error Categories

1. **Network Errors** (Future - when connecting to real APIs)
   - API timeout
   - Connection failure
   - Rate limiting

2. **Validation Errors**
   - Invalid form input
   - Missing required fields
   - Invalid file formats/sizes

3. **Authentication Errors**
   - Invalid credentials (production mode)
   - Session expired
   - Unauthorized access

4. **Data Errors**
   - Resource not found
   - Invalid data format
   - Corrupted local storage

### Error Handling Strategy

**User-Facing Errors**:
- Display toast notifications for minor errors
- Show modal dialogs for critical errors
- Provide designed error screens for page-level failures
- Include actionable error messages with recovery options

**Developer Errors**:
- Console logging for debugging
- Error boundaries to catch React errors
- Graceful degradation when features fail

**Demo Mode Considerations**:
- Suppress authentication errors
- Mock network delays and failures
- Show designed error states for presentation

### Error Recovery

```typescript
// Example error boundary implementation
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Dual Testing Approach

The application will use both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties that should hold across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Unit Testing

**Framework**: Jest + React Testing Library

**Coverage Areas**:
- Component rendering and user interactions
- Form validation logic
- Navigation and routing
- State management (Zustand stores)
- Utility functions
- Mock data generators

**Example Unit Tests**:
```typescript
// Test specific example
test('login form submits with valid credentials', () => {
  render(<LoginPage />);
  fireEvent.change(screen.getByLabelText('Email'), { 
    target: { value: 'test@example.com' } 
  });
  fireEvent.change(screen.getByLabelText('Password'), { 
    target: { value: 'password123' } 
  });
  fireEvent.click(screen.getByText('Login'));
  expect(screen.getByText('Welcome to SneakerGram!')).toBeInTheDocument();
});

// Test edge case
test('empty post caption is rejected', () => {
  const result = validatePost({ caption: '   ', images: ['img.jpg'] });
  expect(result.valid).toBe(false);
});
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations to ensure thorough coverage.

**Tagging Convention**: Each property-based test MUST be tagged with a comment explicitly referencing the correctness property from the design document using this format:

```typescript
/**
 * Feature: sneakergram-app, Property 6: Like button toggles state
 * Validates: Requirements 3.4
 */
```

**Coverage Areas**:
- Universal properties that should hold for all valid inputs
- Round-trip properties (like/unlike, serialize/deserialize)
- Invariants (data consistency after operations)
- Metamorphic properties (relationships between operations)

**Example Property Tests**:
```typescript
import fc from 'fast-check';

/**
 * Feature: sneakergram-app, Property 6: Like button toggles state
 * Validates: Requirements 3.4
 */
test('like button toggles state (round trip)', () => {
  fc.assert(
    fc.property(
      fc.record({
        id: fc.string(),
        likes: fc.nat(),
        isLiked: fc.boolean()
      }),
      (post) => {
        // Like then unlike should return to original state
        const liked = toggleLike(post);
        const unliked = toggleLike(liked);
        expect(unliked.isLiked).toBe(post.isLiked);
        expect(unliked.likes).toBe(post.likes);
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Feature: sneakergram-app, Property 19: Below-market prices are highlighted
 * Validates: Requirements 6.6
 */
test('prices below market value are highlighted', () => {
  fc.assert(
    fc.property(
      fc.record({
        price: fc.nat(1000),
        marketValue: fc.nat(1000)
      }),
      (listing) => {
        const priceDisplay = renderPriceTag(listing);
        if (listing.price < listing.marketValue) {
          expect(priceDisplay.highlighted).toBe(true);
          expect(priceDisplay.color).toBe('green');
        }
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Feature: sneakergram-app, Property 41: Demo mode accepts all credentials
 * Validates: Requirements 15.2
 */
test('demo mode accepts any credentials', () => {
  fc.assert(
    fc.property(
      fc.record({
        email: fc.emailAddress(),
        password: fc.string()
      }),
      (credentials) => {
        const result = authenticateDemo(credentials);
        expect(result.success).toBe(true);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Scope**: End-to-end user flows
- Complete authentication flow
- Post creation and display
- Marketplace listing creation
- Message sending
- Navigation between pages

### Visual Regression Testing (Optional)

**Tool**: Chromatic or Percy
**Scope**: Component visual consistency
- Ensure UI components render correctly
- Catch unintended visual changes

### Testing Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock External Dependencies**: Use mock data for all tests
3. **Descriptive Test Names**: Clearly describe what is being tested
4. **Arrange-Act-Assert**: Follow AAA pattern for clarity
5. **Edge Cases**: Test boundary conditions and error states
6. **Property Tests First**: Write property tests for core logic, unit tests for specific cases


## Implementation Details

### 3D Landing Page

**Technology**: React Three Fiber + React Three Drei

**Implementation**:
```typescript
// components/3d/LandingExperience.tsx
import { Canvas } from '@react-three/fiber';
import { Float, Environment, useGLTF } from '@react-three/drei';

export function LandingExperience() {
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#0F0F1A] to-[#1A1A2E]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} color="#FF6B35" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <SneakerModel />
        </Float>
        <Environment preset="city" />
      </Canvas>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-6xl font-bold text-white mb-4">SNEAKERGRAM</h1>
        <p className="text-xl text-gray-400 mb-8">Your Kicks. Your Community.</p>
        <button className="pointer-events-auto px-8 py-4 bg-[#FF6B35] text-white rounded-full">
          TAP TO ENTER
        </button>
      </div>
    </div>
  );
}

function SneakerModel() {
  const { scene } = useGLTF('/models/sneaker.glb');
  return <primitive object={scene} scale={2} />;
}
```

### State Management

**Tool**: Zustand

**Store Structure**:
```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Demo mode: accept any credentials
    const user = await mockLogin(credentials);
    set({ user, isAuthenticated: true });
    localStorage.setItem('user', JSON.stringify(user));
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
  }
}));

// stores/feedStore.ts
interface FeedState {
  posts: Post[];
  loading: boolean;
  loadPosts: () => Promise<void>;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: string) => void;
}

// stores/marketplaceStore.ts
interface MarketplaceState {
  listings: Listing[];
  filters: FilterState;
  setFilter: (filter: string) => void;
  createListing: (listing: Listing) => void;
  placeBid: (listingId: string, amount: number) => void;
}
```

### API Adapter Pattern

**Purpose**: Abstract data source to easily swap mock data with real APIs

```typescript
// lib/api/posts.ts
interface PostsAPI {
  getPosts: () => Promise<Post[]>;
  createPost: (post: CreatePostInput) => Promise<Post>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
}

// Mock implementation
class MockPostsAPI implements PostsAPI {
  async getPosts() {
    return mockPosts;
  }
  
  async createPost(input: CreatePostInput) {
    const post = { ...input, id: generateId(), createdAt: new Date() };
    mockPosts.unshift(post);
    return post;
  }
  
  async likePost(postId: string) {
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.likes++;
      post.isLiked = true;
    }
  }
}

// Future Supabase implementation
class SupabasePostsAPI implements PostsAPI {
  async getPosts() {
    const { data } = await supabase.from('posts').select('*');
    return data;
  }
  
  async createPost(input: CreatePostInput) {
    const { data } = await supabase.from('posts').insert(input).select();
    return data[0];
  }
  
  async likePost(postId: string) {
    await supabase.from('likes').insert({ post_id: postId, user_id: getCurrentUserId() });
  }
}

// Export current implementation
export const postsAPI: PostsAPI = new MockPostsAPI();
// To switch to real API: export const postsAPI: PostsAPI = new SupabasePostsAPI();
```

### Animation System

**Tool**: Framer Motion

**Common Animations**:
```typescript
// lib/animations.ts
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
};

export const likeAnimation = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.3 }
};

// Usage in components
<motion.div variants={fadeIn} initial="initial" animate="animate">
  <PostCard post={post} />
</motion.div>
```

### Routing Structure

```
app/
├── page.tsx                    # Redirect to /landing
├── landing/page.tsx            # 3D landing experience
├── (auth)/
│   ├── layout.tsx              # Auth layout (centered card)
│   ├── login/page.tsx          # Login page
│   └── signup/page.tsx         # Signup page
└── (main)/
    ├── layout.tsx              # Main layout with bottom nav
    ├── feed/page.tsx           # Home feed
    ├── explore/page.tsx        # Search and explore
    ├── marketplace/page.tsx    # Marketplace listings
    ├── services/page.tsx       # Services section
    ├── messages/page.tsx       # Direct messages
    ├── notifications/page.tsx  # Notifications
    ├── profile/[username]/page.tsx  # User profile
    └── sneaker/[id]/page.tsx   # Sneaker details
```

### Data Migration Path

**Phase 1 (Current - Mock Data)**:
```typescript
// lib/mockData.ts
export const mockUsers: User[] = [...];
export const mockPosts: Post[] = [...];
export const mockListings: Listing[] = [...];
```

**Phase 2 (Supabase Integration)**:
```sql
-- Database schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar TEXT,
  bio TEXT,
  shoe_size TEXT,
  verified BOOLEAN DEFAULT false,
  verification_level TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  images TEXT[],
  caption TEXT,
  sneaker_tags TEXT[],
  likes INTEGER DEFAULT 0,
  can_bid BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES users(id),
  sneaker_id TEXT,
  images TEXT[],
  size TEXT,
  condition INTEGER,
  price DECIMAL,
  type TEXT,
  verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Migration Strategy**:
1. Keep API adapter interfaces unchanged
2. Implement Supabase versions of API adapters
3. Switch implementation in one place
4. Test with real data
5. Deploy incrementally (auth first, then data)

### Performance Optimizations

1. **Code Splitting**: Use Next.js dynamic imports for heavy components
2. **Image Optimization**: Use Next.js Image component with Kaggle dataset
3. **Lazy Loading**: Load images and components as they enter viewport
4. **Memoization**: Use React.memo for expensive components
5. **Virtual Scrolling**: Implement for long lists (feed, marketplace)
6. **Debouncing**: Apply to search inputs and scroll handlers

```typescript
// Example: Lazy load 3D component
const LandingExperience = dynamic(() => import('@/components/3d/LandingExperience'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});
```

### Gemini API Integration (Future Enhancement)

**Use Cases**:
- AI-powered sneaker recommendations
- Automatic sneaker identification from photos
- Smart pricing suggestions based on market trends
- Chatbot for customer support

**Implementation**:
```typescript
// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCun7PsewNeGC1ZM_-7wzpXCwG8_CvzqyQ');

export async function identifySneaker(imageBase64: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  const result = await model.generateContent([
    'Identify this sneaker and provide brand, model, and colorway',
    { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }
  ]);
  return result.response.text();
}

export async function getSneakerRecommendations(userCollection: string[]) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `Based on this sneaker collection: ${userCollection.join(', ')}, recommend 5 sneakers that would complement it.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### Kaggle Dataset Integration

**Dataset Location**: `/data/` directory with subdirectories for each sneaker model

**Implementation**:
```typescript
// lib/sneakerImages.ts
import fs from 'fs';
import path from 'path';

export function getSneakerImages(sneakerModel: string): string[] {
  const dataDir = path.join(process.cwd(), 'data');
  const sneakerDir = path.join(dataDir, sneakerModel.toLowerCase().replace(/\s+/g, '_'));
  
  if (fs.existsSync(sneakerDir)) {
    const files = fs.readdirSync(sneakerDir);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/data/${sneakerModel.toLowerCase().replace(/\s+/g, '_')}/${file}`);
  }
  
  return ['/sneakers/placeholder.jpg'];
}

// Usage in mock data
export const sneakerDatabase: Sneaker[] = [
  {
    id: 'nike-air-jordan-1-high',
    brand: 'Nike',
    model: 'Air Jordan 1 High',
    colorway: 'Chicago',
    images: getSneakerImages('nike_air_jordan_1_high'),
    // ... other fields
  }
];
```

