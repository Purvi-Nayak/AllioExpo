// import { setStateKey } from "@/redux/slices/AuthSlice";
// import useValidation from "@/utils/velidationSchema";
// import firebase from "@react-native-firebase/app";
// import {
//   createUserWithEmailAndPassword,
//   getAuth,
// } from "@react-native-firebase/auth";
// import firestore from "@react-native-firebase/firestore";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import { Alert } from "react-native";
// import { useDispatch } from "react-redux";

// export type RegistrationValues = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   mobileNo: string;
//   password: string;
//   confirmPassword: string;
// };

// const useRegisterForm = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { registrationValidationSchema } = useValidation();

//   const initialValues: RegistrationValues = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     mobileNo: "",
//     password: "",
//     confirmPassword: "",
//   };

//   const checkFirebaseInitialization = () => {
//     if (firebase.apps.length === 0) {
//       throw new Error("Firebase not initialized");
//     }
//   };

//   const saveUserToFirestore = async (userId: string, userData: any) => {
//     try {
//       await firestore()
//         .collection("users")
//         .doc(userId)
//         .set({
//           ...userData,
//           createdAt: new Date().toISOString(),
//           provider: "email",
//           uid: userId,
//         });
//       console.log("User saved to Firestore successfully");
//     } catch (error) {
//       console.error("[Firestore] Error saving user:", error);
//       throw error;
//     }
//   };

//   const handleRegister = async (values: RegistrationValues) => {
//     setLoading(true);
//     try {
//       // Check if Firebase is initialized
//       checkFirebaseInitialization();

//       console.log("Registration started for:", values.email);

//       const auth = getAuth();

//       // Create Firebase user
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         values.email.trim().toLowerCase(),
//         values.password.trim()
//       );

//       const user = userCredential.user;
//       if (!user) {
//         throw new Error("No user created");
//       }

//       console.log("User created successfully:", user.uid);

//       const idToken = await user.getIdToken();
//       dispatch(setStateKey({ key: "token", value: idToken }));

//       const userData = {
//         firstName: values.firstName.trim(),
//         lastName: values.lastName.trim(),
//         email: values.email.trim().toLowerCase(),
//         mobileNo: values.mobileNo.trim(),
//         profileImage: "",
//         uid: user.uid,
//       };

//       // Save to Firestore
//       await saveUserToFirestore(user.uid, userData);

//       // Save to Redux
//       dispatch(setStateKey({ key: "userData", value: userData }));

//       Alert.alert(
//         "Success",
//         "Registration Successful! Please login to continue.",
//         [
//           {
//             text: "OK",
//             onPress: () => router.push("/(public)/login"),
//           },
//         ]
//       );
//     } catch (error: any) {
//       console.error("[Register] Error:", error.code, error.message);

//       let errorMessage = "Registration failed. Please try again.";

//       if (error.code === "auth/email-already-in-use") {
//         errorMessage =
//           "This email is already registered. Please use a different email or try logging in.";
//       } else if (error.code === "auth/invalid-email") {
//         errorMessage =
//           "Invalid email format. Please enter a valid email address.";
//       } else if (error.code === "auth/weak-password") {
//         errorMessage =
//           "Password is too weak. Please use at least 6 characters.";
//       } else if (error.code === "auth/network-request-failed") {
//         errorMessage = "Network error. Please check your internet connection.";
//       } else if (error.message === "Firebase not initialized") {
//         errorMessage = "App is still loading. Please try again in a moment.";
//       }

//       Alert.alert("Registration Error", errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigateToLogin = () => {
//     router.push("/(public)/login");
//   };

//   return {
//     initialValues,
//     registrationValidationSchema,
//     handleRegister,
//     loading,
//     navigateToLogin,
//   };
// };

// export default useRegisterForm;
import { setStateKey } from "@/redux/slices/AuthSlice";
import { showError, showSuccess } from "@/utils/toastConfig";
import useValidation from "@/utils/velidationSchema";
import firebase from "@react-native-firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
} from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useDispatch } from "react-redux";

export type RegistrationValues = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  password: string;
  confirmPassword: string;
};

const useRegisterForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { registrationValidationSchema } = useValidation();

  const initialValues: RegistrationValues = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
  };

  const checkFirebaseInitialization = () => {
    if (firebase.apps.length === 0) {
      throw new Error("Firebase not initialized");
    }
  };

  const saveUserToFirestore = async (userId: string, userData: any) => {
    try {
      await firestore()
        .collection("users")
        .doc(userId)
        .set({
          ...userData,
          createdAt: new Date().toISOString(),
          provider: "email",
          uid: userId,
        });
      console.log("User saved to Firestore successfully");
    } catch (error) {
      console.error("[Firestore] Error saving user:", error);
      throw error;
    }
  };

  const handleRegister = async (values: RegistrationValues) => {
    setLoading(true);
    try {
      // Check if Firebase is initialized
      checkFirebaseInitialization();

      console.log("Registration started for:", values.email);

      const auth = getAuth();

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email.trim().toLowerCase(),
        values.password.trim()
      );

      const user = userCredential.user;
      if (!user) {
        throw new Error("No user created");
      }

      console.log("User created successfully:", user.uid);

      const idToken = await user.getIdToken();
      dispatch(setStateKey({ key: "token", value: idToken }));

      const userData = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        mobileNo: values.mobileNo.trim(),
        profileImage: "",
        uid: user.uid,
        // Initialize MPIN fields for new users
        mpin: null,
        mpinSet: false,
        authMethod: null,
      };

      // Save to Firestore
      await saveUserToFirestore(user.uid, userData);

      // Save to Redux
      dispatch(setStateKey({ key: "userData", value: userData }));

      showSuccess("Registration Successful! Please login to continue.");

      // Navigate after a short delay to show the toast
      setTimeout(() => {
        router.back();
        // router.replace("/(public)/login");
      }, 1500);
    } catch (error: any) {
      console.error("[Register] Error:", error.code, error.message);

      let errorMessage = "Registration failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please use a different email or try logging in.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage =
          "Invalid email format. Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message === "Firebase not initialized") {
        errorMessage = "App is still loading. Please try again in a moment.";
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // const navigateToLogin = () => {
  //   // router.replace("/(public)/login");
  //   router.back();
  // };
  // const navigateToLogin = () => {
  //   console.log("🚀 Attempting to navigate to login...");

  //   try {
  //     // Method 1: Try router.back() first
  //     if (router.canGoBack()) {
  //       console.log("✅ Using router.back()");
  //       router.back();
  //     } else {
  //       // Method 2: If can't go back, use replace
  //       console.log("✅ Using router.replace()");
  //       router.replace("/(public)/login");
  //     }
  //   } catch (error) {
  //     // Method 3: Fallback to push if replace fails
  //     console.log("⚠️ Fallback to router.push()");
  //     console.error("Navigation error:", error);
  //     router.push("/(public)/login");
  //   }
  // };

  const navigateToLogin = () => {
    console.log("🚀 Navigating from register to login...");

    try {
      // Check if we came from login screen
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(public)/login");
      }
    } catch (error) {
      // Fallback
      router.navigate("/(public)/login");
    }
  };

  return {
    initialValues,
    registrationValidationSchema,
    handleRegister,
    loading,
    navigateToLogin,
  };
};

export default useRegisterForm;
