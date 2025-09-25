import { Platform } from "react-native";

// Web Firebase imports (only loaded on web)
let webFirebase: any = null;
if (Platform.OS === "web") {
  try {
    webFirebase = require("firebase/app");
  } catch (error) {
    console.log("Firebase Web SDK not available");
  }
}

// Mobile Firebase imports (only loaded on mobile)
let mobileAuth: any = null;
let mobileFirestore: any = null;
if (Platform.OS !== "web") {
  try {
    mobileAuth = require("@react-native-firebase/auth");
    mobileFirestore = require("@react-native-firebase/firestore");
  } catch (error) {
    console.log("React Native Firebase not available");
  }
}

// Web Firebase Config
const webFirebaseConfig = {
  apiKey: "AIzaSyDdwEMSpXfo-u1yqPA4zyECbPb86nDp-IQ",
  authDomain: "allio-cd2b5.firebaseapp.com",
  projectId: "allio-cd2b5",
  storageBucket: "allio-cd2b5.firebasestorage.app",
  messagingSenderId: "299086233123",
  appId: "1:299086233123:web:472ba5357ad8776bd33b96",
  measurementId: "G-ZCBGZBCG48",
};

let firebaseApp: any = null;
let webAuth: any = null;
let webDb: any = null;

export const initializeFirebase = () => {
  try {
    if (Platform.OS === "web") {
      // Web Firebase initialization
      const { initializeApp, getApps } = require("firebase/app");
      const { getAuth } = require("firebase/auth");
      const { getFirestore } = require("firebase/firestore");

      if (getApps().length === 0) {
        firebaseApp = initializeApp(webFirebaseConfig);
        console.log("🔥 Firebase Web SDK initialized successfully");
      } else {
        firebaseApp = getApps()[0];
        console.log("🔥 Firebase Web SDK already initialized");
      }

      webAuth = getAuth(firebaseApp);
      webDb = getFirestore(firebaseApp);

      return { success: true, platform: "web" };
    } else {
      // Mobile Firebase is auto-initialized via google-services.json
      console.log("🔥 React Native Firebase auto-initialized for mobile");
      return { success: true, platform: "mobile" };
    }
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    return { success: false, error, platform: Platform.OS };
  }
};

export const getFirebaseServices = () => {
  if (Platform.OS === "web") {
    if (!webAuth || !webDb) {
      initializeFirebase();
    }
    return { auth: webAuth, db: webDb };
  } else {
    // Return mobile services
    return {
      auth: mobileAuth?.default ? mobileAuth.default() : null,
      db: mobileFirestore?.default ? mobileFirestore.default() : null,
    };
  }
};

export const isWebPlatform = Platform.OS === "web";
export const isMobilePlatform = Platform.OS !== "web";
