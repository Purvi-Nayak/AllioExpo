
import { StyleSheet } from "react-native";

import { useTheme } from "@react-navigation/native";

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 30,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      color: "#666",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 15,
      marginBottom: 15,
      borderRadius: 8,
      fontSize: 16,
    },
    button: {
      backgroundColor: "#007AFF",
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
    },
    buttonText: {
      color: "white",
      textAlign: "center",
      fontSize: 16,
      fontWeight: "600",
    },
    link: {
      textAlign: "center",
      color: "#007AFF",
      marginTop: 10,
      fontSize: 16,
    },
    logoutButton: {
      backgroundColor: "#FF3B30",
      padding: 15,
      borderRadius: 8,
      marginTop: 20,
    },
    logoutButtonText: {
      color: "white",
      textAlign: "center",
      fontSize: 16,
      fontWeight: "600",
    },
  });
};

export default useStyle;
