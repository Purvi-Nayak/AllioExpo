// // import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
// import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
// import { useTheme } from "@/constants/Colors";

// import { Tabs } from "expo-router";
// import { Platform } from "react-native";

// export default function TabLayout() {
//   const theme = useTheme();
//   const TabBarIcon = ({
//     name,
//     color,
//   }: {
//     name: IconSymbolName;
//     color: string;
//   }) => {
//     return <IconSymbol size={28} name={name} color={color} />;
//   };

//   const TABS: { route: string; title: string; icon: IconSymbolName }[] = [
//     { route: "(tabs)/home/index", title: "Home", icon: "house.fill" },
//     { route: "(tabs)/scanner", title: "Scanner", icon: "qrcode" },
//     { route: "(tabs)/media", title: "Media", icon: "photo.fill" },
//     { route: "(tabs)/chat", title: "Chat", icon: "message.fill" },
//     {
//       route: "(tabs)/settings/index",
//       title: "Settings",
//       icon: "gearshape.fill",
//     },
//   ];

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: theme.black,
//         tabBarInactiveTintColor: theme.gray,
//         tabBarStyle: {
//           backgroundColor: theme.primary, // set primary color background
//           position: Platform.OS === "ios" ? "absolute" : "relative",
//         },
//       }}
//     >
//       {TABS.map(({ route, title, icon }) => (
//         <Tabs.Screen
//           key={route}
//           name={route}
//           options={{
//             title,
//             tabBarIcon: ({ color }) => <TabBarIcon name={icon} color={color} />,
//           }}
//         />
//       ))}

//       <Tabs.Screen name="(tabs)/settings/styles" options={{ href: null }} />
//     </Tabs>
//   );
// }
import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { useTheme } from "@/constants/Colors";
import { RootState } from "@/redux/store";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { useSelector } from "react-redux";

export default function PrivateLayout() {
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const theme = useTheme();

  const TabBarIcon = ({
    name,
    color,
  }: {
    name: IconSymbolName;
    color: string;
  }) => {
    return <IconSymbol size={28} name={name} color={color} />;
  };

  const TABS: { route: string; title: string; icon: IconSymbolName }[] = [
    { route: "(tabs)/home/index", title: "Home", icon: "house.fill" },
    { route: "(tabs)/scanner", title: "Scanner", icon: "qrcode" },
    { route: "(tabs)/media", title: "Media", icon: "photo.fill" },
    { route: "(tabs)/chat", title: "Chat", icon: "message.fill" },
    {
      route: "(tabs)/settings/index",
      title: "Settings",
      icon: "gearshape.fill",
    },
  ];

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated || !token) {
      router.replace("/(public)/login");
    }
  }, [isAuthenticated, token, router]);

  // Show loading while checking auth state
  if (!isAuthenticated || !token) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.black,
        tabBarInactiveTintColor: theme.gray,
        tabBarStyle: {
          backgroundColor: theme.primary,
          position: Platform.OS === "ios" ? "absolute" : "relative",
        },
      }}
    >
      {TABS.map(({ route, title, icon }) => (
        <Tabs.Screen
          key={route}
          name={route}
          options={{
            title,
            tabBarIcon: ({ color }) => <TabBarIcon name={icon} color={color} />,
          }}
        />
      ))}

      <Tabs.Screen name="(tabs)/settings/styles" options={{ href: null }} />
    </Tabs>
  );
}
