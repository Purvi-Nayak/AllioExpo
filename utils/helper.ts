import { getApps } from "@react-native-firebase/app";
import firestore, {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "@react-native-firebase/firestore";
import { Buffer } from "buffer";
import { Dimensions, Platform } from "react-native";
import { checkUserExistsByEmail as checkUserExists } from "./authService";

// FirestoreUser interface
interface FirestoreUser {
  id: string;
  email?: string;
  [key: string]: any;
}

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

// MPIN encryption/decryption functions
export const encryptMPIN = (mpin: string): string => {
  return Buffer.from(mpin).toString("base64");
};

export const decryptMPIN = (encryptedMpin: string): string => {
  return Buffer.from(encryptedMpin, "base64").toString();
};

export const compareMPIN = (
  plainMpin: string,
  encryptedMpin: string
): boolean => {
  const encryptedInput = encryptMPIN(plainMpin);
  return encryptedInput === encryptedMpin;
};

export const checkUserExistsByEmail = async (
  email: string
): Promise<boolean> => {
  try {
    console.log(
      `🔍 [Helper] Checking user existence for: ${email} on ${Platform.OS}`
    );
    return await checkUserExists(email);
  } catch (error) {
    console.error("❌ [Helper] Error checking user existence:", error);
    return false;
  }
};

// Firebase Firestore helpers for user auth preferences
export const getUserAuthPreferences = async (userId: string) => {
  try {
    if (getApps().length === 0) {
      console.error("Firebase not initialized");
      throw new Error("Firebase not initialized");
    }

    const db = firestore();
    const userDoc = await db.collection("users").doc(userId).get();

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("Retrieved user auth preferences:", userData);
      return {
        mpin: userData?.mpin || null,
        mpinSet: userData?.mpinSet || false,
        authMethod: userData?.authMethod || null, // 'biometric' or 'mpin'
      };
    }

    return {
      mpin: null,
      mpinSet: false,
      authMethod: null,
    };
  } catch (error) {
    console.error("[Firestore] Error getting user auth preferences:", error);
    throw error;
  }
};

export const updateUserAuthPreferences = async (
  userId: string,
  preferences: {
    mpin?: string | null;
    mpinSet?: boolean;
    authMethod?: string | null;
  }
) => {
  try {
    if (getApps().length === 0) {
      console.error("Firebase not initialized");
      throw new Error("Firebase not initialized");
    }

    const db = firestore();
    const userDocRef = db.collection("users").doc(userId);

    // Only update fields that are provided
    const updateData: any = {};
    if (preferences.mpin !== undefined) {
      updateData.mpin = preferences.mpin;
    }
    if (preferences.mpinSet !== undefined) {
      updateData.mpinSet = preferences.mpinSet;
    }
    if (preferences.authMethod !== undefined) {
      updateData.authMethod = preferences.authMethod;
    }

    console.log("Updating user auth preferences:", updateData);
    await userDocRef.update(updateData);
    console.log("User auth preferences updated successfully:", updateData);

    return true;
  } catch (error) {
    console.error("[Firestore] Error updating user auth preferences:", error);
    throw error;
  }
};

export const updateUserAuthPreferencesByEmail = async (
  email: string,
  preferences: {
    mpin?: string | null;
    mpinSet?: boolean;
    authMethod?: string | null;
  }
) => {
  try {
    if (getApps().length === 0) {
      console.error("Firebase not initialized");
      throw new Error("Firebase not initialized");
    }

    const db = firestore();
    const usersCollection = collection(db, "users");
    const userQuery = query(
      usersCollection,
      where("email", "==", email.trim().toLowerCase()),
      limit(1)
    );

    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const updateData: any = {};

      if (preferences.mpin !== undefined) {
        updateData.mpin = preferences.mpin;
      }
      if (preferences.mpinSet !== undefined) {
        updateData.mpinSet = preferences.mpinSet;
      }
      if (preferences.authMethod !== undefined) {
        updateData.authMethod = preferences.authMethod;
      }

      console.log("Updating user auth preferences by email:", updateData);
      await userDoc.ref.update(updateData);
      console.log("User auth preferences updated successfully by email");

      return true;
    } else {
      throw new Error("User not found with email: " + email);
    }
  } catch (error) {
    console.error(
      "[Firestore] Error updating user auth preferences by email:",
      error
    );
    throw error;
  }
};

export const resetUserMPIN = async (userId: string) => {
  try {
    if (getApps().length === 0) {
      console.error("Firebase not initialized");
      throw new Error("Firebase not initialized");
    }

    const db = firestore();
    const userDocRef = db.collection("users").doc(userId);

    await userDocRef.update({
      mpin: null,
      mpinSet: false,
      authMethod: null,
    });

    console.log("User MPIN reset successfully");
    return true;
  } catch (error) {
    console.error("[Firestore] Error resetting user MPIN:", error);
    throw error;
  }
};

// New utility functions
export const getAllUsers = async (
  currentUserEmail: string
): Promise<FirestoreUser[]> => {
  try {
    const snapshot = await firestore().collection("users").get();

    const users: FirestoreUser[] = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((user) => user.email !== currentUserEmail);

    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getCurrentTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

// Add other helper functions as needed
export const requestUserPermission = async () => {
  // Implement permission requests here
  console.log("Requesting user permissions...");
};

// Date/Time formatting functions
export const formatDateLabel = (timestamp: any): string => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (messageDate.getTime() === today.getTime()) {
    return "Today";
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  // Return formatted date for older messages
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const formatTime = (timestamp: any): string => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatLastSeen = (lastSeenDate: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return lastSeenDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Get user data by email
export const getUserData = async (email: string): Promise<any> => {
  try {
    if (!email) return null;

    const snapshot = await firestore()
      .collection("users")
      .where("email", "==", email.trim().toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const userData = snapshot.docs[0].data();
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export { height, width };
