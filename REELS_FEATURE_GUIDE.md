# Reels Feature Guide

## Overview
The Reels feature brings Instagram-style short video content to SneakerGram, showcasing sneaker content in an engaging, swipeable format.

## Location
Reels appear in the main feed after the first post, making them highly visible to users.

## Features

### Video Playback
- **Tap to Play/Pause**: Tap anywhere on the video to toggle playback
- **Auto-pause**: Only the currently visible reel plays; others are paused
- **Loop**: Videos automatically loop when they reach the end
- **Muted by Default**: Videos start muted for better UX

### Controls

#### Sound Control
- **Mute/Unmute Button**: Bottom-right corner
- **Icon**: VolumeX (muted) / Volume2 (unmuted)
- **Persistent**: Sound preference maintained while viewing

#### Social Actions (Right Side)
1. **Like Button**
   - Heart icon with animation
   - Shows like count
   - Toggles between liked/unliked state
   - Red background when liked

2. **Comment Button**
   - Message circle icon
   - Shows comment count
   - Opens comment section (future enhancement)

3. **Share Button**
   - Send icon
   - Share reel with others (future enhancement)

4. **Save Button**
   - Bookmark icon
   - Save reel to collection (future enhancement)

### User Information
- **Profile Picture**: Top-left corner with white border
- **Username**: Next to profile picture
- **Follow Button**: Quick follow action
- **More Options**: Three-dot menu (top-right)

### Caption & Metadata
- **Caption**: Bottom-left, up to 2 lines
- **View Count**: Shows total views (e.g., "45.2K views")

### Navigation
- **Swipe Horizontally**: Swipe left/right to navigate between reels
- **Dot Indicators**: Bottom center shows current position
- **Tap Indicators**: Jump to specific reel
- **Smooth Scrolling**: Snap-to-position for clean transitions

## Current Reels

### Reel 1: Fresh Kicks Rotation
- **Video**: `4380323-hd_1080_1920_30fps.mp4`
- **Caption**: "Fresh kicks rotation 🔥 #SneakerHead"
- **Stats**: 12.4K likes, 342 comments, 45.2K views
- **User**: @sneakerlover

### Reel 2: Walking in Style
- **Video**: `vecteezy_close-up-of-a-person-s-feet-in-sneakers-walking-along-a_68699972.mp4`
- **Caption**: "Walking in style 👟✨"
- **Stats**: 8.9K likes, 156 comments, 32.1K views
- **User**: @kicksqueen

### Reel 3: Clean Whites
- **Video**: `vecteezy_close-up-of-white-sneakers-on-the-grass_1617742.mp4`
- **Caption**: "Clean whites on the green 🌿"
- **Stats**: 15.6K likes, 289 comments, 52.8K views
- **User**: @sneakerhead23

### Reel 4: Shopping Vibes
- **Video**: `vecteezy_use-for-e-commerce-shopping-and-digital-ads-campaings_29226494.mp4`
- **Caption**: "Sneaker shopping vibes 🛍️"
- **Stats**: 10.2K likes, 198 comments, 38.5K views
- **User**: @jordanfan

## Design Details

### Visual Effects
- **Gradient Overlays**: 
  - Top: Black fade for header visibility
  - Bottom: Black fade for caption/controls visibility
- **Glassmorphism**: Action buttons have frosted glass effect
- **Drop Shadows**: Text has shadows for readability
- **Rounded Corners**: 12px border radius on container

### Colors
- **Background**: Black (#000000)
- **Primary Accent**: Orange (#FF6B35)
- **White Overlays**: rgba(255, 255, 255, 0.2)
- **Text**: White with drop shadows

### Animations
- **Play Button**: Scale animation on show/hide
- **Like Button**: Scale animation on tap
- **Hover Effects**: Scale 1.02 on button hover
- **Smooth Transitions**: 200ms duration

### Responsive Design
- **Mobile**: Full-width, 500px height
- **Tablet**: Same as mobile
- **Desktop**: Contained within feed width

## Technical Implementation

### Component Structure
```
ReelsSection
├── Header (Title + "See All" button)
├── Carousel Container
│   ├── ReelCard 1
│   ├── ReelCard 2
│   ├── ReelCard 3
│   └── ReelCard 4
└── Indicators (Dots)
```

### State Management
- `currentIndex`: Tracks active reel
- `isPlaying`: Video playback state
- `isMuted`: Audio state
- `isLiked`: Like state per reel

### Performance
- **Lazy Loading**: Videos load on demand
- **Pause Inactive**: Only active reel plays
- **Optimized Rendering**: React.memo for ReelCard
- **Smooth Scrolling**: CSS scroll-snap

## User Interactions

### Mobile
1. **Swipe**: Horizontal swipe to navigate
2. **Tap Video**: Play/pause
3. **Tap Buttons**: Like, comment, share, save
4. **Tap Mute**: Toggle sound
5. **Tap Indicators**: Jump to reel

### Desktop
1. **Click Video**: Play/pause
2. **Click Buttons**: Like, comment, share, save
3. **Click Mute**: Toggle sound
4. **Click Indicators**: Jump to reel
5. **Scroll**: Horizontal scroll to navigate

## Accessibility

### ARIA Labels
- Video controls have descriptive labels
- Buttons have aria-labels
- Current reel indicated for screen readers

### Keyboard Navigation
- Tab through interactive elements
- Enter/Space to activate buttons
- Arrow keys for navigation (future)

### Screen Reader Support
- Announces video title and user
- Announces like counts and stats
- Announces playback state

## Future Enhancements

### Phase 1: User Engagement
- [ ] Comment section
- [ ] Share functionality
- [ ] Save to collections
- [ ] Follow users from reels

### Phase 2: Content Creation
- [ ] Upload reels
- [ ] Video recording
- [ ] Filters and effects
- [ ] Music library

### Phase 3: Discovery
- [ ] Trending reels
- [ ] Hashtag search
- [ ] For You algorithm
- [ ] Explore page

### Phase 4: Analytics
- [ ] View analytics
- [ ] Engagement metrics
- [ ] Audience insights
- [ ] Performance tracking

## Best Practices

### Content Guidelines
- **Duration**: 15-60 seconds optimal
- **Quality**: HD (1080p) minimum
- **Aspect Ratio**: 9:16 (vertical)
- **File Size**: < 50MB recommended
- **Format**: MP4 (H.264)

### Engagement Tips
- Use trending hashtags
- Add engaging captions
- Post during peak hours
- Respond to comments
- Collaborate with others

### Technical Tips
- Optimize video compression
- Use descriptive filenames
- Add proper metadata
- Test on multiple devices
- Monitor performance

## Troubleshooting

### Video Won't Play
1. Check file path is correct
2. Verify video format (MP4)
3. Check browser compatibility
4. Clear browser cache

### Swipe Not Working
1. Ensure touch events enabled
2. Check scroll container
3. Verify snap points
4. Test on different devices

### Performance Issues
1. Reduce video quality
2. Implement lazy loading
3. Pause inactive videos
4. Optimize animations

## Support

For issues or questions about the Reels feature:
1. Check this guide first
2. Review component code
3. Test in different browsers
4. Check console for errors
5. Contact development team

---

**Note**: This is version 1.0 of the Reels feature. More enhancements coming soon!
