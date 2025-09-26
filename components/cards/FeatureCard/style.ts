import { useTheme } from "@/constants/Colors";
import { height, width } from "@utils/helper";
import { Platform, StyleSheet } from "react-native";
import responsive from "../../../utils/responsive";

const useStyle = () => {
  const colors = useTheme();
  return StyleSheet.create({
    card: {
      justifyContent: "center",
      backgroundColor: colors.white,
      borderRadius: responsive.scale(20),
      padding:
        Platform.OS === "web" ? responsive.scale(24) : responsive.scale(16),
      alignItems: "center",
      marginHorizontal:
        Platform.OS === "web" ? responsive.scale(8) : responsive.scale(40),
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: Platform.OS === "web" ? 8 : 2,
      },
      shadowOpacity: Platform.OS === "web" ? 0.15 : 0.25,
      shadowRadius: Platform.OS === "web" ? 16 : 3.84,
      elevation: Platform.OS === "web" ? 8 : 2,
      width: Platform.OS === "web" ? "100%" : width * 0.7,
      minHeight: Platform.OS === "web" ? responsive.scale(320) : "auto",
      borderWidth: Platform.OS === "web" ? 1 : 0,
      borderColor: Platform.OS === "web" ? colors.lightGray : "transparent",
    },
    image: {
      width: Platform.OS === "web" ? responsive.scale(100) : width * 0.5,
      height: Platform.OS === "web" ? responsive.scale(100) : height * 0.15,
      marginBottom: responsive.scale(16),
      resizeMode: "contain",
    },
    title: {
      fontSize:
        Platform.OS === "web" ? responsive.scale(18) : responsive.scale(18),
      fontWeight: "bold",
      fontFamily: "Poppins-Bold",
      color: colors.text,
      marginBottom: responsive.scale(8),
      textAlign: "center",
    },
    description: {
      fontSize:
        Platform.OS === "web" ? responsive.scale(14) : responsive.scale(14),
      color: colors.gray,
      marginBottom: responsive.scale(20),
      textAlign: "center",
      fontFamily: "Poppins-Regular",
      lineHeight:
        Platform.OS === "web" ? responsive.scale(20) : responsive.scale(18),
      flex: Platform.OS === "web" ? 1 : 0,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: responsive.scale(25),
      paddingVertical: responsive.scale(12),
      paddingHorizontal: responsive.scale(28),
      minWidth: Platform.OS === "web" ? responsive.scale(120) : "auto",
      elevation: Platform.OS === "web" ? 2 : 0,
      shadowColor: Platform.OS === "web" ? colors.primary : "transparent",
      shadowOffset:
        Platform.OS === "web"
          ? { width: 0, height: 2 }
          : { width: 0, height: 0 },
      shadowOpacity: Platform.OS === "web" ? 0.3 : 0,
      shadowRadius: Platform.OS === "web" ? 4 : 0,
    },
    buttonText: {
      color: colors.white,
      fontSize:
        Platform.OS === "web" ? responsive.scale(14) : responsive.scale(16),
      textAlign: "center",
      fontFamily: "Poppins-SemiBold",
    },
  });
};

export default useStyle;
