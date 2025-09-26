import { useTheme } from "@/constants/Colors";
import responsive from "@/utils/responsive";
import { StyleSheet, ViewStyle } from "react-native";

const useStyle = () => {
  const colors = useTheme();

  // Web-specific styles that might not be compatible with React Native types
  const webCenterStyle: ViewStyle = responsive.isWeb
    ? {
        maxWidth:
          typeof responsive.layout.formMaxWidth === "number"
            ? responsive.layout.formMaxWidth
            : undefined,
        alignSelf: "center",
        width: "100%",
      }
    : {};

  const webBackgroundStyle: ViewStyle = responsive.isWeb
    ? {
        backgroundColor: colors.background,
        ...(responsive.isDesktop && {
          minHeight: 600, // Use number instead of vh for React Native compatibility
        }),
      }
    : {};

  return StyleSheet.create({
    contentContainer: {
      justifyContent: "center",
      flex: 1,
      paddingHorizontal: responsive.isWeb
        ? responsive.isDesktop
          ? responsive.spacing.xl()
          : responsive.spacing.lg()
        : responsive.spacing.md(),
      ...webCenterStyle,
    },
    statusBar: {
      backgroundColor: colors.background,
    },
    // Additional responsive utilities for login screen
    loginWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: responsive.spacing.lg(),
      ...(responsive.isWeb &&
        responsive.isDesktop && {
          paddingTop: responsive.spacing.xxl(),
          paddingBottom: responsive.spacing.xxl(),
        }),
    },
    // Background styling for web
    webBackground: webBackgroundStyle,
  });
};

export default useStyle;
