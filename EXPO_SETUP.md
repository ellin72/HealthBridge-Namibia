# Expo CLI Setup - Quick Reference

## ✅ Installation Complete

You have successfully installed the modern Expo CLI (`@expo/cli` version 54.0.20).

## Important Notes

- ✅ **Old `expo-cli` is deprecated** - We've removed it and installed the modern `@expo/cli`
- ✅ **Modern approach**: Use `npx expo` instead of a global `expo` command
- ✅ The project's `package.json` scripts will automatically use the correct Expo version

## How to Use Expo

### Option 1: Use npx (Recommended - No Global Installation Needed)

```powershell
cd mobile
npx expo start
```

### Option 2: Use npm scripts (Easiest)

The project already has scripts configured in `mobile/package.json`:

```powershell
cd mobile
npm start          # Start Expo development server
npm run android    # Start and open on Android emulator
npm run ios        # Start and open on iOS simulator (macOS only)
npm run web        # Start and open in web browser
```

### Option 3: Global Installation (Already Done)

If you want to use `expo` globally, you can use:

```powershell
npx expo --version  # Check version
npx expo start      # Start development server
```

## Testing Your Mobile App

### Using Expo Go App (Easiest for Testing)

1. **Install Expo Go** on your phone:
   - iOS: [App Store](https://apps.apple.com/us/app/expo-go/id982107779)
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server**:
   ```powershell
   cd mobile
   npm start
   ```

3. **Scan the QR code**:
   - iOS: Use the Camera app to scan the QR code
   - Android: Use the Expo Go app to scan the QR code
   - Make sure your phone and computer are on the same Wi-Fi network

### Using Android Emulator

1. Install [Android Studio](https://developer.android.com/studio)
2. Set up an Android Virtual Device (AVD)
3. Run:
   ```powershell
   cd mobile
   npm run android
   ```

### Using iOS Simulator

- Only available on macOS
- Requires Xcode from the App Store
- Run: `npm run ios`

## Common Commands

```powershell
# Start development server
npx expo start

# Start with specific platform
npx expo start --android
npx expo start --ios
npx expo start --web

# Clear cache and restart
npx expo start -c

# Build for production (requires EAS CLI)
npx expo build:android
npx expo build:ios
```

## Troubleshooting

### "expo is not recognized"
- Use `npx expo` instead of just `expo`
- Or use the npm scripts: `npm start`

### "Cannot connect to Expo"
- Make sure your phone and computer are on the same Wi-Fi network
- Check firewall settings
- Try using a tunnel: `npx expo start --tunnel`

### "Metro bundler error"
- Clear cache: `npx expo start -c`
- Delete `node_modules` and reinstall: `npm install`

## Next Steps

1. Navigate to the mobile directory: `cd mobile`
2. Install dependencies (if not done): `npm install`
3. Start the development server: `npm start`
4. Scan the QR code with Expo Go on your phone

For more information, see the [Expo Documentation](https://docs.expo.dev/).

