import { useTheme } from "@/constants/Colors";
import { Platform, StyleSheet } from "react-native";
import responsive from "../../../utils/responsive";

const useStyle = () => {
  const colors = useTheme();
  return StyleSheet.create({
    sectionContainer: {
      paddingHorizontal: responsive.scale(10),
      paddingVertical: responsive.scale(20),
      alignItems: Platform.OS === "web" ? "center" : "stretch",
    },
    contactButton: {
      backgroundColor: colors.primary,
      borderRadius: responsive.scale(12),
      marginBottom: responsive.scale(16),
      alignSelf: Platform.OS === "web" ? "center" : "stretch",
      maxWidth: Platform.OS === "web" ? responsive.scale(300) : "100%",
    },
    title: {
      fontSize:
        Platform.OS === "web" ? responsive.scale(20) : responsive.scale(24),
      color: colors.text,
      marginBottom: responsive.scale(8),
      textAlign: Platform.OS === "web" ? "center" : "left",
      fontFamily: "Poppins-SemiBold",
    },
    // Web-specific styles
    webContainer: {
      backgroundColor: colors.lightyellow,
      paddingVertical: responsive.scale(80),
      paddingHorizontal: responsive.scale(40),
      borderRadius: responsive.scale(16),
      alignItems: "center",
    },
    webContent: {
      alignItems: "center",
      maxWidth: 700,
    },
    webTitle: {
      fontSize: responsive.scale(28),
      color: colors.text,
      marginBottom: responsive.scale(16),
      textAlign: "center",
      fontFamily: "Poppins-Bold",
    },
    webSubtitle: {
      fontSize: responsive.scale(16),
      color: colors.gray,
      marginBottom: responsive.scale(32),
      textAlign: "center",
      fontFamily: "Poppins-Regular",
      lineHeight: responsive.scale(24),
    },
    webButtonContainer: {
      flexDirection: "row",
      gap: responsive.scale(20),
      justifyContent: "center",
      flexWrap: "wrap",
    },
    webContactButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: responsive.scale(32),
      paddingVertical: responsive.scale(14),
      borderRadius: responsive.scale(25),
      minWidth: responsive.scale(160),
      elevation: 3,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    webSecondaryButton: {
      backgroundColor: "transparent",
      paddingHorizontal: responsive.scale(32),
      paddingVertical: responsive.scale(14),
      borderRadius: responsive.scale(25),
      minWidth: responsive.scale(160),
      borderWidth: 2,
      borderColor: colors.primary,
    },
    webButtonText: {
      color: colors.white,
      fontSize: responsive.scale(16),
      fontFamily: "Poppins-SemiBold",
      textAlign: "center",
    },
    webSecondaryButtonText: {
      color: colors.primary,
      fontSize: responsive.scale(16),
      fontFamily: "Poppins-SemiBold",
      textAlign: "center",
    },
  });
};

export default useStyle;
