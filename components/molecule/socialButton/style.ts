import { useTheme } from "@/constants/Colors";
import responsive from "@utils/responsive";
import { StyleSheet } from "react-native";

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    button: {
      marginHorizontal: responsive.moderateScale(8),
      borderRadius: responsive.moderateScale(20),
      padding: responsive.moderateScale(6),
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
      width: responsive.moderateScale(32),
      height: responsive.moderateScale(32),
      resizeMode: "contain",
    },
  });
};

export default useStyle;
