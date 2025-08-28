// components/ui/Button/style.ts
import { useTheme } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { FONTS } from "../../../assets";

const { width } = Dimensions.get("window");

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    button: {
      borderRadius: scale(10),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      minHeight: scale(45),
      paddingHorizontal: scale(16),
    },

    // Size variants
    smallButton: {
      minHeight: scale(36),
      paddingHorizontal: scale(12),
      paddingVertical: scale(8),
    },

    mediumButton: {
      minHeight: scale(45),
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
    },

    largeButton: {
      minHeight: scale(54),
      paddingHorizontal: scale(20),
      paddingVertical: scale(16),
    },

    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    text: {
      fontFamily: FONTS.semibold || FONTS.medium || FONTS.regular,
      textAlign: "center",
    },

    // Text size variants
    smallText: {
      fontSize: scale(12),
    },

    mediumText: {
      fontSize: scale(14),
    },

    largeText: {
      fontSize: scale(16),
    },

    icon: {
      alignItems: "center",
      justifyContent: "center",
    },

    prefixIcon: {
      marginRight: scale(8),
    },

    postfixIcon: {
      marginLeft: scale(8),
    },

    disabled: {
      opacity: 0.5,
    },

    // Loading state
    loading: {
      opacity: 0.7,
    },
  });
};

export default useStyle;
