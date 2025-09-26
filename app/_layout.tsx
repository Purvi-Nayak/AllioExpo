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
import { initializeFirebase } from "@/utils/firebaseConfig";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import { persistStore } from "redux-persist";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from "../store/configureStore";

// Configure splash screen with optimized settings for faster startup
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

const CustomNavigator = () => {
  const currentTheme = useSelector((state: any) => state.appTheme?.data);
  const systemTheme = useSystemColorScheme();

  const colorTheme = useMemo(() => {
    return currentTheme === false
      ? "light"
      : currentTheme === true
      ? "dark"
      : systemTheme;
  }, [systemTheme, currentTheme]);

  return (
    <ThemeProvider value={colorTheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={colorTheme === "dark" ? "light" : "dark"} />
        <Stack
          initialRouteName="(public)"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="(public)" options={{ headerShown: false }} />
          <Stack.Screen name="(private)" options={{ headerShown: false }} />
          <Stack.Screen
            name="+not-found"
            options={{
              headerStyle: { backgroundColor: "#25292e" },
              headerTintColor: "#fff",
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export default function RootLayout() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const colorScheme = useColorScheme();

  // Lazy load fonts for faster startup
  const [loaded] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  // Initialize Firebase
  useEffect(() => {
    const initFirebase = async () => {
      try {
        const result = initializeFirebase();

        if (result.success) {
          setFirebaseInitialized(true);
        } else {
          setFirebaseInitialized(true); // Set to true anyway to prevent infinite loading
        }
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setFirebaseInitialized(true); // Allow app to continue
      }
    };

    initFirebase();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    // Keep splash screen visible while fonts are loading
    return null;
  }

  const store = configureStore();
  const persistor = persistStore(store);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CustomNavigator />
          <Toast />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
