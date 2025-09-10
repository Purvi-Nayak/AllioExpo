import Constants from 'expo-constants';

export interface EnvironmentConfig {
  ENV: 'local' | 'development' | 'staging' | 'production';
  API_BASE_URL: string;
  APP_NAME: string;
  FIREBASE_PROJECT_ID: string;
  GOOGLE_WEB_CLIENT_ID: string;
  FACEBOOK_APP_ID: string;
  DEBUG_MODE: boolean;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = Constants.expoConfig?.extra?.ENV || process.env.EXPO_PUBLIC_ENV || 'local';
  
  const config: Record<string, EnvironmentConfig> = {
    local: {
      ENV: 'local',
      API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://allio-app-bxwta.ondigitalocean.app/api',
      APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'AllioExpo Local',
      FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'allio-cd2b5',
      GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '299086233123-40u7rfe1tdb4q5m7341rtdqo5qabf7eu.apps.googleusercontent.com',
      FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1283627919920193',
      DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
      LOG_LEVEL: (process.env.EXPO_PUBLIC_LOG_LEVEL as any) || 'debug',
    },
    development: {
      ENV: 'development',
      API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://allio-app-bxwta.ondigitalocean.app/api',
      APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'AllioExpo Dev',
      FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'allio-cd2b5',
      GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '299086233123-40u7rfe1tdb4q5m7341rtdqo5qabf7eu.apps.googleusercontent.com',
      FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1283627919920193',
      DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
      LOG_LEVEL: (process.env.EXPO_PUBLIC_LOG_LEVEL as any) || 'info',
    },
    staging: {
      ENV: 'staging',
      API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://allio-app-bxwta.ondigitalocean.app/api',
      APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'AllioExpo Staging',
      FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'allio-cd2b5',
      GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '299086233123-40u7rfe1tdb4q5m7341rtdqo5qabf7eu.apps.googleusercontent.com',
      FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1283627919920193',
      DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
      LOG_LEVEL: (process.env.EXPO_PUBLIC_LOG_LEVEL as any) || 'warn',
    },
    production: {
      ENV: 'production',
      API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://allio-app-bxwta.ondigitalocean.app/api',
      APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'AllioExpo',
      FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'allio-cd2b5',
      GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '299086233123-40u7rfe1tdb4q5m7341rtdqo5qabf7eu.apps.googleusercontent.com',
      FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1283627919920193',
      DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
      LOG_LEVEL: (process.env.EXPO_PUBLIC_LOG_LEVEL as any) || 'error',
    },
  };

  return config[env as string] || config.local;
};

export const Environment = getEnvironmentConfig();

// Helper functions
export const isProduction = () => Environment.ENV === 'production';
export const isDevelopment = () => Environment.ENV === 'development';
export const isStaging = () => Environment.ENV === 'staging';
export const isLocal = () => Environment.ENV === 'local';

// Logging utility based on environment
export const Logger = {
  debug: (...args: any[]) => {
    if (Environment.LOG_LEVEL === 'debug' && Environment.DEBUG_MODE) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (['debug', 'info'].includes(Environment.LOG_LEVEL)) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (['debug', 'info', 'warn'].includes(Environment.LOG_LEVEL)) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};

export default Environment;
