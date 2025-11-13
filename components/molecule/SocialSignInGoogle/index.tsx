import { setUserData } from "@/store/localStates/userData";
import { setUserDocument } from "@/utils/authService";
import { showError } from "@/utils/toastConfig";
import { ICONS } from "@assets/index";
import {
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import firestore, { doc, setDoc } from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { checkUserExistsByEmail } from "@utils/helper";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";
import SocialButton from "../socialButton";

interface SignInWithGoogleProps {
  setLoading: (loading: boolean) => void;
}

GoogleSignin.configure({
  webClientId:
    "299086233123-40u7rfe1tdb4q5m7341rtdqo5qabf7eu.apps.googleusercontent.com",
});

const SignInWithGoogle: React.FC<SignInWithGoogleProps> = ({ setLoading }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // 🔹 Shared builder for user data
  const buildUserData = (user: any, idToken?: string) => ({
    firstName: user.displayName?.split(" ")[0] || "",
    lastName: user.displayName?.split(" ")[1] || "",
    email: user.email ?? "",
    profileImage: user.photoURL || "",
    provider: "google",
    createdAt: new Date().toISOString(),
    uid: user.uid,
    ...(idToken ? { idToken } : {}),
  });

  // 🔹 Shared persisting + redirect
  const finalizeLogin = async (userData: any, idToken?: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...userData, idToken })
      );
    } else {
      dispatch(setUserData({ ...userData, idToken }));
    }
    router.replace("/(private)/(tabs)/home");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (Platform.OS === "web") {
        const firebaseAuth = await import("firebase/auth");
        const { getAuth, GoogleAuthProvider, signInWithPopup } = firebaseAuth;

        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");

        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken?.();

        const userExists = await checkUserExistsByEmail(user.email ?? "");
        const userData = buildUserData(user, idToken);

        if (!userExists) {
          await setUserDocument(user.uid, userData);
        }

        await finalizeLogin(userData, idToken);
        return;
      }

      // ✅ Mobile: Google Sign-In + Firebase
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      await GoogleSignin.signOut();
      await GoogleSignin.signIn();

      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) throw new Error("ID token is missing");

      console.log("idToken>", idToken);

      const credential = GoogleAuthProvider.credential(idToken);
      const authInstance = getAuth();
      const result = await signInWithCredential(authInstance, credential);

      const user = result.user;
      const userExists = await checkUserExistsByEmail(user.email ?? "");
      const userData = buildUserData(user, idToken);

      if (!userExists) {
        const db = firestore();
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, userData);
      }

      await finalizeLogin(userData, idToken);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);

      // 🔹 Handle account already exists
      if (error.code === "auth/account-exists-with-different-credential") {
        try {
          const email = error.customData?.email || error.email;
          if (email) {
            if (Platform.OS === "web") {
              const { fetchSignInMethodsForEmail, getAuth } = await import(
                "firebase/auth"
              );
              const methods = await fetchSignInMethodsForEmail(
                getAuth(),
                email
              );
              const provider = methods.includes("password")
                ? "Email & Password"
                : methods[0] || "another provider";

              showError(
                `An account with this email already exists. Please sign in using ${provider}.`
              );
            } else {
              const methods = await fetchSignInMethodsForEmail(
                getAuth(),
                email as string
              );
              const provider = methods.includes("password")
                ? "Email & Password"
                : methods[0] || "another provider";

              showError(
                `An account with this email already exists. Please sign in using ${provider}.`
              );
            }
          }
        } catch (e) {
          console.error("Error fetching sign-in methods:", e);
          showError(
            "An account with this email already exists. Please try another sign-in method."
          );
        }
      } else if (
        error.message?.includes("Sign in action cancelled") ||
        error.code === "auth/cancelled-popup-request"
      ) {
        // user cancelled → do nothing
        return;
      } else if (error.code === "auth/network-request-failed") {
        showError("Network error. Please check your connection and try again.");
      } else {
        showError(
          "There was an issue signing you in with Google. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SocialButton
      icon={ICONS.Google}
      onPress={handleGoogleLogin}
      accessibilityLabel="Login with Google"
      testID="google-login"
    />
  );
};

export default memo(SignInWithGoogle);
