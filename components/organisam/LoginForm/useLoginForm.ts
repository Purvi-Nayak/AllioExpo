// import { setStateKey } from "@/redux/slices/AuthSlice";
// import { checkUserExistsByEmail } from "@/utils/helper";
// import useValidation from "@/utils/velidationSchema";
// import firebase from "@react-native-firebase/app";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
// } from "@react-native-firebase/auth";
// import firestore from "@react-native-firebase/firestore";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import { Alert } from "react-native";
// import { useDispatch } from "react-redux";

// export const useLoginForm = () => {
//   const [remember, setRemember] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { loginValidationSchema } = useValidation();

//   const initialValues = {
//     email: "",
//     password: "",
//   };

//   const checkFirebaseInitialization = () => {
//     if (firebase.apps.length === 0) {
//       throw new Error("Firebase not initialized");
//     }
//   };

//   const handleLogin = async (values: typeof initialValues) => {
//     setLoading(true);

//     try {
//       // Check if Firebase is initialized
//       checkFirebaseInitialization();

//       const email = values.email.trim().toLowerCase();
//       const password = values.password.trim();

//       console.log("Attempting login for:", email);

//       const exists = await checkUserExistsByEmail(email);
//       if (!exists) {
//         Alert.alert("Error", "User does not exist!");
//         return;
//       }

//       const auth = getAuth();
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       const user = userCredential.user;

//       if (user) {
//         console.log("User logged in successfully:", user.uid);

//         const idToken = await user.getIdToken();
//         dispatch(setStateKey({ key: "token", value: idToken }));

//         const userDocRef = firestore().collection("users").doc(user.uid);
//         const userDoc = await userDocRef.get();
//         const userData = userDoc.data();

//         const essentialUserData = {
//           email: userData?.email || email,
//           firstName: userData?.firstName || "",
//           lastName: userData?.lastName || "",
//           mobileNo: userData?.mobileNo || "",
//           profileImage: userData?.profileImage || "",
//           uid: user.uid, // Add uid for reference
//         };

//         dispatch(setStateKey({ key: "userData", value: essentialUserData }));
//         Alert.alert("Success", "Login Successful!");

//         router.replace("/(private)/(tabs)/home");
//       }
//     } catch (error: any) {
//       console.error("Error in handleLogin:", error);

//       let errorMessage = "Login failed. Please try again.";

//       if (error.code === "auth/user-not-found") {
//         errorMessage = "No user found with this email address.";
//       } else if (error.code === "auth/wrong-password") {
//         errorMessage = "Incorrect password. Please try again.";
//       } else if (error.code === "auth/invalid-email") {
//         errorMessage = "Invalid email address format.";
//       } else if (error.code === "auth/user-disabled") {
//         errorMessage = "This account has been disabled.";
//       } else if (error.code === "auth/too-many-requests") {
//         errorMessage = "Too many failed attempts. Please try again later.";
//       } else if (error.message === "Firebase not initialized") {
//         errorMessage = "App is still loading. Please try again in a moment.";
//       }

//       Alert.alert("Login Error", errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigateToRegister = () => {
//     router.push("/(public)/register");
//   };

//   const navigateToForgotPassword = () => {
//     router.push("/(public)/forgetpassword");
//   };

//   return {
//     remember,
//     setRemember: () => setRemember((prev) => !prev),
//     loading,
//     handleLogin,
//     initialValues,
//     loginValidationSchema,
//     navigateToRegister,
//     navigateToForgotPassword,
//   };
// };

import { setStateKey } from "@/redux/slices/AuthSlice";
import {
  signInWithEmailAndPassword,
  getUserDocument,
  getAllUsers,
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

  const saveAuthData = async (token: string, userData: any) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));
      } else {
        if (SecureStore) {
          await SecureStore.setItemAsync("authToken", token);
          await SecureStore.setItemAsync("userData", JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error("Error saving auth data:", error);
    }
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

      console.log("✅ User exists, proceeding with authentication...");

      // Use platform-specific authentication
      const user: AuthUser = await signInWithEmailAndPassword(email, password);

      if (user) {
        console.log(`✅ User logged in successfully: ${user.uid} on ${Platform.OS}`);

        const idToken = await user.getIdToken();
        console.log("✅ ID Token retrieved successfully");

        // Get user data from Firestore using platform-specific service
        const userData = await getUserDocument(user.uid);
        console.log("✅ User data retrieved:", userData ? "Success" : "No data found");

        const essentialUserData = {
          email: userData?.email || email,
          firstName: userData?.firstName || "",
          lastName: userData?.lastName || "",
          mobileNo: userData?.mobileNo || "",
          profileImage: userData?.profileImage || "",
          uid: user.uid,
        };

        // Save to Redux
        dispatch(setStateKey({ key: "token", value: idToken }));
        dispatch(setStateKey({ key: "userData", value: essentialUserData }));
        console.log("✅ Data saved to Redux");

        // Save to storage for persistence
        await saveAuthData(idToken, essentialUserData);
        console.log("✅ Data saved to storage");

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
          errorMessage = "Invalid credentials. Please check your email and password.";
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
            errorMessage = "App is still loading. Please try again in a moment.";
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
