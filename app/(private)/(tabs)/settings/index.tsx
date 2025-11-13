import { clearAuth, clearAuthData } from "@/redux/slices/AuthSlice";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useStyle from "./styles";

function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const styles = useStyle();

  // Read user data from Redux and fallback to localStorage on web
  const data = useSelector((state: any) => state?.userData);
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        const stored = localStorage.getItem("userData");
        if (stored) {
          setLocalUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn("Failed to read userData from localStorage", err);
      }
    }
  }, []);

  const userEmail = data?.data?.email || localUser?.email || data?.email;

  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear both Redux state and secure storage
            await clearAuthData();
            dispatch(clearAuth());
            router.replace("/(public)/login");
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  }, [dispatch, router]);

  const goToProfile = useCallback(() => {
    // Always pass the user's email as a param when navigating to profile
    if (!userEmail) {
      console.warn("No user email available to navigate to profile");
      // Still navigate but with an empty email param to keep route shape consistent
      router.push({
        pathname: "/(private)/profile",
        params: { userEmail: "" },
      });
      return;
    }

    router.push({
      pathname: "/(private)/profile",
      params: { userEmail: userEmail },
    });
  }, [router, userEmail]);

  const goToAi = () => {
    router.push("/(private)/aiAssistant");
  };

  const DATA = [
    { id: "profile", title: "Profile", action: goToProfile },
    { id: "logout", title: "Logout", action: handleLogout },
    { id: "ai", title: "AI Assistance", action: goToAi },
  ];

  const renderItem = ({ item }: { item: (typeof DATA)[number] }) => (
    <TouchableOpacity onPress={item.action} style={localStyles.item}>
      <Text style={localStyles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <FlatList
        data={DATA}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={localStyles.separator} />}
        contentContainerStyle={{
          flex: 1,
          padding: 12,
        }}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: "#000",
  },
  separator: {
    height: 12,
  },
});

export default SettingsScreen;
