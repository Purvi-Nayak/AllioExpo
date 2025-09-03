import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import { Dimensions } from "react-native";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const checkUserExistsByEmail = async (email: string): Promise<boolean> => {
  try {
    // Check if Firebase is initialized
    if (firebase.apps.length === 0) {
      console.error("Firebase not initialized");
      throw new Error("Firebase not initialized");
    }

    console.log("Checking if user exists with email:", email);

    const usersRef = firestore().collection("users");
    const querySnapshot = await usersRef
      .where("email", "==", email.trim().toLowerCase())
      .limit(1)
      .get();

    const exists = !querySnapshot.empty;
    console.log("User exists:", exists);

    return exists;
  } catch (error) {
    console.error("[Firestore] Error checking user existence:", error);
    throw error;
  }
};

// Add other helper functions as needed
export const requestUserPermission = async () => {
  // Implement permission requests here
  console.log("Requesting user permissions...");
};

export { checkUserExistsByEmail, height, width };
