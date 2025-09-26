import responsive from "@/utils/responsive";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  maxWidth?: number;
  padding?: number;
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  maxWidth = 1200,
  padding = 20,
}) => {
  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      width: "100%",
      alignSelf: "center",
      ...(Platform.OS === "web"
        ? {
            maxWidth:
              responsive.width(90) > maxWidth ? maxWidth : responsive.width(90),
            paddingHorizontal: responsive.scale(padding),
          }
        : {
            paddingHorizontal: responsive.scale(16),
          }),
    },
  });

  return <View style={styles.wrapper}>{children}</View>;
};

export default ResponsiveWrapper;
