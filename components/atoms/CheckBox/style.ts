import { useTheme } from "@/constants/Colors";
import responsive from "@utils/responsive";
import { StyleSheet } from "react-native";

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: responsive.verticalScale(5),
    },
    circle: {
      width: responsive.moderateScale(18),
      height: responsive.moderateScale(18),
      borderRadius: responsive.moderateScale(4),
      borderWidth: 1,
      borderColor: colors.gray,
      alignItems: "center",
      justifyContent: "center",
      marginRight: responsive.moderateScale(8),
    },
    selectedCircle: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkIcon: {
      width: responsive.moderateScale(12),
      height: responsive.moderateScale(12),
      tintColor: colors.white,
    },
    label: {
      fontSize: responsive.moderateScale(16),
      color: colors.text,
    },
  });
};

export default useStyle;
