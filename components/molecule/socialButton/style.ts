import { useTheme } from "@/constants/Colors";
import responsive from "@utils/responsive";
import { StyleSheet } from "react-native";

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    button: {
      marginHorizontal: responsive.isMobile
        ? responsive.spacing.xs()
        : responsive.spacing.sm(),
      // Make buttons perfectly round
      width: responsive.isMobile ? 60 : 70,
      height: responsive.isMobile ? 60 : 70,
      borderRadius: responsive.isMobile ? 30 : 35, // Half of width/height for perfect circle
      padding: 0, // Remove padding since we're using fixed dimensions
      backgroundColor: colors.white,
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: responsive.verticalScale(1) },
      shadowOpacity: 0.1,
      shadowRadius: responsive.moderateScale(2),
    },
    pressed: {
      backgroundColor: colors.hoverColor,
      opacity: 0.8,
    },
    icon: {
      width: responsive.isMobile
        ? responsive.moderateScale(28)
        : responsive.moderateScale(32),
      height: responsive.isMobile
        ? responsive.moderateScale(28)
        : responsive.moderateScale(32),
      resizeMode: "contain",
    },
  });
};

export default useStyle;
