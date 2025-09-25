import { useTheme } from "@/constants/Colors";
import responsive from "@utils/responsive";
import { StyleSheet } from "react-native";
import { FONTS } from "../../../assets";

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    button: {
      borderRadius: responsive.moderateScale(10),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      minHeight: responsive.verticalScale(45),
      paddingHorizontal: responsive.moderateScale(16),
    },

    // Size variants
    smallButton: {
      minHeight: responsive.verticalScale(36),
      paddingHorizontal: responsive.moderateScale(12),
      paddingVertical: responsive.verticalScale(8),
    },

    mediumButton: {
      minHeight: responsive.verticalScale(45),
      paddingHorizontal: responsive.moderateScale(16),
      paddingVertical: responsive.verticalScale(12),
    },

    largeButton: {
      minHeight: responsive.verticalScale(54),
      paddingHorizontal: responsive.moderateScale(20),
      paddingVertical: responsive.verticalScale(16),
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
      fontSize: responsive.moderateScale(12),
    },

    mediumText: {
      fontSize: responsive.moderateScale(14),
    },

    largeText: {
      fontSize: responsive.moderateScale(16),
    },

    icon: {
      alignItems: "center",
      justifyContent: "center",
    },

    prefixIcon: {
      marginRight: responsive.moderateScale(8),
    },

    postfixIcon: {
      marginLeft: responsive.moderateScale(8),
    },

    disabled: {
      opacity: 0.5,
    },

    loading: {
      opacity: 0.7,
    },
  });
};

export default useStyle;
