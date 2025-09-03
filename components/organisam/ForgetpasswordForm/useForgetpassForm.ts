// import { getAuth, sendPasswordResetEmail } from "@react-native-firebase/auth";
// import { checkUserExistsByEmail } from "@utils/helper";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import { Alert } from "react-native";

// export type ForgotPasswordValues = { email: string };

// const useForgotPasswordForm = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   const navigateToLogin = () => router.push("/(public)/login");

//   const handleForgotPassword = async (values: ForgotPasswordValues) => {
//     const email = values.email.trim().toLowerCase();
//     setLoading(true);
//     try {
//       if (!email) {
//         Alert.alert("Error", "Please enter your email address.");
//         return;
//       }

//       const exists = await checkUserExistsByEmail(email);
//       if (!exists) {
//         Alert.alert("Error", "No account found with this email address.");
//         return;
//       }

//       const auth = getAuth();
//       await sendPasswordResetEmail(auth, email);

//       Alert.alert("Success", "Password reset email sent! Check your inbox.", [
//         { text: "OK", onPress: navigateToLogin },
//       ]);
//     } catch (error: any) {
//       const code = error.code;
//       let message = "Failed to send reset email. Please try again.";
//       if (code === "auth/user-not-found")
//         message = "No user found with this email address.";
//       else if (code === "auth/invalid-email")
//         message = "Invalid email address format.";
//       else if (code === "auth/too-many-requests")
//         message = "Too many requests. Please try later.";
//       Alert.alert("Error", message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, handleForgotPassword, navigateToLogin };
// };

// export default useForgotPasswordForm;
import { showError, showSuccess } from "@/utils/toastConfig";
import { getAuth, sendPasswordResetEmail } from "@react-native-firebase/auth";
import { checkUserExistsByEmail } from "@utils/helper";
import { useRouter } from "expo-router";
import { useState } from "react";

export type ForgotPasswordValues = { email: string };

const useForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const navigateToLogin = () => {
    console.log("🚀 Navigating from forgot password to login...");

    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(public)/login");
      }
    } catch (error) {
      router.navigate("/(public)/login");
    }
  };

  const handleForgotPassword = async (values: ForgotPasswordValues) => {
    const email = values.email.trim().toLowerCase();
    setLoading(true);
    try {
      if (!email) {
        showError("Please enter your email address.");
        return;
      }

      const exists = await checkUserExistsByEmail(email);
      if (!exists) {
        showError("No account found with this email address.");
        return;
      }

      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      showSuccess("Password reset email sent! Check your inbox.");

      // Navigate after a short delay to show the toast
      // setTimeout(() => {
      //   navigateToLogin();
      // }, 2000);
      setTimeout(() => {
        // ✅ Go back to login (removes forgot from stack)
        router.back();
      }, 2000);
    } catch (error: any) {
      const code = error.code;
      let message = "Failed to send reset email. Please try again.";

      if (code === "auth/user-not-found") {
        message = "No user found with this email address.";
      } else if (code === "auth/invalid-email") {
        message = "Invalid email address format.";
      } else if (code === "auth/too-many-requests") {
        message = "Too many requests. Please try again later.";
      }

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleForgotPassword, navigateToLogin };
};

export default useForgotPasswordForm;
