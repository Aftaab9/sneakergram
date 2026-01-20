/**
 * Demo User Accounts
 * Pre-configured demo accounts with rich data for presentations
 * Validates: Requirements 15.1, 15.2, 15.3, 15.4
 */

import { User, VerificationLevel } from '@/types';

export interface DemoAccount {
  credentials: {
    email: string;
    password: string;
  };
  user: User;
  description: string;
  highlights: string[];
}

/**
 * Demo Account 1: Power User
 * A verified collector with extensive collection and high engagement
 */
export const DEMO_ACCOUNT_POWER_USER: DemoAccount = {
  credentials: {
    email: 'mike@sneakergram.com',
    password: 'demo123',
  },
  user: {
    id: 'user-1',
    username: 'sneakerhead_mike',
    displayName: 'Mike Johnson',
    email: 'mike@sneakergram.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    bio: 'Jordan collector since 2010. Always hunting for rare pairs 👟',
    shoeSize: '10.5',
    verified: true,
    verificationLevel: VerificationLevel.GOLD,
    followers: 15420,
    following: 892,
    collection: ['sneaker-1', 'sneaker-2', 'sneaker-5', 'sneaker-8', 'sneaker-11', 'sneaker-13'],
    wishlist: ['sneaker-10', 'sneaker-12', 'sneaker-15'],
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  description: 'Gold verified power user with large collection',
  highlights: [
    'Gold verification badge (trusted seller)',
    '15K+ followers',
    'Large sneaker collection (6+ pairs)',
    'Active wishlist',
    'High engagement profile',
  ],
};

/**
 * Demo Account 2: New User
 * A recently joined user with minimal activity
 */
export const DEMO_ACCOUNT_NEW_USER: DemoAccount = {
  credentials: {
    email: 'newbie@sneakergram.com',
    password: 'demo123',
  },
  user: {
    id: 'user-demo-new',
    username: 'sneaker_newbie',
    displayName: 'Alex Smith',
    email: 'newbie@sneakergram.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Newbie',
    bio: 'Just getting into sneakers! Looking to learn and collect 👟',
    shoeSize: '9',
    verified: false,
    verificationLevel: VerificationLevel.EMAIL,
    followers: 12,
    following: 45,
    collection: ['sneaker-3'],
    wishlist: ['sneaker-1', 'sneaker-2', 'sneaker-4', 'sneaker-5'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  description: 'New user exploring the platform',
  highlights: [
    'Email verified only',
    'Small collection (1 pair)',
    'Large wishlist (exploring options)',
    'Low follower count',
    'Recent join date',
  ],
};

/**
 * Demo Account 3: Seller
 * An active seller with multiple listings
 */
export const DEMO_ACCOUNT_SELLER: DemoAccount = {
  credentials: {
    email: 'seller@sneakergram.com',
    password: 'demo123',
  },
  user: {
    id: 'user-demo-seller',
    username: 'kicks_dealer',
    displayName: 'Jordan Martinez',
    email: 'seller@sneakergram.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seller',
    bio: 'Trusted seller | Fast shipping | DM for deals 📦',
    shoeSize: '10',
    verified: true,
    verificationLevel: VerificationLevel.ID,
    followers: 8934,
    following: 234,
    collection: ['sneaker-6', 'sneaker-7', 'sneaker-9', 'sneaker-14', 'sneaker-16'],
    wishlist: ['sneaker-20'],
    createdAt: new Date('2022-06-10'),
    updatedAt: new Date('2024-01-14'),
  },
  description: 'Active seller with ID verification',
  highlights: [
    'ID verified (green badge)',
    'Multiple listings in marketplace',
    'High follower count',
    'Seller-focused bio',
    'Good reputation',
  ],
};

/**
 * Demo Account 4: Collector
 * A passionate collector focused on specific brands
 */
export const DEMO_ACCOUNT_COLLECTOR: DemoAccount = {
  credentials: {
    email: 'collector@sneakergram.com',
    password: 'demo123',
  },
  user: {
    id: 'user-demo-collector',
    username: 'yeezy_vault',
    displayName: 'Sarah Chen',
    email: 'collector@sneakergram.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Collector',
    bio: 'Yeezy collector | 50+ pairs | Not for sale 🔒',
    shoeSize: '8',
    verified: true,
    verificationLevel: VerificationLevel.GOLD,
    followers: 12890,
    following: 456,
    collection: [
      'sneaker-11',
      'sneaker-13',
      'sneaker-14',
      'sneaker-17',
      'sneaker-18',
      'sneaker-19',
      'sneaker-21',
      'sneaker-22',
    ],
    wishlist: ['sneaker-23', 'sneaker-24', 'sneaker-25'],
    createdAt: new Date('2021-11-05'),
    updatedAt: new Date('2024-01-15'),
  },
  description: 'Dedicated collector with brand focus',
  highlights: [
    'Gold verification',
    'Large collection (8+ pairs)',
    'Brand-specific focus (Yeezy)',
    'High engagement',
    'Long-time member',
  ],
};

/**
 * Demo Account 5: Casual User
 * A casual user who browses and occasionally engages
 */
export const DEMO_ACCOUNT_CASUAL: DemoAccount = {
  credentials: {
    email: 'casual@sneakergram.com',
    password: 'demo123',
  },
  user: {
    id: 'user-demo-casual',
    username: 'weekend_kicks',
    displayName: 'Chris Taylor',
    email: 'casual@sneakergram.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casual',
    bio: 'Sneakers for the weekend vibes 😎',
    shoeSize: '11',
    verified: false,
    verificationLevel: VerificationLevel.EMAIL,
    followers: 234,
    following: 567,
    collection: ['sneaker-4', 'sneaker-12'],
    wishlist: ['sneaker-8', 'sneaker-10'],
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-01-13'),
  },
  description: 'Casual user with moderate activity',
  highlights: [
    'Email verified',
    'Small collection (2 pairs)',
    'Moderate following',
    'Casual engagement',
    'Balanced follower/following ratio',
  ],
};

/**
 * All demo accounts
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  DEMO_ACCOUNT_POWER_USER,
  DEMO_ACCOUNT_NEW_USER,
  DEMO_ACCOUNT_SELLER,
  DEMO_ACCOUNT_COLLECTOR,
  DEMO_ACCOUNT_CASUAL,
];

/**
 * Get demo account by email
 */
export function getDemoAccountByEmail(email: string): DemoAccount | undefined {
  return DEMO_ACCOUNTS.find(account => account.credentials.email === email);
}

/**
 * Get demo account by username
 */
export function getDemoAccountByUsername(username: string): DemoAccount | undefined {
  return DEMO_ACCOUNTS.find(account => account.user.username === username);
}

/**
 * Get random demo account
 */
export function getRandomDemoAccount(): DemoAccount {
  return DEMO_ACCOUNTS[Math.floor(Math.random() * DEMO_ACCOUNTS.length)];
}

/**
 * Demo account credentials for quick reference
 */
export const DEMO_CREDENTIALS = {
  POWER_USER: {
    email: 'mike@sneakergram.com',
    password: 'demo123',
    description: 'Gold verified power user',
  },
  NEW_USER: {
    email: 'newbie@sneakergram.com',
    password: 'demo123',
    description: 'New user exploring platform',
  },
  SELLER: {
    email: 'seller@sneakergram.com',
    password: 'demo123',
    description: 'Active seller with listings',
  },
  COLLECTOR: {
    email: 'collector@sneakergram.com',
    password: 'demo123',
    description: 'Dedicated Yeezy collector',
  },
  CASUAL: {
    email: 'casual@sneakergram.com',
    password: 'demo123',
    description: 'Casual weekend user',
  },
  DEFAULT: {
    email: 'demo@sneakergram.com',
    password: 'demo123',
    description: 'Default demo account',
  },
};

/**
 * Demo scenarios for different presentation contexts
 */
export interface DemoScenario {
  name: string;
  account: DemoAccount;
  flow: string[];
  duration: string;
  purpose: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    name: 'Power User Journey',
    account: DEMO_ACCOUNT_POWER_USER,
    flow: [
      'Login as verified power user',
      'Browse feed with high engagement',
      'View large collection with verified badges',
      'Create new post showcasing rare pair',
      'Check marketplace for new listings',
      'Respond to messages from buyers',
    ],
    duration: '5-7 minutes',
    purpose: 'Show platform value for established users',
  },
  {
    name: 'New User Onboarding',
    account: DEMO_ACCOUNT_NEW_USER,
    flow: [
      'Sign up as new user',
      'Explore trending sneakers',
      'Add items to wishlist',
      'Follow popular users',
      'Browse marketplace for first purchase',
      'Ask questions in messages',
    ],
    duration: '5-7 minutes',
    purpose: 'Demonstrate ease of getting started',
  },
  {
    name: 'Seller Experience',
    account: DEMO_ACCOUNT_SELLER,
    flow: [
      'Login as verified seller',
      'Create new marketplace listing',
      'Set competitive pricing',
      'Respond to buyer inquiries',
      'Manage active listings',
      'Check notification for bids',
    ],
    duration: '5-7 minutes',
    purpose: 'Show monetization opportunities',
  },
  {
    name: 'Collector Showcase',
    account: DEMO_ACCOUNT_COLLECTOR,
    flow: [
      'Login as gold verified collector',
      'View extensive collection',
      'Create collection flex post',
      'Verify new sneaker acquisition',
      'Update wishlist with grails',
      'Engage with community',
    ],
    duration: '5-7 minutes',
    purpose: 'Highlight collection management features',
  },
  {
    name: 'Quick Feature Tour',
    account: DEMO_ACCOUNT_CASUAL,
    flow: [
      '3D landing page',
      'Quick login',
      'Feed scroll with like animation',
      'Search for specific sneaker',
      'View sneaker detail page',
      'Check marketplace prices',
    ],
    duration: '3-5 minutes',
    purpose: 'Fast overview of key features',
  },
];

/**
 * Get demo scenario by name
 */
export function getDemoScenario(name: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find(scenario => scenario.name === name);
}

/**
 * Demo presentation tips
 */
export const DEMO_TIPS = {
  BEFORE_DEMO: [
    'Clear browser cache and localStorage',
    'Test internet connection',
    'Close unnecessary browser tabs',
    'Set browser zoom to 100%',
    'Have backup device ready',
    'Test all features in advance',
  ],
  DURING_DEMO: [
    'Start with 3D landing page for impact',
    'Use double-tap like animation early',
    'Show verification badges prominently',
    'Highlight price comparison in marketplace',
    'Demonstrate search with grouped results',
    'End with triple-tap reset demo',
  ],
  AFTER_DEMO: [
    'Ask for specific feedback',
    'Note any technical questions',
    'Record feature requests',
    'Schedule follow-up meeting',
    'Share demo link and documentation',
  ],
  TROUBLESHOOTING: [
    'If 3D fails: Skip to authentication',
    'If images slow: Mention optimization',
    'If animations lag: Focus on features',
    'If data missing: Refresh page',
    'If modal stuck: Use backup screenshots',
  ],
};

/**
 * Demo backup plan
 */
export const DEMO_BACKUP_PLAN = {
  PRIMARY_DEVICE: 'Main laptop with Chrome',
  BACKUP_DEVICE: 'Tablet or secondary laptop',
  OFFLINE_MODE: 'Screenshots and video recording',
  NETWORK_ISSUES: 'Use localhost or cached version',
  BROWSER_ISSUES: 'Switch to Firefox or Edge',
  COMPLETE_FAILURE: 'Use pre-recorded demo video',
};

/**
 * Generate demo account summary
 */
export function generateAccountSummary(account: DemoAccount): string {
  const lines = [
    `# ${account.user.displayName} (@${account.user.username})`,
    '',
    `**Email:** ${account.credentials.email}`,
    `**Password:** ${account.credentials.password}`,
    '',
    `## Profile`,
    `- **Bio:** ${account.user.bio}`,
    `- **Verification:** ${account.user.verificationLevel}`,
    `- **Followers:** ${account.user.followers.toLocaleString()}`,
    `- **Following:** ${account.user.following.toLocaleString()}`,
    `- **Collection:** ${account.user.collection.length} sneakers`,
    `- **Wishlist:** ${account.user.wishlist.length} items`,
    '',
    `## Highlights`,
    ...account.highlights.map(h => `- ${h}`),
    '',
    `## Description`,
    account.description,
  ];

  return lines.join('\n');
}

/**
 * Generate all demo accounts documentation
 */
export function generateDemoAccountsDoc(): string {
  const lines = [
    '# Demo Accounts Documentation',
    '',
    '## Quick Reference',
    '',
    '| Username | Email | Verification | Type |',
    '|----------|-------|--------------|------|',
  ];

  DEMO_ACCOUNTS.forEach(account => {
    lines.push(
      `| @${account.user.username} | ${account.credentials.email} | ${account.user.verificationLevel} | ${account.description} |`
    );
  });

  lines.push('', '## Detailed Accounts', '');

  DEMO_ACCOUNTS.forEach(account => {
    lines.push(generateAccountSummary(account));
    lines.push('---', '');
  });

  lines.push('## Demo Scenarios', '');

  DEMO_SCENARIOS.forEach(scenario => {
    lines.push(`### ${scenario.name}`);
    lines.push(`**Account:** @${scenario.account.user.username}`);
    lines.push(`**Duration:** ${scenario.duration}`);
    lines.push(`**Purpose:** ${scenario.purpose}`);
    lines.push('');
    lines.push('**Flow:**');
    scenario.flow.forEach((step, i) => {
      lines.push(`${i + 1}. ${step}`);
    });
    lines.push('');
  });

  return lines.join('\n');
}
