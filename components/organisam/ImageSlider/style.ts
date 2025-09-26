import { useTheme } from "@react-navigation/native";
import { Platform, StyleSheet } from "react-native";
import { height, width } from "../../../utils/helper";
import responsive from "../../../utils/responsive";

const IMAGE_WIDTH =
  Platform.OS === "web" ? Math.min(responsive.width(60), 400) : width * 0.7;
const IMAGE_MARGIN = responsive.scale(10);

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: responsive.scale(20),
      paddingHorizontal: responsive.scale(10),
      backgroundColor: colors.background,
      height:
        Platform.OS === "web"
          ? Math.min(responsive.height(25), 300)
          : height * 0.22,
      width: "100%",
      marginVertical: responsive.scale(15),
    },
    contentContainer: {
      paddingHorizontal:
        Platform.OS === "web"
          ? responsive.scale(20)
          : (width - IMAGE_WIDTH) / 3 - IMAGE_MARGIN * 0.5,
    },
    image: {
      width: IMAGE_WIDTH,
      height:
        Platform.OS === "web"
          ? Math.min(responsive.height(20), 250)
          : height * 0.2,
      borderRadius: responsive.scale(16),
      marginHorizontal: IMAGE_MARGIN,
    },
    arrowLeft: {
      position: "absolute",
      left: responsive.scale(8),
      zIndex: 2,
      padding: responsive.scale(8),
      justifyContent: "center",
      alignItems: "center",
    },
    arrowRight: {
      position: "absolute",
      right: responsive.scale(8),
      zIndex: 2,
      padding: responsive.scale(8),
      justifyContent: "center",
      alignItems: "center",
    },
    arrowIcon: {
      width: responsive.scale(20),
      height: responsive.scale(20),
      tintColor: colors.black,
    },
    // Web-specific styles
    webContainer: {
      backgroundColor: colors.background,
      paddingVertical: responsive.scale(60),
      paddingHorizontal: responsive.scale(20),
      width: "100%",
    },
    webHeader: {
      alignItems: "center",
      marginBottom: responsive.scale(40),
    },
    webTitle: {
      fontSize: responsive.scale(28),
      fontFamily: "Poppins-Bold",
      color: colors.text,
      textAlign: "center",
      marginBottom: responsive.scale(12),
    },
    webSubtitle: {
      fontSize: responsive.scale(16),
      fontFamily: "Poppins-Regular",
      color: colors.gray,
      textAlign: "center",
      maxWidth: 600,
      lineHeight: responsive.scale(24),
    },
    webSliderContainer: {
      position: "relative",
    },
    webContentContainer: {
      paddingHorizontal: responsive.scale(40),
      alignItems: "center",
    },
    webImageContainer: {
      marginHorizontal: IMAGE_MARGIN,
      borderRadius: responsive.scale(20),
      overflow: "hidden",
      elevation: 3,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      transform: [{ scale: 0.9 }],
    },
    webActiveImage: {
      transform: [{ scale: 1 }],
      elevation: 8,
      shadowOpacity: 0.25,
      shadowRadius: 16,
    },
    webImage: {
      width: IMAGE_WIDTH,
      height: Math.min(responsive.height(35), 350),
      borderRadius: responsive.scale(20),
    },
    webPagination: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: responsive.scale(30),
    },
    webPaginationDot: {
      width: responsive.scale(8),
      height: responsive.scale(8),
      borderRadius: responsive.scale(4),
      backgroundColor: colors.lightGray,
      marginHorizontal: responsive.scale(4),
    },
    webPaginationDotActive: {
      backgroundColor: colors.primary,
      width: responsive.scale(24),
      borderRadius: responsive.scale(12),
    },
  });
};
export default useStyle;
