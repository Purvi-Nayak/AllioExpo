import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { useTheme } from "@/constants/Colors";
import responsive from "@/utils/responsive";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

// Import web drawer layout
import DrawerLayout from "./_layout.web";

export default function TabsLayout() {
  const theme = useTheme();

  // For web, use drawer navigation instead of tabs
  if (Platform.OS === "web") {
    return <DrawerLayout />;
  }

  const TabBarIcon = ({
    name,
    color,
  }: {
    name: IconSymbolName;
    color: string;
  }) => {
    return <IconSymbol size={responsive.scale(28)} name={name} color={color} />;
  };

  const TABS: { route: string; title: string; icon: IconSymbolName }[] = [
    { route: "home/index", title: "Home", icon: "house.fill" },
    { route: "scanner", title: "Scanner", icon: "qrcode" },
    { route: "media", title: "Media", icon: "photo.fill" },
    { route: "chat", title: "Chat", icon: "message.fill" },
    { route: "settings/index", title: "Settings", icon: "gearshape.fill" },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.black,
        tabBarInactiveTintColor: theme.gray,
        tabBarStyle: {
          backgroundColor: theme.primary,
          position: Platform.OS === "ios" ? "absolute" : "relative",
          height: responsive.scale(60),
        },
        tabBarLabelStyle: {
          fontSize: responsive.scale(12),
          fontFamily: "Poppins-Medium",
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

      <Tabs.Screen name="settings/styles" options={{ href: null }} />
    </Tabs>
  );
}
