# SneakerGram

A social media application for sneaker enthusiasts built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x with custom dark theme
- **Animations**: Framer Motion 11.x
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **State Management**: Zustand 5.x
- **Testing**: Vitest 4.x + fast-check (Property-Based Testing)
- **HTTP Client**: Axios (for future API integrations)
- **Data Sources**: 
  - Kaggle Sneaker Dataset (50 models, 5000+ images in `/data`)
  - Mock API for sneaker market data (ready for real API integration)

## 📁 Project Structure

```
sneakergram/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── 3d/                # Three.js 3D components
│   ├── ui/                # UI components
│   ├── feed/              # Feed-related components
│   ├── marketplace/       # Marketplace components
│   ├── profile/           # Profile components
│   ├── messages/          # Messaging components
│   ├── services/          # Services components
│   └── shared/            # Shared components
├── lib/                   # Utility functions and API clients
│   ├── kaggleDataset.ts   # Kaggle dataset utilities
│   └── sneaksApi.ts       # sneaks-api integration
├── hooks/                 # Custom React hooks
├── stores/                # Zustand state stores
├── types/                 # TypeScript type definitions
├── data/                  # Kaggle sneaker image dataset
├── 3d_data/              # 3D models and textures
└── __tests__/            # Test files

```

## 🎨 Design System

### Colors
- **Primary**: #FF6B35 (Orange)
- **Background**: #0F0F1A (Dark Blue)
- **Card**: #1A1A2E (Dark Blue-Gray)
- **Accent**: #16213E (Blue-Gray)

### Features
- Dark theme with glassmorphism effects
- Custom scrollbar styling
- Shimmer loading animations
- Glow effects for primary elements
- Safe area support for notched devices

## 🧪 Testing

The project uses a dual testing approach:

- **Unit Tests**: Specific examples and edge cases
- **Property-Based Tests**: Universal properties using fast-check

Run tests:
```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
```

## 📊 Data Sources

### Kaggle Dataset
Located in `/data` directory with 50 sneaker models:
- Nike (Air Jordan, Air Max, Dunk, etc.)
- Adidas (Ultraboost, Gazelle, Forum, etc.)
- Yeezy (Boost 350 V2, 700, Slide)
- New Balance (327, 550, 574, 990, 992)
- Converse (Chuck Taylor, Chuck 70)
- Vans (Old Skool, Sk8-Hi, Authentic)
- And more...

### Mock Sneaker API
Mock data structure ready for integration with real APIs:
- Market prices and valuations
- Release dates and retail prices
- Product descriptions and images
- Style IDs and colorways
- Future: StockX, GOAT, Stadium Goods integration

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

4. Build for production:
```bash
npm run build
npm start
```

## 📝 Development Notes

- The project starts with mock data for rapid prototyping
- Architecture supports easy transition to real backend (Supabase)
- All components are TypeScript strict mode compliant
- Property-based tests ensure correctness across all inputs

## 🎯 Next Steps

See `.kiro/specs/sneakergram-app/tasks.md` for the complete implementation plan.

## 📄 License

Private project for demonstration purposes.
