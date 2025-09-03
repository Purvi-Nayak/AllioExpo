// import { AuthProvider } from "@/context/AuthContext";
// import { useColorScheme } from "@/hooks/useColorScheme";
// import { persistor, store } from "@/redux/store";
// import firebase from "@react-native-firebase/app";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import "react-native-reanimated";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";

// // Configure splash screen
// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   useEffect(() => {
//     // Check if Firebase is initialized
//     console.log("Firebase apps:", firebase.apps);
//     if (firebase.apps.length > 0) {
//       console.log("Firebase initialized successfully");
//     }
//   }, []);
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
//     "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
//     "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
//     "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
//     "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hide();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     // Keep splash screen visible while fonts are loading
//     return null;
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//         <Provider store={store}>
//           {" "}
//           {/* Redux Provider */}
//           <PersistGate loading={null} persistor={persistor}>
//             <AuthProvider>
//               {" "}
//               {/* Your Auth Context */}
//               <Stack screenOptions={{ headerShown: false }}>
//                 <Stack.Screen name="index" />
//                 <Stack.Screen
//                   name="(public)"
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="(private)"
//                   options={{ headerShown: false }}
//                 />
//               </Stack>
//               <StatusBar style="auto" />
//             </AuthProvider>
//           </PersistGate>
//         </Provider>
//       </ThemeProvider>
//     </GestureHandlerRootView>
//   );
// }
import { useColorScheme } from "@/hooks/useColorScheme";
import { persistor, store } from "@/redux/store";
import firebase from "@react-native-firebase/app";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// Configure splash screen
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Check if Firebase is already initialized
        if (firebase.apps.length === 0) {
          console.log("Waiting for Firebase to initialize...");
          // Firebase should auto-initialize with Expo
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log("Firebase apps:", firebase.apps.length);
        if (firebase.apps.length > 0) {
          console.log("✅ Firebase initialized successfully");
          setFirebaseInitialized(true);
        } else {
          console.error("❌ Firebase not initialized, continuing anyway");
          setFirebaseInitialized(true); // Allow app to continue even if Firebase fails
        }
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setFirebaseInitialized(true); // Allow app to continue
      }
    };

    initializeFirebase();
  }, []);

  useEffect(() => {
    if (loaded && firebaseInitialized) {
      SplashScreen.hide();
    }
  }, [loaded, firebaseInitialized]);

  // Show loading while fonts or Firebase are loading
  if (!loaded || !firebaseInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(public)" options={{ headerShown: false }} />
              <Stack.Screen name="(private)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
            <Toast />
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
