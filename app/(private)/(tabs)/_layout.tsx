import { IconSymbol, type IconSymbolName } from "@/components/ui/IconSymbol";
import { useTheme } from "@/constants/Colors";

import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
            <TabBarIcon name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color }) => (
            <TabBarIcon  name="qrcode" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: "Media",
          tabBarIcon: ({ color }) => (
            <TabBarIcon  name="photo.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <TabBarIcon  name="message.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <TabBarIcon  name="gearshape.fill" color={color} />
          ),
        }}
      />
      {/* Hide non-route util files from tabs, if any */}
      <Tabs.Screen name="settings/styles" options={{ href: null }} />
    </Tabs>
  );
}
