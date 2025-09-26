import { setUserData } from "@/store/localStates/userData";
import {
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

      // Check if user exists
      const exists = await checkUserExistsByEmail(email);

      if (!exists) {
        showError("User does not exist!");
        return;
      }

      const user: AuthUser = await signInWithEmailAndPassword(email, password);

      if (user) {
        const idToken = await user.getIdToken();

        // Get user data from Firestore using platform-specific service
        const userData = await getUserDocument(user.uid);

        const essentialUserData = {
          ...userData,
          uid: user.uid,
          idToken,
        };

        if (Platform.OS === "web") {
          localStorage.setItem("userData", JSON.stringify(essentialUserData));
        } else {
          dispatch(setUserData(essentialUserData));
        }

        showSuccess("Login Successful!");

        // Navigate based on platform
        setTimeout(() => {
          if (Platform.OS === "web") {
            router.replace("/(private)/(tabs)/home");
          } else {
            router.replace("/(private)/(tabs)/home");
          }
        }, 1500);
      }
    } catch (error: any) {
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
