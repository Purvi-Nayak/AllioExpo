# AllioExpo Environment Setup Guide

This guide explains how to set up and use four different environments (local, development, staging, production) in your Expo project.

## 🌍 What are Environments?

**Environments** allow you to have different configurations for different stages of your app development:

1. **Local Environment**: For development on your machine with local servers
2. **Development Environment**: For feature development and testing  
3. **Staging Environment**: Pre-production testing (exact copy of production)
4. **Production Environment**: For the live app with production servers

## 📁 Environment Files

Four `.env` files have been created:

- `.env.local` - Local development settings
- `.env.development` - Development server settings  
- `.env.staging` - Staging/pre-production settings
- `.env.production` - Production server settings

### Environment Variables

Each environment file contains:
```env
EXPO_PUBLIC_ENV=local|development|production
EXPO_PUBLIC_API_BASE_URL=your-api-url
EXPO_PUBLIC_APP_NAME=your-app-name
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project
EXPO_PUBLIC_DEBUG_MODE=true|false
EXPO_PUBLIC_LOG_LEVEL=debug|info|error
```

## 🚀 Running Different Environments

### Local Development
```bash
npm run start:local       # Start local environment
npm run android:local     # Run Android with local env
npm run ios:local         # Run iOS with local env
```

### Development Environment
```bash
npm run start:dev         # Start development environment
npm run android:dev       # Run Android with dev env
npm run ios:dev           # Run iOS with dev env
```

### Production Environment
```bash
npm run start:prod        # Start production environment
npm run android:prod      # Run Android with prod env
npm run ios:prod          # Run iOS with prod env
```

## 📱 Building for Different Environments

### Build Commands
```bash
# Build for local testing
npm run build:local
eas build --profile local

# Build for development testing
npm run build:dev
eas build --profile development

# Build for production
npm run build:prod
eas build --profile production
```

### Installing Multiple Versions on Device

Each environment has a different bundle identifier/package name:
- **Local**: `com.allioexpo.local`
- **Development**: `com.allioexpo.dev`  
- **Production**: `com.allioexpo`

This allows you to install all three versions on the same device simultaneously.

## 🔧 Using Environment Configuration in Code

```typescript
import { Environment, Logger, AppConfig } from '@utils/environment';

// Access environment variables

// Use environment-specific logging
Logger.debug('This only shows in debug mode');
Logger.info('This shows in dev and local');
Logger.error('This always shows');

// Use app configuration
const apiTimeout = AppConfig.api.timeout;
const enableAnalytics = AppConfig.features.enableAnalytics;
```

## 🔐 Security Best Practices

1. **Never commit sensitive production secrets** to git
2. Keep `.env.production` in `.gitignore`
3. Use EAS Secrets for sensitive production variables
4. Share `.env.local` and `.env.development` with your team

## 📋 Setup Checklist

- [ ] Update API URLs in environment files
- [ ] Update Firebase project IDs
- [ ] Configure your backend to handle different environments
- [ ] Test each environment builds successfully
- [ ] Verify each environment installs as separate app
- [ ] Update team members about environment setup

## 🛠 Common Commands

```bash
# Check current environment
expo config --type public

# Clear cache if environment switching issues
expo start -c

# Build and install local version
eas build --profile local --platform android --local
```

## 🔄 Environment Switching

The environment is determined by:
1. `EXPO_PUBLIC_ENV` environment variable
2. EAS build profile configuration
3. Defaults to 'local' if not specified

## 📝 Customizing Environments

To add new environment variables:

1. Add to all `.env.*` files
2. Update `utils/environment.ts` interface
3. Add to `eas.json` build profiles if needed
4. Use in your app code via `Environment.YOUR_VARIABLE`

## 🤝 Team Collaboration

1. **Share** `.env.local` and `.env.development` files
2. **Never share** `.env.production` - use EAS Secrets instead
3. **Document** any new environment variables in this README
4. **Test** environment switching before pushing changes
