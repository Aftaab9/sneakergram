# Demo Preparation Guide

## Overview
This guide provides comprehensive preparation instructions for presenting SneakerGram in demo mode. Follow these steps to ensure a smooth, professional demonstration.

---

## Pre-Demo Setup (30 minutes before)

### 1. Technical Environment

#### Browser Setup
```bash
# Recommended: Chrome or Edge (latest version)
- Clear cache and cookies
- Disable browser extensions (except dev tools)
- Set zoom to 100%
- Close unnecessary tabs
- Disable browser notifications
- Enable hardware acceleration
```

#### Local Environment
```bash
# Ensure app is running
npm run dev

# Verify on http://localhost:3000
# Check console for errors
# Test 3D landing page loads
```

#### Network Check
- Test internet connection speed
- Verify Kaggle dataset images load
- Check API endpoints (if using external services)
- Have mobile hotspot as backup

### 2. Demo Data Verification

#### Run Demo Tests
```typescript
// In browser console or test file
import { runDemoTests } from '@/lib/demoTesting';

const results = await runDemoTests();
console.log(results);
```

#### Verify Mock Data
- [ ] 10+ users loaded
- [ ] 20+ posts in feed
- [ ] 15+ marketplace listings
- [ ] 10+ conversations
- [ ] 20+ notifications
- [ ] 50+ sneakers in database

#### Test Key Features
- [ ] 3D landing page renders
- [ ] Login works with any credentials
- [ ] Feed scrolls smoothly
- [ ] Like animation works
- [ ] Marketplace filters work
- [ ] Search returns results
- [ ] Profile displays correctly
- [ ] Messages load
- [ ] Notifications appear
- [ ] Services page loads

### 3. Demo Accounts

#### Primary Demo Account
```
Email: mike@sneakergram.com
Password: demo123
Type: Gold verified power user
```

#### Alternative Accounts
```
New User: newbie@sneakergram.com / demo123
Seller: seller@sneakergram.com / demo123
Collector: collector@sneakergram.com / demo123
Casual: casual@sneakergram.com / demo123
```

#### Test Login
- [ ] Login with primary account
- [ ] Verify profile loads
- [ ] Check collection displays
- [ ] Confirm verification badge shows

### 4. Backup Preparation

#### Screenshots
Take screenshots of:
- [ ] 3D landing page
- [ ] Main feed with posts
- [ ] Marketplace listings
- [ ] User profile
- [ ] Search results
- [ ] Messages interface
- [ ] Notifications list
- [ ] Services page

#### Video Recording
Record full demo flow:
- [ ] 3D landing to login (30 seconds)
- [ ] Feed interaction (1 minute)
- [ ] Marketplace tour (1 minute)
- [ ] Profile and verification (1 minute)
- [ ] Search and explore (30 seconds)

#### Backup Device
- [ ] Secondary laptop/tablet ready
- [ ] Same demo account logged in
- [ ] All features tested
- [ ] Screenshots accessible

---

## Demo Flow Checklist

### Opening (2 minutes)

#### 3D Landing Page
- [ ] Load landing page
- [ ] Show parallax effect (move mouse)
- [ ] Highlight auto-rotation
- [ ] Click "TAP TO ENTER"
- [ ] Show smooth transition

**Talking Points:**
- "Immersive 3D experience built with Three.js"
- "Real GLB sneaker model with parallax effects"
- "Sets premium tone for the platform"

### Authentication (1 minute)

#### Demo Login
- [ ] Enter demo credentials
- [ ] Show demo mode message (optional)
- [ ] Click login
- [ ] Show welcome toast
- [ ] Transition to feed

**Talking Points:**
- "Demo mode accepts any credentials"
- "Production uses Supabase Auth"
- "Supports social login options"

### Main Feed (3 minutes)

#### Feed Features
- [ ] Show Sneaker of the Day
- [ ] Scroll through posts
- [ ] Double-tap to like (show animation)
- [ ] Click like button to unlike
- [ ] Tap sneaker tag
- [ ] Click BID button
- [ ] Pull to refresh

**Talking Points:**
- "Instagram-like social feed"
- "Real Kaggle dataset images"
- "Particle effects on like"
- "Tappable sneaker tags"
- "Integrated marketplace bidding"

### Post Creation (2 minutes)

#### Create Post
- [ ] Click "+" button
- [ ] Select post type
- [ ] Choose images
- [ ] Add caption
- [ ] Add sneaker tags
- [ ] Submit post
- [ ] Show in feed

