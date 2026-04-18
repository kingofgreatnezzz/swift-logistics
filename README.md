# SwiftLogistics - Premium Logistics Platform

A modern, premium logistics and delivery platform built with Next.js 14, featuring real-time tracking, interactive maps, and dynamic branding.

## 🚀 Features

### Core Features
- **Real-time Package Tracking** - Track shipments with live updates
- **Interactive Map Visualization** - Simulated package movement with smooth animations
- **Dynamic Branding** - Easily customizable colors, fonts, and branding
- **Premium UI/UX** - Modern, minimalist design with smooth animations
- **Responsive Design** - Works seamlessly on all devices

### Technical Features
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **Supabase Integration** (ready for backend)
- **Mock Data System** for development

## 🏗️ Project Structure

```
shipping-platform/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with dynamic theming
│   │   ├── page.tsx            # Home page
│   │   ├── tracking/
│   │   │   └── page.tsx        # Tracking page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Navigation.tsx      # Main navigation
│   │   ├── HeroSection.tsx     # Hero section
│   │   ├── TrackingSection.tsx # Tracking input section
│   │   ├── FeaturesSection.tsx # Features showcase
│   │   ├── StatsSection.tsx    # Statistics and milestones
│   │   ├── CtaSection.tsx      # Call-to-action sections
│   │   ├── TrackingMap.tsx     # Interactive map component
│   │   ├── PackageDetails.tsx  # Package details card
│   │   ├── TrackingHistory.tsx # Tracking timeline
│   │   └── Footer.tsx          # Site footer
│   └── lib/
│       ├── theme.ts            # Dynamic branding configuration
│       └── supabase.ts         # Supabase client and types
├── public/                     # Static assets
└── package.json
```

## 🎨 Dynamic Branding

The platform features a comprehensive dynamic branding system. Update the `themeConfig` in `src/lib/theme.ts` to customize:

- Brand name and tagline
- Color palette (primary, secondary, accent colors)
- Typography settings
- Spacing and border radius
- Animation durations
- Shadows and effects

## 🗺️ Map Tracking

The platform includes a simulated map tracking system that shows package movement from origin to destination with:
- Smooth animated package movement
- Progress tracking
- Real-time location updates
- Interactive controls (pause/resume, zoom)

## 📦 Package Management

- View detailed package information
- Track shipment history with timeline
- Update package status manually
- Generate receipts (PDF ready)
- Real-time status updates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shipping-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional for Supabase):
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Supabase Setup (Optional)
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Custom Branding
Edit `src/lib/theme.ts` to customize:
- Brand colors
- Typography
- Spacing
- Animations

## 📱 Pages

### Home Page (`/`)
- Hero section with tracking input
- Features showcase
- Statistics and milestones
- Call-to-action sections

### Tracking Page (`/tracking`)
- Real-time package tracking
- Interactive map visualization
- Package details and history
- Status updates and controls

## 🎯 Design Philosophy

The platform follows a premium design approach:
- **Minimalist Layout** - Clean, uncluttered interface
- **Smooth Animations** - Deliberate, purposeful motion
- **Consistent Spacing** - Precise alignment and whitespace
- **Premium Color Palette** - Sophisticated, brand-aligned colors
- **Responsive Typography** - Modern, readable text hierarchy

## 🔄 Real-time Updates

The platform is ready for real-time updates with Supabase:
- Live package status updates
- Real-time location tracking
- Instant notification system
- WebSocket integration ready

## 📄 Receipt Generation

Ready for PDF receipt generation with:
- Package details
- Sender/receiver information
- Tracking information
- Branded layout

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/app/`
3. Update theme configuration in `src/lib/theme.ts`
4. Extend Supabase types in `src/lib/supabase.ts`

## 📈 Future Enhancements

Planned features:
- [ ] Real Supabase integration
- [ ] User authentication
- [ ] Admin dashboard
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] API documentation
- [ ] Webhook integrations
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Animations with [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide React](https://lucide.dev)
- Database with [Supabase](https://supabase.com)

---

**SwiftLogistics** - Transforming global logistics with premium technology solutions.