import { clearAuth, clearAuthData } from "@/redux/slices/AuthSlice";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import useStyle from "./styles";

function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const styles = useStyle();

  const handleLogout = () => {
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setting</Text>

      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
export default SettingsScreen;
