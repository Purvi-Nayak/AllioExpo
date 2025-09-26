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
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";

export default function IndexScreen() {
  const data = useSelector((state) => state?.userData);
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      const stored = localStorage.getItem("userData");
      if (stored) {
        setLocalUser(JSON.parse(stored));
      }
    }
  }, []);

  const token = data?.data?.idToken || localUser?.idToken;

  return (
    <>
      {token ? (
        <Redirect href={"/(private)/(tabs)/home"} />
      ) : (
        <Redirect href="/(public)/login" />
      )}
    </>
  );
}
