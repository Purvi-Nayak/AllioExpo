import { AuthProvider } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { persistor, store } from "@/redux/store";
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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Configure splash screen
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
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
        <Provider store={store}>
          {" "}
          {/* Redux Provider */}
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              {" "}
              {/* Your Auth Context */}
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen
                  name="(public)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(private)"
                  options={{ headerShown: false }}
                />
              </Stack>
              <StatusBar style="auto" />
            </AuthProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
