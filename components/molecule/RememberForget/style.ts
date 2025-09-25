import { useTheme } from "@/constants/Colors";
import responsive from "@utils/responsive";
import { StyleSheet } from "react-native";

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    rememberForgotView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: responsive.verticalScale(8),
      paddingHorizontal: responsive.width(2),
    },
    forgotpassText: {
      color: colors.text,
      fontSize: responsive.moderateScale(16),
    },
  });
};

export default useStyle;
