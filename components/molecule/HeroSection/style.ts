import { useTheme } from "@react-navigation/native";
import { Dimensions, Platform, StyleSheet } from "react-native";
import responsive from "../../../utils/responsive";

const { height: H } = Dimensions.get("window");

export default function useStyle() {
  const { colors } = useTheme();

  return StyleSheet.create({
    bg: {
      width: "100%",
      height:
        Platform.OS === "web" ? Math.min(responsive.height(70), 600) : H * 0.6,
      justifyContent: "center",
      alignItems: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        Platform.OS === "web"
          ? "transparent"
          : colors.mainone || "rgba(0,0,0,0.5)",
      ...(Platform.OS === "web" && {
        // @ts-ignore - web-only CSS properties
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)",
      }),
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal:
        Platform.OS === "web" ? responsive.scale(40) : responsive.scale(24),
      width: "100%",
      maxWidth: Platform.OS === "web" ? 1200 : "100%",
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: responsive.scale(20),
    },
    title: {
      fontSize:
        Platform.OS === "web" ? responsive.scale(32) : responsive.scale(28),
      color: colors.white,
      textAlign: "center",
      fontFamily: "Poppins-Bold",
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    subtitle: {
      fontSize: responsive.scale(18),
      color: colors.white,
      textAlign: "center",
      fontFamily: "Poppins-Medium",
      marginTop: responsive.scale(8),
      opacity: 0.9,
    },
    descriptionContainer: {
      alignItems: "center",
      marginBottom: responsive.scale(40),
    },
    description: {
      fontSize:
        Platform.OS === "web" ? responsive.scale(16) : responsive.scale(20),
      color: colors.white,
      textAlign: "center",
      lineHeight:
        Platform.OS === "web" ? responsive.scale(24) : responsive.scale(22),
      fontFamily: "Poppins-Regular",
      maxWidth: Platform.OS === "web" ? 700 : "100%",
      opacity: 0.95,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "center",
      width: Platform.OS === "web" ? "auto" : "60%",
      gap: responsive.scale(20),
      flexWrap: "wrap",
    },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: responsive.scale(32),
      paddingVertical: responsive.scale(14),
      borderRadius: responsive.scale(25),
      minWidth: responsive.scale(140),
      elevation: 3,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      paddingHorizontal: responsive.scale(32),
      paddingVertical: responsive.scale(14),
      borderRadius: responsive.scale(25),
      minWidth: responsive.scale(140),
      borderWidth: 2,
      borderColor: colors.white,
    },
    buttonText: {
      color: colors.white,
      fontSize: responsive.scale(16),
      fontFamily: "Poppins-SemiBold",
    },
    secondaryButtonText: {
      color: colors.white,
      fontSize: responsive.scale(16),
      fontFamily: "Poppins-SemiBold",
    },
    decorativeElements: {
      position: "absolute",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    },
    floatingCard1: {
      position: "absolute",
      top: "20%",
      right: "10%",
      width: responsive.scale(60),
      height: responsive.scale(60),
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: responsive.scale(12),
      transform: [{ rotate: "15deg" }],
    },
    floatingCard2: {
      position: "absolute",
      bottom: "25%",
      left: "8%",
      width: responsive.scale(40),
      height: responsive.scale(40),
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: responsive.scale(8),
      transform: [{ rotate: "-10deg" }],
    },
    floatingCard3: {
      position: "absolute",
      top: "40%",
      left: "15%",
      width: responsive.scale(30),
      height: responsive.scale(30),
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      borderRadius: responsive.scale(6),
      transform: [{ rotate: "25deg" }],
    },
  });
}
