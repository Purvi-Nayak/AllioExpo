import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "react-native-reanimated";
import { AuthProvider } from "../context/AuthContext";

// Configure splash screen
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    // Keep splash screen visible while fonts are loading
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(public)" />
            <Stack.Screen name="(private)" />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

// import { useColorScheme } from "@/hooks/useColorScheme";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider as NavigationThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useCallback, useEffect } from "react";
// import { View } from "react-native";
// import "react-native-reanimated";
// import { AuthProvider } from "../context/AuthContext";
// import { ThemeProvider } from "../context/TheamContext";

// // Prevent the splash screen from auto-hiding before asset loading is complete
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   const [fontsLoaded, fontError] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//     "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
//     "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
//     "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
//     "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
//     "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
//   });

//   const onLayoutRootView = useCallback(async () => {
//     if (fontsLoaded || fontError) {
//       // Hide the splash screen once fonts are loaded or if there's an error
//       await SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, fontError]);

//   useEffect(() => {
//     // Handle font loading errors
//     if (fontError) {
//       console.error("Font loading error:", fontError);
//     }
//   }, [fontError]);

//   // Don't render the app until fonts are loaded
//   if (!fontsLoaded && !fontError) {
//     return null;
//   }

//   return (
//     <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
//       <ThemeProvider>
//         <NavigationThemeProvider
//           value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
//         >
//           <AuthProvider>
//             <Stack screenOptions={{ headerShown: false }}>
//               <Stack.Screen name="(public)" />
//               <Stack.Screen name="(private)" />
//             </Stack>
//             <StatusBar style="auto" />
//           </AuthProvider>
//         </NavigationThemeProvider>
//       </ThemeProvider>
//     </View>
//   );
// }
// import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
// import { useCallback } from "react";
// import { View } from "react-native";
// import "react-native-reanimated";

// // Prevent the splash screen from auto-hiding before asset loading is complete
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   const [fontsLoaded, fontError] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//     "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
//     "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
//     "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
//     "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
//     "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
//   });

//   const onLayoutRootView = useCallback(async () => {
//     if (fontsLoaded || fontError) {
//       // Hide the splash screen once fonts are loaded or if there's an error
//       await SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, fontError]);

//   useEffect(() => {
//     // Handle font loading errors
//     if (fontError) {
//       console.error("Font loading error:", fontError);
//     }
//   }, [fontError]);

//   // Don't render the app until fonts are loaded
//   if (!fontsLoaded && !fontError) {
//     return null;
//   }

//   return (
//     <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
//       <ThemeProvider>
//         <NavigationThemeProvider
//           value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
//         >
//           <AuthProvider>
//             <Stack screenOptions={{ headerShown: false }}>
//               <Stack.Screen name="(public)" />
//               <Stack.Screen name="(private)" />
//             </Stack>
//             <StatusBar style="auto" />
//           </AuthProvider>
//         </NavigationThemeProvider>
//       </ThemeProvider>
//     </View>
//   );
// }
