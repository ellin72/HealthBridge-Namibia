# HealthBridge Mobile App

React Native mobile application for HealthBridge Namibia.

## Setup

1. Install dependencies: `npm install`
2. Configure API URL in `src/services/authService.ts`
3. Start Expo: `npm start`

## Running

- Android: `npm run android` or press `a`
- iOS: `npm run ios` or press `i`
- Web: `npm run web` or press `w`

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- React Native Paper

## Building

For production builds, use Expo Application Services (EAS):
```bash
eas build --platform android
eas build --platform ios
```

