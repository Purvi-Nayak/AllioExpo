import { getApps } from "@react-native-firebase/app";
import firestore, { collection, getDocs, limit, query, where } from "@react-native-firebase/firestore";
import { Buffer } from "buffer";
import { Dimensions } from "react-native";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

// MPIN encryption/decryption functions
export const encryptMPIN = (mpin: string): string => {
  return Buffer.from(mpin).toString('base64');
};

export const decryptMPIN = (encryptedMpin: string): string => {
  return Buffer.from(encryptedMpin, 'base64').toString();
};

export const compareMPIN = (plainMpin: string, encryptedMpin: string): boolean => {
  const encryptedInput = encryptMPIN(plainMpin);
  return encryptedInput === encryptedMpin;
};

const checkUserExistsByEmail = async (email: string): Promise<boolean> => {
  try {
    // Check if Firebase is initialized using modern API
    if (getApps().length === 0) {
      console.error("Firebase not initialized");
      throw new Error("Firebase not initialized");
    }
    console.log("Checking if user exists with email:", email);

    const db = firestore();
    const usersCollection = collection(db, "users");
    const userQuery = query(
      usersCollection,
      where("email", "==", email.trim().toLowerCase()),
      limit(1)
    );
    
    const querySnapshot = await getDocs(userQuery);
    const exists = !querySnapshot.empty;
    console.log("User exists:", exists);

    return exists;
  } catch (error) {
    console.error("[Firestore] Error checking user existence:", error);
    throw error;
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
    console.error("[Firestore] Error updating user auth preferences by email:", error);
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

// Add other helper functions as needed
export const requestUserPermission = async () => {
  // Implement permission requests here
  console.log("Requesting user permissions...");
};

export {
  checkUserExistsByEmail,
  height,
  width
};
