import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { useTheme } from "@/constants/Colors";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
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
