// // import { Stack, useRouter } from "expo-router";
// // import { useEffect } from "react";
// // import { ActivityIndicator, View } from "react-native";
// // import { useAuth } from "../context/AuthContext";

// // export default function PrivateLayout() {
// //   const { isAuthenticated, isLoading } = useAuth();
// //   const router = useRouter();

// //   useEffect(() => {
// //     if (!isLoading && !isAuthenticated) {
// //       router.replace("/(public)/login");
// //     }
// //   }, [isAuthenticated, isLoading]);

// //   if (isLoading) {
// //     return (
// //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
// //         <ActivityIndicator size="large" />
// //       </View>
// //     );
// //   }

// //   if (!isAuthenticated) {
// //     return null;
// //   }

// //   return (
// //     <Stack screenOptions={{ headerShown: false }}>
// //       <Stack.Screen name="(tabs)" />
// //     </Stack>
// //   );
// // }
// import { RootState } from "@/redux/store";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { useSelector } from "react-redux";

// export default function IndexScreen() {
//   const { isAuthenticated, token } = useSelector(
//     (state: RootState) => state.auth
//   );
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     // Small delay to allow Redux persist to rehydrate
//     const checkAuthStatus = async () => {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       setIsLoading(false);
//     };

//     checkAuthStatus();
//   }, []);

//   useEffect(() => {
//     if (!isLoading) {
//       if (isAuthenticated && token) {
//         // User is authenticated, redirect to private area
//         router.replace("/(private)/(tabs)/home");
//       } else {
//         // User is not authenticated, redirect to login
//         router.replace("/(public)/login");
//       }
//     }
//   }, [isAuthenticated, token, isLoading, router]);

//   // Show loading screen while checking authentication
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ActivityIndicator size="large" />
//     </View>
//   );
// }
import { hydrateAuth, loadAuthData, setAuthChecking } from "@/redux/slices/AuthSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function IndexScreen() {
  const { 
    isAuthenticated, 
    token, 
    hasSetupSecurity, 
    authMethod, 
    isCheckingAuth 
  } = useSelector((state: RootState) => state.auth);
  
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load auth data from secure storage
        const authData = await loadAuthData();
        dispatch(hydrateAuth(authData));
        
        // Small delay to ensure smooth transition
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setIsLoading(false);
        dispatch(setAuthChecking(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !isCheckingAuth) {
      if (isAuthenticated && token) {
        if (hasSetupSecurity) {
          // User has set up security, go to verification screen
          if (authMethod === "biometric") {
            router.replace("/(public)/auth-biometric");
          } else if (authMethod === "mpin") {
            router.replace("/(public)/auth-mpin");
          } else {
            // Fallback - shouldn't happen but go to setup
            router.replace("/(public)/auth-setup");
          }
        } else {
          // User is logged in but hasn't set up security
          router.replace("/(public)/auth-setup");
        }
      } else {
        // User is not authenticated, go to login
        router.replace("/(public)/login");
      }
    }
  }, [isAuthenticated, token, hasSetupSecurity, authMethod, isLoading, isCheckingAuth, router]);

  // Show loading screen while checking authentication
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center",
      backgroundColor: "#FFCE1B" 
    }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}