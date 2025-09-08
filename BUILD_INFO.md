# AllioExpo - Build Information

## 📱 Available Builds

### Development Builds
- **Local Environment**: Built for local development and testing
- **Development Environment**: Built with development server configuration
- **Staging Environment**: Pre-production testing build
- **Production Environment**: Release-ready production build

## 🚀 Getting Builds

### Option 1: EAS Build (Recommended)
```bash
# Build specific environments
npm run build:local      # Local testing
npm run build:dev        # Development testing
npm run build:staging    # Pre-production testing
npm run build:prod       # Production release
```

### Option 2: Download from EAS Dashboard
Visit: https://expo.dev/accounts/purvin_itpath/projects/AllioExpo/builds

### Option 3: Development Build (Fast Testing)
```bash
# Install development build once, then switch environments
npx expo run:android     # Install dev build
npm run start:local      # Load local environment
npm run start:staging    # Load staging environment
npm run start:prod       # Load production environment
```

## 🌍 Environment Configurations

| Environment | Package Name | Debug Mode | API URL |
|-------------|--------------|------------|---------|
| Local | `com.allioexpo.local` | ✅ ON | Local development server |
| Development | `com.allioexpo.dev` | ✅ ON | Development server |
| Staging | `com.allioexpo.staging` | ❌ OFF | Staging server |
| Production | `com.allioexpo` | ❌ OFF | Production server |

## 📋 Installation Notes

- Each environment installs as a separate app
- You can have all 4 versions installed simultaneously
- Use development build for fast environment switching
- Use standalone builds for production testing

## 🔗 Latest Builds

- **Staging**: [Download](https://expo.dev/accounts/purvin_itpath/projects/AllioExpo/builds/8756087d-ab87-4c9c-b214-140092fdda08)
- **Development**: [Check EAS Dashboard](https://expo.dev/accounts/purvin_itpath/projects/AllioExpo/builds)

> **Note**: APK files are not stored in this repository. Download from EAS Build or create new builds using the commands above.
