import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { useTheme } from "@/constants/Colors";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";

// Import screens
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import ChatScreen from "./chat";
import HomeScreen from "./home/index";
import MediaScreen from "./media";
import ScannerScreen from "./scanner";
import SettingsScreen from "./settings/index";

const Drawer = createDrawerNavigator();

const DrawerIcon = ({
  name,
  color,
  size = 24,
}: {
  name: IconSymbolName;
  color: string;
  size?: number;
}) => {
  return <IconSymbol size={size} name={name} color={color} />;
};

const DRAWER_ITEMS = [
  { route: "home/index", title: "Home", icon: "house.fill" as IconSymbolName },
  { route: "scanner", title: "Scanner", icon: "qrcode" as IconSymbolName },
  { route: "media", title: "Media", icon: "photo.fill" as IconSymbolName },
  { route: "chat", title: "Chat", icon: "message.fill" as IconSymbolName },
  {
    route: "settings/index",
    title: "Settings",
    icon: "gearshape.fill" as IconSymbolName,
  },
];

function CustomDrawerContent(props: any) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 20,
    },
    drawerHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.gray + "20",
      marginBottom: 10,
    },
    drawerHeaderText: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.black,
      fontFamily: "Poppins-Bold",
    },
  });

  const isActive = (route: string) => {
    const currentRoute = pathname.split("/").pop() || "index";
    const itemRoute = route.split("/").pop() || "index";
    return currentRoute === itemRoute;
  };

  const handleNavigation = (route: string) => {
    if (route.includes("settings")) {
      router.push("/(private)/(tabs)/settings");
    } else if (route.includes("scanner")) {
      router.push("/(private)/(tabs)/scanner");
    } else if (route.includes("media")) {
      router.push("/(private)/(tabs)/media");
    } else if (route.includes("chat")) {
      router.push("/(private)/(tabs)/chat");
    } else {
      router.push("/(private)/(tabs)/home");
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>Allio</Text>
      </View>

      {DRAWER_ITEMS.map((item) => {
        const active = isActive(item.route);
        return (
          <DrawerItem
            key={item.route}
            label={item.title}
            icon={({ color }) => (
              <DrawerIcon
                name={item.icon}
                color={active ? theme.primary : color}
                size={22}
              />
            )}
            onPress={() => handleNavigation(item.route)}
            activeTintColor={theme.primary}
            inactiveTintColor={theme.gray}
            activeBackgroundColor={theme.primary + "15"}
            labelStyle={{
              fontSize: 16,
              fontFamily: active ? "Poppins-SemiBold" : "Poppins-Regular",
              marginLeft: -10,
            }}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const theme = useTheme();

  const drawerScreenOptions = {
    headerShown: false,
    drawerType: "permanent" as const,
    drawerStyle: {
      width: 250,
      backgroundColor: theme.background,
    },
    overlayColor: "transparent",
    drawerActiveTintColor: theme.primary,
    drawerInactiveTintColor: theme.gray,
  };

  return (
    <Drawer.Navigator
      screenOptions={drawerScreenOptions}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="home/index"
    >
      <Drawer.Screen
        name="home/index"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="scanner"
        component={ScannerScreen}
        options={{ title: "Scanner" }}
      />
      <Drawer.Screen
        name="media"
        component={MediaScreen}
        options={{ title: "Media" }}
      />
      <Drawer.Screen
        name="chat"
        component={ChatScreen}
        options={{ title: "Chat" }}
      />
      <Drawer.Screen
        name="settings/index"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Drawer.Navigator>
  );
}
