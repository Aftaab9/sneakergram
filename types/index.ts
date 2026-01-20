// Core Data Models

// Enums
export enum PostType {
  COLLECTION = 'collection',
  PICKUP = 'pickup',
  FITCHECK = 'fitcheck'
}

export enum ListingType {
  SALE = 'sale',
  RENT = 'rent',
  AUCTION = 'auction'
}

export enum ListingStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  RENTED = 'rented',
  CLOSED = 'closed'
}

export enum VerificationLevel {
  EMAIL = 'email',
  ID = 'id',
  GOLD = 'gold'
}

export enum MessageType {
  TEXT = 'text',
  LISTING = 'listing',
  OFFER = 'offer',
  SYSTEM = 'system'
}

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  BID = 'bid',
  SAVE = 'save',
  VERIFICATION = 'verification',
  PRICEDROP = 'pricedrop',
  FOLLOW = 'follow'
}

export enum ServiceCategory {
  AUTHENTICATION = 'authentication',
  RENTAL = 'rental',
  CLEANING = 'cleaning',
  RESTORATION = 'restoration'
}

export enum SneakerCategory {
  JORDAN = 'jordan',
  NIKE = 'nike',
  ADIDAS = 'adidas',
  YEEZY = 'yeezy',
  NEWBALANCE = 'newbalance',
  CONVERSE = 'converse',
  VANS = 'vans',
  PUMA = 'puma',
  REEBOK = 'reebok',
  ASICS = 'asics',
  SALOMON = 'salomon',
  OTHER = 'other'
}

// Type Definitions

export type User = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  shoeSize: string;
  verified: boolean;
  verificationLevel: VerificationLevel;
  followers: number;
  following: number;
  collection: string[];
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Sneaker = {
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
  category: SneakerCategory;
};

export type Post = {
  id: string;
  userId: string;
  type: PostType;
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

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: Date;
};

export type Listing = {
  id: string;
  sellerId: string;
  sneakerId: string;
  images: string[];
  size: string;
  condition: number;
  price: number;
  type: ListingType;
  rentPrice?: number;
  rentDeposit?: number;
  rentAvailableFrom?: Date;
  rentAvailableTo?: Date;
  currentBid?: number;
  bidHistory?: Bid[];
  bidEndTime?: Date;
  verified: boolean;
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Bid = {
  id: string;
  listingId: string;
  userId: string;
  amount: number;
  createdAt: Date;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  type: MessageType;
  listingId?: string;
  offerAmount?: number;
  createdAt: Date;
  read: boolean;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  listingContext?: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  actorId?: string;
  postId?: string;
  listingId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  turnaroundTime: string;
  category: ServiceCategory;
};

// Additional Utility Types

// Form input types
export type CreatePostInput = {
  type: PostType;
  images: string[];
  caption: string;
  sneakerTags: string[];
  canBid?: boolean;
  bidSneakerId?: string;
};

export type CreateListingInput = {
  sneakerId: string;
  images: string[];
  size: string;
  condition: number;
  price: number;
  type: ListingType;
  rentPrice?: number;
  rentDeposit?: number;
  rentAvailableFrom?: Date;
  rentAvailableTo?: Date;
  currentBid?: number;
  bidEndTime?: Date;
};

export type SignupInput = {
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio?: string;
  shoeSize?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

// Component prop types
export type PostCardProps = {
  post: Post;
  user: User;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
  onBid?: (postId: string) => void;
};

export type ListingCardProps = {
  listing: Listing;
  seller: User;
  sneaker: Sneaker;
  onBid?: (listingId: string, amount: number) => void;
  onContact?: (sellerId: string) => void;
};

export type ProfileHeaderProps = {
  user: User;
  isOwnProfile: boolean;
  onFollow?: (userId: string) => void;
  onEdit?: () => void;
};

// Filter and search types
export type SearchFilters = {
  category?: SneakerCategory;
  priceMin?: number;
  priceMax?: number;
  size?: string;
  condition?: number;
  verified?: boolean;
};

export type MarketplaceFilters = {
  type?: ListingType;
  category?: SneakerCategory;
  priceRange?: [number, number];
  size?: string;
  verified?: boolean;
};

export type SearchResult = {
  users: User[];
  sneakers: Sneaker[];
  posts: Post[];
};

// API Response types
export type ApiResponse<T> = {
  data: T;
  error?: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

// Store state types
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => void;
};

export type FeedState = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  loadPosts: () => Promise<void>;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, comment: string) => void;
  createPost: (post: CreatePostInput) => Promise<void>;
};

export type MarketplaceState = {
  listings: Listing[];
  filters: MarketplaceFilters;
  loading: boolean;
  error: string | null;
  loadListings: () => Promise<void>;
  setFilter: (filters: MarketplaceFilters) => void;
  createListing: (listing: CreateListingInput) => Promise<void>;
  placeBid: (listingId: string, amount: number) => Promise<void>;
};

export type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
};

export type MessageState = {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  loading: boolean;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string, type?: MessageType) => Promise<void>;
};
