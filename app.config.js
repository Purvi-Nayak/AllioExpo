import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment-specific .env file
const env = process.env.EXPO_PUBLIC_ENV || 'local';
const envFile = resolve(process.cwd(), `.env.${env}`);

console.log(`Loading environment: ${env} from ${envFile}`);
config({ path: envFile });

const IS_DEV = process.env.EXPO_PUBLIC_ENV === 'development';
const IS_LOCAL = process.env.EXPO_PUBLIC_ENV === 'local';
const IS_STAGING = process.env.EXPO_PUBLIC_ENV === 'staging';
const IS_PROD = process.env.EXPO_PUBLIC_ENV === 'production';

// Determine app configuration based on environment
const getAppConfig = () => {
  let config = {
    name: 'AllioExpo',
    slug: 'AllioExpo', // Keep same slug for EAS
    package: 'com.allioexpo',
    bundleIdentifier: 'com.allioexpo',
    scheme: 'allioexpo',
  };

  if (IS_LOCAL) {
    config = {
      name: 'AllioExpo Local',
      slug: 'AllioExpo', // Keep same slug for EAS
      package: 'com.allioexpo.local',
      bundleIdentifier: 'com.allioexpo.local',
      scheme: 'allioexpo-local',
    };
  } else if (IS_DEV) {
    config = {
      name: 'AllioExpo Dev',
      slug: 'AllioExpo', // Keep same slug for EAS
      package: 'com.allioexpo.dev',
      bundleIdentifier: 'com.allioexpo.dev',
      scheme: 'allioexpo-dev',
    };
  } else if (IS_STAGING) {
    config = {
      name: 'AllioExpo Staging',
      slug: 'AllioExpo', // Keep same slug for EAS
      package: 'com.allioexpo.staging',
      bundleIdentifier: 'com.allioexpo.staging',
      scheme: 'allioexpo-staging',
    };
  }

  return config;
};

const appConfig = getAppConfig();

export default {
  expo: {
    name: appConfig.name,
    slug: appConfig.slug,
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: appConfig.scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#FFCE1B'
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: appConfig.bundleIdentifier,
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        NSFaceIDUsageDescription: 'This app uses Face ID for secure authentication.',
        CFBundleURLTypes: [
          {
            CFBundleURLName: 'facebook',
            CFBundleURLSchemes: [`fb${process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1283627919920193'}`]
          }
        ]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#FFCE1B'
      },
      edgeToEdgeEnabled: true,
      package: appConfig.package,
      googleServicesFile: './google-services.json',
      permissions: [
        'USE_FINGERPRINT',
        'USE_BIOMETRIC'
      ],
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: `fb${process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1283627919920193'}`
            }
          ],
          category: ['BROWSABLE', 'DEFAULT']
        }
      ]
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      '@react-native-firebase/app',
      
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID for secure authentication.'
        }
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 300,
          resizeMode: 'contain',
          backgroundColor: '#FFCE1B'
        }
      ],
      'expo-font'
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: 'fd9dbaab-16ee-479d-b073-58043cf1b690'
      },
      ENV: process.env.EXPO_PUBLIC_ENV || 'local',
      facebookAppId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1283627919920193',
      facebookDisplayName: appConfig.name
    }
  }
};
