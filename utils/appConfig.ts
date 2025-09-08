import { Environment, Logger } from './environment';

export const AppConfig = {
  // API Configuration
  api: {
    baseURL: Environment.API_BASE_URL,
    timeout: Environment.ENV === 'production' ? 10000 : 30000,
    retryAttempts: Environment.ENV === 'production' ? 3 : 1,
  },

  // Firebase Configuration
  firebase: {
    projectId: Environment.FIREBASE_PROJECT_ID,
    // Add other Firebase config based on environment
  },

  // App Behavior
  app: {
    name: Environment.APP_NAME,
    enableDebugMode: Environment.DEBUG_MODE,
    logLevel: Environment.LOG_LEVEL,
    showDevTools: Environment.ENV !== 'production',
    enableCrashReporting: Environment.ENV === 'production',
  },

  // Feature Flags
  features: {
    enableAnalytics: Environment.ENV === 'production',
    enableBetaFeatures: Environment.ENV !== 'production',
    enableMockData: Environment.ENV === 'local',
  },

  // Security
  security: {
    enableSSLPinning: Environment.ENV === 'production',
    allowHTTP: Environment.ENV === 'local',
  },
};

// Log current environment on app start
Logger.info('App started with configuration:', {
  environment: Environment.ENV,
  apiBaseURL: Environment.API_BASE_URL,
  debugMode: Environment.DEBUG_MODE,
});

export default AppConfig;
