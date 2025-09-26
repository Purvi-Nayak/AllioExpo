import responsive from "@/utils/responsive";
import { StyleSheet, ViewStyle } from "react-native";

const useStyle = () => {
  const webCenterStyle: ViewStyle = responsive.isWeb
    ? {
        maxWidth:
          typeof responsive.layout.formMaxWidth === "string"
            ? undefined
            : responsive.layout.formMaxWidth,
        alignSelf: "center",
        width: "100%",
      }
    : {};

  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: responsive.isWeb
        ? responsive.isDesktop
          ? responsive.spacing.xl()
          : responsive.spacing.lg()
        : responsive.spacing.md(),
      paddingBottom: responsive.isWeb
        ? responsive.spacing.sm()
        : responsive.spacing.lg(),
      ...webCenterStyle,
    },
  });
};

export default useStyle;
