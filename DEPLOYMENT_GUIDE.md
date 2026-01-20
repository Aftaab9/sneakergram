# 🚀 Quick Deployment Guide for SneakerGram

## Option 1: Vercel (Recommended - Easiest!)

### Setup (One-time)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

### Deploy
```bash
# Deploy to production
vercel --prod
```

That's it! You'll get a URL like: `https://sneakergram-xyz.vercel.app`

### Benefits
- ✅ Free tier
- ✅ Perfect for Next.js
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Takes 2 minutes

---

## Option 2: Netlify

### Setup
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login
```

### Deploy
```bash
# Build the app
npm run build

# Deploy
netlify deploy --prod
```

---

## Option 3: GitHub Pages (Static Export)

### 1. Update next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/sneakergram',
};

module.exports = nextConfig;
```

### 2. Build and Deploy
```bash
# Build static export
npm run build

# Push to GitHub
git add .
git commit -m "Deploy to GitHub Pages"
git push

# Enable GitHub Pages in repo settings
# Set source to: gh-pages branch or /docs folder
```

---

## 🎯 Recommended: Use Vercel

**Why?**
- Fastest setup (2 minutes)
- No configuration needed
- Perfect for Next.js
- Free forever for personal projects
- Your friend can access it from anywhere

**Steps:**
1. Run `npm i -g vercel`
2. Run `vercel login` (use GitHub/email)
3. Run `vercel --prod`
4. Copy the URL and send to your friend!

---

## 📱 Share the Demo

Once deployed, send your friend:
1. The URL (e.g., `https://sneakergram-xyz.vercel.app`)
2. Demo credentials (any email/password works in demo mode!)
3. The demo script from PRIORITY_TASKS.md

---

## 🔧 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables
If you need env vars, create `.env.local`:
```
NEXT_PUBLIC_API_URL=your_url_here
```

Then add them in Vercel dashboard: Settings → Environment Variables

---

## ⚡ Quick Deploy Checklist

- [ ] All critical tasks completed
- [ ] App runs locally: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Deploy: `vercel --prod`
- [ ] Test the deployed URL
- [ ] Send URL to your friend

**Estimated Time: 5-10 minutes** ⏱️

Good luck with the presentation! 🎉
