#!/bin/bash

# Expo Performance Optimization Script
# This script helps optimize your Expo project for faster startup and reduced memory usage

echo "🚀 Starting Expo Performance Optimization..."

# Clear Metro cache
echo "🧹 Clearing Metro cache..."
npx expo start --clear &> /dev/null &
CLEAR_PID=$!
sleep 3
kill $CLEAR_PID 2>/dev/null

# Clear node modules and reinstall (optional, uncomment if needed)
# echo "📦 Cleaning node_modules..."
# rm -rf node_modules
# npm install

# Clear Android build cache
echo "🤖 Clearing Android build cache..."
cd android
./gradlew clean
cd ..

# Remove existing app installation to avoid signature conflicts
echo "📱 Removing existing app installation..."
adb uninstall com.allioexpo 2>/dev/null

# Clear Expo cache
echo "🔄 Clearing Expo cache..."
rm -rf ~/.expo/cache
rm -rf .expo

# Clear Metro cache directory
echo "🗂️ Clearing Metro cache directory..."
rm -rf .metro-cache

echo "✅ Optimization complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Run: npm run start:fast"
echo "2. Run: npm run android:fast"
echo "3. Your app should start much faster now!"
echo ""
echo "💡 Memory optimization tips:"
echo "- Use 'npm run start:fast' for development"
echo "- Close unused browser tabs"
echo "- Restart your computer if memory usage is still high"
