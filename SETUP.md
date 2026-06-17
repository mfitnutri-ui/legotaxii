# LegoTaxi Native - Setup & Development Guide

## Overview

LegoTaxi é um app de taxi 100% nativo para iOS e Android, desenvolvido com Expo React Native. O app oferece uma experiência elegante e funcional para motoristas e passageiros.

## Tech Stack

- **Framework**: Expo 54 com React Native 0.81
- **Language**: TypeScript 5.9
- **Styling**: NativeWind (Tailwind CSS para React Native)
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **Maps**: OpenStreetMap + Nominatim + OSRM
- **Notifications**: Expo Notifications (APNs + FCM)
- **Location**: Expo Location
- **UI Components**: Radix UI (web), custom React Native components

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Expo CLI
- iOS Simulator (macOS) ou Android Emulator
- Supabase account (para backend)

## Installation

```bash
# Install dependencies
pnpm install

# Install iOS pods (if on macOS)
cd ios && pod install && cd ..

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Development

### Start Development Server

```bash
# Start both Metro bundler and backend server
pnpm dev

# Or start separately:
pnpm dev:metro    # Metro bundler (port 8081)
pnpm dev:server   # Backend server (port 3000)
```

### Run on Emulator/Device

```bash
# iOS Simulator (macOS only)
pnpm ios

# Android Emulator
pnpm android

# Web (for testing)
pnpm dev:metro --web
```

### Generate QR Code

```bash
pnpm qr
```

Scan the QR code with Expo Go app on your device to preview the app.

## Project Structure

```
app/
  ├── (app)/              # Protected routes (after login)
  │   ├── driver-dashboard.tsx
  │   └── passenger-dashboard.tsx
  ├── (tabs)/             # Tab-based navigation
  │   └── index.tsx
  ├── auth/               # Authentication routes
  │   ├── welcome.tsx
  │   ├── login.tsx
  │   ├── signup.tsx
  │   └── phone-login.tsx
  ├── oauth/              # OAuth callbacks
  └── _layout.tsx         # Root layout

lib/
  ├── auth-context.tsx    # Authentication context
  ├── location-service.ts # Geolocation service
  ├── notifications-service.ts # Push notifications
  ├── maps-service.ts     # Maps & routing
  ├── store.ts            # Global state (Zustand)
  └── utils.ts            # Utility functions

components/
  ├── screen-container.tsx # SafeArea wrapper
  ├── themed-view.tsx      # Theme-aware view
  └── ui/                  # UI components

constants/
  ├── theme.ts            # Theme colors
  └── oauth.ts            # OAuth config

server/
  ├── _core/              # Backend core
  └── routers.ts          # API routes
```

## Key Features

### Authentication
- Email/Password signup and login
- Phone number verification with OTP
- Biometric authentication (Face ID / Fingerprint)
- Session management with Supabase

### Dashboards (No Scroll, Full-Screen Maps)
- **Passenger**: Request rides, view driver location, chat
- **Driver**: Accept rides, navigate, track earnings

### Real-Time Features
- GPS tracking with 1-second updates
- Live driver location on map
- Real-time ride notifications
- In-app chat

### Maps & Navigation
- OpenStreetMap integration
- Route calculation with OSRM
- Distance and fare estimation
- Address search with Nominatim

### Notifications
- Push notifications (iOS + Android)
- Local notifications
- Ride request alerts with sound & haptic

## Database Schema

### Key Tables
- `profiles` - User profiles (drivers & passengers)
- `rides` - Ride records
- `ride_chats` - In-ride messages
- `ratings` - Ride ratings and reviews
- `transactions` - Payment records

See `supabase/migrations/` for full schema.

## Building for Production

### iOS
```bash
# Clean build
pnpm prebuild:clean

# Build for TestFlight
eas build --platform ios --profile preview

# Build for App Store
eas build --platform ios --profile production
```

### Android
```bash
# Build for Google Play
eas build --platform android --profile production
```

## Testing

```bash
# Run tests
pnpm test

# Run linter
pnpm lint

# Format code
pnpm format

# Type check
pnpm check
```

## Debugging

### View Logs
```bash
# Metro bundler logs
tail -f .manus-logs/devserver.log

# Backend server logs
# Check console output from pnpm dev:server
```

### Common Issues

**Issue**: "Cannot find module '@supabase/supabase-js'"
- Solution: Run `pnpm install` to ensure all dependencies are installed

**Issue**: Location permission denied
- Solution: Grant location permission in app settings on your device

**Issue**: Notifications not working
- Solution: Ensure device has internet connection and notifications are enabled

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests and linting: `pnpm test && pnpm lint`
4. Commit with descriptive message: `git commit -m "feat: add your feature"`
5. Push to GitHub: `git push origin feature/your-feature`
6. Create a Pull Request

## Performance Tips

- Use `FlatList` for long lists, never `ScrollView` with `.map()`
- Memoize components with `React.memo()` when needed
- Use selectors in Zustand to prevent unnecessary re-renders
- Lazy load images with `expo-image`
- Profile with React DevTools Profiler

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [OpenStreetMap Docs](https://wiki.openstreetmap.org/)

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and device info

## License

MIT License - see LICENSE file for details

---

**Last Updated**: June 2026
**Version**: 1.0.0
