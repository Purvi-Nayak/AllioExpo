import firestore from "@react-native-firebase/firestore";
import { Dimensions } from "react-native";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const checkUserExistsByEmail = async (email: string): Promise<boolean> => {
  try {
    const querySnapshot = await firestore()
      .collection("users")
      .where("email", "==", email)
      .get();

    const exists = !querySnapshot.empty;
    return exists;
  } catch (error) {
    console.error("[Firestore] Error checking user existence:", error);
    return false;
  }
};

export { checkUserExistsByEmail, height, width };
