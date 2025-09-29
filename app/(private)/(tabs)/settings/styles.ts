import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { FONTS } from "../../../../assets";

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 18,
      color: colors.error,
      fontFamily: FONTS.light,
    },
  });
};

export default useStyle;