**Talking Points:**
- "Three post types: collection, pickup, fitcheck"
- "Autocomplete sneaker tags"
- "Instant feed updates"

### Marketplace (3 minutes)

#### Marketplace Features
- [ ] Navigate to marketplace
- [ ] Show filter tabs
- [ ] Click listing with green price
- [ ] Show rental listing
- [ ] Show auction with countdown
- [ ] Click create listing
- [ ] Walk through form

**Talking Points:**
- "Buy, rent, or auction sneakers"
- "Price comparison with market value"
- "Green highlights below-market deals"
- "Rental options for expensive pairs"

### Search & Explore (2 minutes)

#### Search Features
- [ ] Navigate to search
- [ ] Enter search query
- [ ] Show grouped results
- [ ] Apply filter chip
- [ ] Scroll trending section
- [ ] Click trending sneaker

**Talking Points:**
- "Intelligent grouped search"
- "Users, sneakers, and posts"
- "Trending section shows popularity"
- "Filter by category"

### User Profile (2 minutes)

#### Profile Features
- [ ] Navigate to profile
- [ ] Show profile header
- [ ] Browse collection grid
- [ ] Click verified sneaker
- [ ] Switch to wishlist
- [ ] Show verification modal
- [ ] Demonstrate verification flow

**Talking Points:**
- "Collection management"
- "Verification system (3 levels)"
- "Wishlist with market prices"
- "Profile tabs for organization"

### Messages (2 minutes)

#### Messaging Features
- [ ] Navigate to messages
- [ ] Show conversation list
- [ ] Open conversation
- [ ] Show listing context
- [ ] Send message
- [ ] Show embedded listing

**Talking Points:**
- "Direct messaging for transactions"
- "Listing context in header"
- "Embedded listing cards"
- "Unread indicators"

### Notifications (1 minute)

#### Notification Features
- [ ] Navigate to notifications
- [ ] Show grouped notifications
- [ ] Tap notification
- [ ] Show navigation

**Talking Points:**
- "Time-based grouping"
- "Multiple notification types"
- "Direct navigation to content"

### Services (1 minute)

#### Services Features
- [ ] Navigate to services
- [ ] Show service cards
- [ ] Click authentication service
- [ ] Show booking modal
- [ ] Complete booking

**Talking Points:**
- "Premium services"
- "Authentication for trust"
- "Rental services"

### Sneaker Detail (1 minute)

#### Detail Features
- [ ] Navigate to sneaker page
- [ ] Show market value
- [ ] Browse sizes
- [ ] Show ownership count
- [ ] Scroll to listings

**Talking Points:**
- "Comprehensive sneaker database"
- "Market value tracking"
- "Size-specific pricing"
- "Community statistics"

### Demo Features (1 minute)

#### Special Features
- [ ] Triple-tap logo
- [ ] Show reset confirmation
- [ ] Mention error screens
- [ ] Highlight loading states

**Talking Points:**
- "Demo-specific features"
- "Triple-tap to reset"
- "Designed error screens"
- "Artificial loading delays"

---

## Presentation Tips

### Do's
✅ Start with impact (3D landing)
✅ Show animations early (like effect)
✅ Highlight unique features (verification, rental)
✅ Use real data (Kaggle images)
✅ Demonstrate smooth interactions
✅ Mention technical stack
✅ Show mobile responsiveness
✅ End with Q&A

### Don'ts
❌ Rush through features
❌ Skip error handling
❌ Ignore questions
❌ Over-explain obvious features
❌ Get stuck on technical issues
❌ Forget to show verification
❌ Miss marketplace highlights
❌ Skip backup plan

---

## Troubleshooting Guide

### Issue: 3D Landing Doesn't Load

**Symptoms:**
- Black screen
- Loading spinner stuck
- Console errors

**Solutions:**
1. Refresh page (Ctrl+R)
2. Check WebGL support
3. Try different browser
4. Skip to authentication
5. Use backup screenshots

**Talking Points:**
"The 3D experience requires WebGL support. Let me show you the rest of the platform."

### Issue: Images Don't Load

**Symptoms:**
- Broken image icons
- Slow loading
- Missing thumbnails

**Solutions:**
1. Check network connection
2. Verify /data directory exists
3. Use placeholder images
4. Show cached screenshots

**Talking Points:**
"We're using a Kaggle dataset with thousands of images. In production, these would be optimized and CDN-hosted."

