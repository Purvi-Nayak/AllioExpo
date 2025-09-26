import { useTheme } from "@/constants/Colors";
import responsive from "@/utils/responsive";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface WebLayoutProps {
  children: React.ReactNode;
}

const WebLayout: React.FC<WebLayoutProps> = ({ children }) => {
  const theme = useTheme();

  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      marginLeft: responsive.width(20), // Account for drawer width
      maxWidth: "calc(100vw - 250px)", // Subtract drawer width
      backgroundColor: theme.background,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default WebLayout;
