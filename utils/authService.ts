import { Platform } from "react-native";
import { initializeFirebase } from "./firebaseConfig";

export interface AuthUser {
  uid: string;
  email: string | null;
  getIdToken(): Promise<string>;
}

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  profileImage: string;
  uid: string;
}

// Global state for the service
let isInitialized = false;
let webServices: any = null;
let mobileServices: any = null;
const isWeb = Platform.OS === "web";

// Initialize Firebase services
const initialize = async (): Promise<void> => {
  if (isInitialized) return;

  try {
    const result = initializeFirebase();

    if (result.success) {
      if (isWeb) {
        const { getAuth } = require("firebase/auth");
        const { getFirestore } = require("firebase/firestore");

        webServices = {
          auth: getAuth(),
          db: getFirestore(),
        };
      } else {
        const auth = require("@react-native-firebase/auth");
        const firestore = require("@react-native-firebase/firestore");

        mobileServices = {
          auth: auth.default,
          db: firestore.default,
        };
      }

      isInitialized = true;
      console.log(`✅ AuthService initialized for ${Platform.OS}`);
    } else {
      throw new Error(`Failed to initialize Firebase: ${result.error}`);
    }
  } catch (error) {
    console.error("❌ AuthService initialization failed:", error);
    throw error;
  }
};

// Ensure initialization before any operation
const ensureInitialized = async (): Promise<void> => {
  if (!isInitialized) {
    await initialize();
  }
};

// Sign in with email and password
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  await ensureInitialized();

  try {
    if (isWeb) {
      const {
        signInWithEmailAndPassword: webSignIn,
      } = require("firebase/auth");
      const userCredential = await webSignIn(webServices.auth, email, password);
      return userCredential.user as AuthUser;
    } else {
      const userCredential = await mobileServices
        .auth()
        .signInWithEmailAndPassword(email, password);
      return userCredential.user as AuthUser;
    }
  } catch (error: any) {
    console.error(`❌ Sign in failed on ${Platform.OS}:`, error);
    throw error;
  }
};

// Create user with email and password
export const createUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  await ensureInitialized();

  try {
    if (isWeb) {
      const {
        createUserWithEmailAndPassword: webCreateUser,
      } = require("firebase/auth");
      const userCredential = await webCreateUser(
        webServices.auth,
        email,
        password
      );
      return userCredential.user as AuthUser;
    } else {
      const userCredential = await mobileServices
        .auth()
        .createUserWithEmailAndPassword(email, password);
      return userCredential.user as AuthUser;
    }
  } catch (error: any) {
    console.error(`❌ Create user failed on ${Platform.OS}:`, error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  await ensureInitialized();

  try {
    if (isWeb) {
      const {
        sendPasswordResetEmail: webSendPasswordReset,
      } = require("firebase/auth");
      await webSendPasswordReset(webServices.auth, email);
    } else {
      await mobileServices.auth().sendPasswordResetEmail(email);
    }
  } catch (error: any) {
    console.error(`❌ Password reset failed on ${Platform.OS}:`, error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  await ensureInitialized();

  try {
    if (isWeb) {
      const { signOut: webSignOut } = require("firebase/auth");
      await webSignOut(webServices.auth);
    } else {
      await mobileServices.auth().signOut();
    }
  } catch (error: any) {
    console.error(`❌ Sign out failed on ${Platform.OS}:`, error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChanged = (
  callback: (user: AuthUser | null) => void
) => {
  if (!isInitialized) {
    console.warn("⚠️ AuthService not initialized yet for onAuthStateChanged");
    return () => {}; // Return empty unsubscribe function
  }

  try {
    if (isWeb) {
      const {
        onAuthStateChanged: webOnAuthStateChanged,
      } = require("firebase/auth");
      return webOnAuthStateChanged(webServices.auth, callback as any);
    } else {
      return mobileServices.auth().onAuthStateChanged(callback as any);
    }
  } catch (error: any) {
    console.error(`❌ Auth state listener failed on ${Platform.OS}:`, error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Get user document from Firestore
export const getUserDocument = async (
  uid: string
): Promise<UserData | null> => {
  await ensureInitialized();

  try {
    if (isWeb) {
      const { doc, getDoc } = require("firebase/firestore");
      const userRef = doc(webServices.db, "users", uid);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? (userSnap.data() as UserData) : null;
    } else {
      const userDoc = await mobileServices
        .db()
        .collection("users")
        .doc(uid)
        .get();
      return userDoc.exists ? (userDoc.data() as UserData) : null;
    }
  } catch (error: any) {
    console.error(`❌ Get user document failed on ${Platform.OS}:`, error);
    return null;
  }
};

// Set user document in Firestore
export const setUserDocument = async (
  uid: string,
  userData: Partial<UserData>
): Promise<void> => {
  await ensureInitialized();

  try {
    if (isWeb) {
      const { doc, setDoc } = require("firebase/firestore");
      const userRef = doc(webServices.db, "users", uid);
      await setDoc(userRef, userData, { merge: true });
    } else {
      await mobileServices
        .db()
        .collection("users")
        .doc(uid)
        .set(userData, { merge: true });
    }
  } catch (error: any) {
    console.error(`❌ Set user document failed on ${Platform.OS}:`, error);
    throw error;
  }
};

// Check if user exists by email
export const checkUserExistsByEmail = async (
  email: string
): Promise<boolean> => {
  await ensureInitialized();

  try {
    console.log(`🔍 [${Platform.OS}] Checking user existence for: "${email}"`);

    if (isWeb) {
      const {
        collection,
        query,
        where,
        getDocs,
      } = require("firebase/firestore");
      const usersRef = collection(webServices.db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      console.log(
        `📊 [Web] Query results: ${querySnapshot.size} documents found`
      );

      // Debug: Log all documents in the query result
      querySnapshot.forEach((doc) => {
        console.log(`📄 [Web] Found user:`, doc.id, doc.data());
      });

      return !querySnapshot.empty;
    } else {
      const querySnapshot = await mobileServices
        .db()
        .collection("users")
        .where("email", "==", email)
        .get();

      console.log(
        `📊 [Mobile] Query results: ${querySnapshot.size} documents found`
      );

      // Debug: Log all documents in the query result
      querySnapshot.forEach((doc) => {
        console.log(`📄 [Mobile] Found user:`, doc.id, doc.data());
      });

      return !querySnapshot.empty;
    }
  } catch (error: any) {
    console.error(`❌ Check user existence failed on ${Platform.OS}:`, error);
    return false;
  }
};

// Get all users for debugging
export const getAllUsers = async (): Promise<any[]> => {
  await ensureInitialized();

  try {
    console.log(`🔍 [${Platform.OS}] Getting all users for debugging...`);

    if (isWeb) {
      const { collection, getDocs } = require("firebase/firestore");
      const usersRef = collection(webServices.db, "users");
      const querySnapshot = await getDocs(usersRef);

      const users: any[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      console.log(`📊 [Web] Total users in database: ${users.length}`);
      users.forEach((user, index) => {
        console.log(`👤 [Web] User ${index + 1}:`, user);
      });

      return users;
    } else {
      const querySnapshot = await mobileServices.db().collection("users").get();

      const users: any[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      console.log(`📊 [Mobile] Total users in database: ${users.length}`);
      users.forEach((user, index) => {
        console.log(`👤 [Mobile] User ${index + 1}:`, user);
      });

      return users;
    }
  } catch (error: any) {
    console.error(`❌ Get all users failed on ${Platform.OS}:`, error);
    return [];
  }
};

// Initialize on module load
initialize().catch(console.error);