### Issue: Animations Are Laggy

**Symptoms:**
- Choppy scrolling
- Delayed like animation
- Slow transitions

**Solutions:**
1. Close other tabs
2. Reduce browser zoom
3. Check CPU usage
4. Focus on features over animations

**Talking Points:**
"The animations are optimized for 60fps on production hardware. Let me focus on the features."

### Issue: Data Doesn't Load

**Symptoms:**
- Empty feed
- No listings
- Missing users

**Solutions:**
1. Refresh page
2. Clear localStorage
3. Triple-tap logo to reset
4. Use backup device

**Talking Points:**
"Let me reset the demo data. This is one of our demo features - triple-tap to reset."

### Issue: Modal Doesn't Open

**Symptoms:**
- Click has no effect
- Modal stuck
- Overlay visible but no content

**Solutions:**
1. Refresh page
2. Try different feature
3. Show screenshots
4. Describe feature verbally

**Talking Points:**
"Let me show you this feature through screenshots while we troubleshoot."

---

## Q&A Preparation

### Technical Questions

**Q: What's the tech stack?**
A: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Three.js, Zustand

**Q: How do you handle state?**
A: Zustand for global state, React hooks for local state

**Q: What about authentication?**
A: Demo mode now, Supabase Auth for production

**Q: Where's the data stored?**
A: Mock data now, Supabase PostgreSQL for production

**Q: How do you get market values?**
A: Mock data now, will integrate StockX/GOAT APIs

### Business Questions

**Q: What's the business model?**
A: Transaction fees, premium features, authentication services

**Q: Who's the target audience?**
A: Sneaker enthusiasts, collectors, resellers

**Q: What's the competitive advantage?**
A: Social + marketplace + verification in one platform

**Q: What's the go-to-market strategy?**
A: Launch with influencers, focus on sneaker communities

### Feature Questions

**Q: Can users actually buy sneakers?**
A: Demo mode simulates transactions. Production will integrate Stripe.

**Q: How does verification work?**
A: Upload receipts or scan QR codes. Manual review or API integration.

**Q: What about shipping?**
A: Will integrate with ShipStation or similar logistics platforms.

**Q: Can users sell internationally?**
A: Yes, with appropriate shipping and payment handling.

---

## Post-Demo Actions

### Immediate Follow-Up
- [ ] Thank attendees
- [ ] Ask for feedback
- [ ] Note questions
- [ ] Share demo link
- [ ] Provide documentation

### Within 24 Hours
- [ ] Send follow-up email
- [ ] Share GitHub access (if appropriate)
- [ ] Provide technical docs
- [ ] Answer outstanding questions
- [ ] Schedule next meeting

### Within 1 Week
- [ ] Implement feedback
- [ ] Address concerns
- [ ] Update demo based on feedback
- [ ] Prepare next iteration

---

## Demo Variations

### Quick Demo (5 minutes)
1. 3D landing (30s)
2. Feed with like (1m)
3. Marketplace (1m)
4. Profile (1m)
5. Search (1m)
6. Wrap-up (30s)

### Full Demo (20 minutes)
- All features
- Technical details
- Q&A throughout

### Technical Deep Dive (30 minutes)
- Code walkthrough
- Architecture discussion
- API integration strategy
- Testing approach

### Investor Pitch (10 minutes)
- Market opportunity
- Key features
- Business model
- Technical advantages
- Team & roadmap

---

## Success Metrics

### Demo Success
- ✅ All features demonstrated
- ✅ No critical errors
- ✅ Positive audience reaction
- ✅ Engaged Q&A
- ✅ Follow-up interest

### Red Flags
- ❌ Multiple technical failures
- ❌ Audience disengagement
- ❌ Confusion about features
- ❌ Concerns about feasibility
- ❌ No follow-up requests

---

## Resources

### Documentation
- [Demo Script](./DEMO_SCRIPT.md)
- [Demo Accounts](./lib/demoAccounts.ts)
- [Demo Testing](./lib/demoTesting.ts)
- [Requirements](./kiro/specs/sneakergram-app/requirements.md)
- [Design](./kiro/specs/sneakergram-app/design.md)

### Demo Tools
- Demo Checklist Component
- Demo Timer Component
- Demo Notes Component
- Demo Testing Utilities

### Backup Materials
- Screenshots folder
- Demo video recording
- Presentation slides
- Technical documentation

---

**Last Updated:** January 2025
**Version:** 1.0
**Status:** Ready for Demo
