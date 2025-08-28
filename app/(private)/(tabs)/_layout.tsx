// import { Tabs } from "expo-router";
// import React from "react";
// import { Platform } from "react-native";

// import { HapticTab } from "@/components/HapticTab";
// import { IconSymbol } from "@/components/ui/IconSymbol";
// import TabBarBackground from "@/components/ui/TabBarBackground";
// import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme";

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: Platform.select({
//           ios: {
//             // Use a transparent background on iOS to show the blur effect
//             position: "absolute",
//           },
//           default: {},
//         }),
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="house.fill" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="scanner"
//         options={{
//           title: "Scanner",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="qrcode" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="media"
//         options={{
//           title: "Media",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="photo.fill" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: "Chat",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="message.fill" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="setting"
//         options={{
//           title: "setting",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="gearshape.fill" color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/constants/Colors";

import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.black,
        tabBarInactiveTintColor: theme.gray,
        tabBarStyle: {
          backgroundColor: theme.primary, // set primary color background
          position: Platform.OS === "ios" ? "absolute" : "relative",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="qrcode" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: "Media",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="photo.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Setting",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
