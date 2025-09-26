import { setUserData } from "@/store/localStates/userData";
import {
  getAllUsers,
  getUserDocument,
  signInWithEmailAndPassword,
  type AuthUser,
} from "@/utils/authService";
import { checkUserExistsByEmail } from "@/utils/helper";
import { showError, showSuccess } from "@/utils/toastConfig";
import useValidation from "@/utils/velidationSchema";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";

// Import SecureStore only for mobile
let SecureStore: any = null;
if (Platform.OS !== "web") {
  try {
    SecureStore = require("expo-secure-store");
  } catch (error) {
    console.log("SecureStore not available");
  }
}

export const useLoginForm = () => {
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loginValidationSchema } = useValidation();

  const initialValues = {
    email: "",
    password: "",
  };

  const handleLogin = async (values: typeof initialValues) => {
    setLoading(true);

    try {
      const email = values.email.trim().toLowerCase();
      const password = values.password.trim();

      console.log(`🚀 Attempting login for: "${email}" on ${Platform.OS}`);

      // Debug: Get all users first to see what's in the database
      console.log("🔍 Debug: Getting all users...");
      const allUsers = await getAllUsers();

      // Check if user exists
      console.log(`🔍 Now checking if user "${email}" exists...`);
      const exists = await checkUserExistsByEmail(email);
      console.log(`✅ User exists check result: ${exists}`);

      if (!exists) {
        showError("User does not exist!");
        return;
      }

      const user: AuthUser = await signInWithEmailAndPassword(email, password);

      if (user) {
        console.log(
          `✅ User logged in successfully: ${user.uid} on ${Platform.OS}`
        );

        const idToken = await user.getIdToken();
        console.log("✅ ID Token retrieved successfully");

        // Get user data from Firestore using platform-specific service
        const userData = await getUserDocument(user.uid);

        const essentialUserData = {
          email: userData?.email || email,
          firstName: userData?.firstName || "",
          lastName: userData?.lastName || "",
          mobileNo: userData?.mobileNo || "",
          profileImage: userData?.profileImage || "",
          uid: user.uid,
          idToken,
        };

        // Save to Redux
        dispatch(setUserData(essentialUserData));
        console.log("✅ Data saved to Redux");

        showSuccess("Login Successful!");

        // Navigate based on platform
        setTimeout(() => {
          if (Platform.OS === "web") {
            console.log("🌐 Navigating to web dashboard...");
            router.replace("/(private)/(tabs)/home");
          } else {
            console.log("📱 Navigating to mobile dashboard...");
            router.replace("/(private)/(tabs)/home");
          }
        }, 1500);
      }
    } catch (error: any) {
      console.error(`❌ Error in handleLogin on ${Platform.OS}:`, error);

      let errorMessage = "Login failed. Please try again.";

      // Handle Firebase Auth error codes (consistent across platforms)
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No user found with this email address.";
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
          errorMessage =
            "Invalid credentials. Please check your email and password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          if (error.message?.includes("Firebase not initialized")) {
            errorMessage =
              "App is still loading. Please try again in a moment.";
          } else {
            console.error("Unhandled auth error:", error.code, error.message);
            errorMessage = `Authentication failed: ${error.message}`;
          }
          break;
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push("/(public)/register");
  };

  const navigateToForgotPassword = () => {
    router.push("/(public)/forgetpassword");
  };

  return {
    remember,
    setRemember: () => setRemember((prev) => !prev),
    loading,
    handleLogin,
    initialValues,
    loginValidationSchema,
    navigateToRegister,
    navigateToForgotPassword,
  };
};
