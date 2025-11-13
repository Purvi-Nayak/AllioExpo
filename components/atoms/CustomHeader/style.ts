import { useTheme } from "@/constants/Colors";
import responsive from "@/utils/responsive";
import { height, width } from "@utils/helper";
import { Platform, StatusBar, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";

const useStyle = () => {
  const colors = useTheme();

  // compute top padding to avoid header text being cut by status bar
  const topPadding =
    Platform.OS === "android"
      ? StatusBar.currentHeight ?? responsive.spacing.sm()
      : responsive.isMobile
      ? responsive.spacing.sm()
      : 0;

  // Make header smaller on mobile by decreasing base multiplier
  const baseHeight = responsive.isWeb
    ? 48 // fixed smaller header for web (px)
    : responsive.isMobile
    ? height * 0.055 // reduced from 0.065
    : height * 0.05;

  // Use same padding for top and bottom so spacing is equal
  const headerHeight = baseHeight + topPadding * 2;

  // icon sizes responsive to platform (smaller on mobile)
  // make web back icon a bit smaller and slightly reduce web title size
  const backIconSize = responsive.isWeb ? 14 : scale(14);
  const logoSize = responsive.isWeb
    ? 36
    : responsive.isMobile
    ? scale(30)
    : scale(44);

  return StyleSheet.create({
    headerContainer: {
      position: "relative",
      height: headerHeight,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: topPadding,
      paddingBottom: topPadding,
      flexDirection: "row", // ensure row layout
    },
    leftButton: {
      position: "absolute",
      left: width * 0.04,
      top: responsive.isWeb ? 0 : height * 0.04,
      bottom: 0,
      justifyContent: "center",
      zIndex: 1,
      padding: scale(6),
      backgroundColor: "transparent",
    },
    leftLogo: {
      position: "absolute",
      left: width * 0.04,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      zIndex: 1,
    },
    // centerContainer is absolutely positioned so the title is always perfectly centered
    centerContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: responsive.isMobile ? width * 0.15 : width * 0.12,
    },
    rightButton: {
      position: "absolute",
      right: width * 0.04,
      top: responsive.isWeb ? 0 : height * 0.04,
      bottom: 0,
      justifyContent: "center",
      zIndex: 1,
    },
    backIcon: {
      width: backIconSize,
      height: backIconSize,
      tintColor: colors.black,
    },
    title: {
      fontSize: responsive.isMobile
        ? responsive.typography.bodyLarge()
        : responsive.isWeb
        ? responsive.typography.title() - 4
        : responsive.typography.title(),
      color: colors.black,
      textAlign: "center",
      fontWeight: "bold",
      top: responsive.isWeb ? 0 : height * 0.02,
    },
    logoStyle: {
      width: logoSize,
      height: logoSize,
    },
  });
};

export default useStyle;
