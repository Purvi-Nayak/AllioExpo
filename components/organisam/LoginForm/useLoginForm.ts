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
import { checkUserExistsByEmail } from "@/utils/helper";
import { showError, showSuccess } from "@/utils/toastConfig";
import useValidation from "@/utils/velidationSchema";
import firebase from "@react-native-firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { useRouter } from "expo-router";
import { useState } from "react";
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

  const checkFirebaseInitialization = () => {
    if (firebase.apps.length === 0) {
      throw new Error("Firebase not initialized");
    }
  };

  const handleLogin = async (values: typeof initialValues) => {
    setLoading(true);

    try {
      // Check if Firebase is initialized
      checkFirebaseInitialization();

      const email = values.email.trim().toLowerCase();
      const password = values.password.trim();

      console.log("Attempting login for:", email);

      const exists = await checkUserExistsByEmail(email);
      if (!exists) {
        showError("User does not exist!");
        return;
      }

      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (user) {
        console.log("User logged in successfully:", user.uid);

        const idToken = await user.getIdToken();
        dispatch(setStateKey({ key: "token", value: idToken }));

        const userDocRef = firestore().collection("users").doc(user.uid);
        const userDoc = await userDocRef.get();
        const userData = userDoc.data();

        const essentialUserData = {
          email: userData?.email || email,
          firstName: userData?.firstName || "",
          lastName: userData?.lastName || "",
          mobileNo: userData?.mobileNo || "",
          profileImage: userData?.profileImage || "",
          uid: user.uid,
        };

        dispatch(setStateKey({ key: "userData", value: essentialUserData }));
        showSuccess("Login Successful!");

        // Navigate after a short delay to show the toast
        setTimeout(() => {
          router.replace("/(public)/auth-setup");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error in handleLogin:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message === "Firebase not initialized") {
        errorMessage = "App is still loading. Please try again in a moment.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage =
          "Invalid credentials. Please check your email and password.";
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
