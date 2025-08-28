import { FONTS } from "@/assets";
import { useTheme } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flex: 1,
      paddingHorizontal: scale(24),
      justifyContent: "center",
    },

    header: {
      alignItems: "center",
      marginBottom: scale(40),
    },

    title: {
      fontSize: scale(28),
      fontFamily: FONTS.bold || FONTS.semibold || FONTS.medium,
      color: colors.text,
      marginBottom: scale(8),
      textAlign: "center",
    },

    subtitle: {
      fontSize: scale(16),
      fontFamily: FONTS.regular,
      color: colors.gray,
      textAlign: "center",
    },

    form: {
      width: "100%",
    },

    inputIcon: {
      width: scale(20),
      height: scale(20),
      tintColor: colors.gray,
    },

    loginButton: {
      marginTop: scale(24),
      marginBottom: scale(32),
      backgroundColor: colors.primary,
    },

    linkContainer: {
      alignItems: "center",
      gap: scale(16),
    },

    link: {
      alignItems: "center",
      paddingVertical: scale(8),
    },

    linkText: {
      fontSize: scale(16),
      fontFamily: FONTS.medium || FONTS.regular,
      color: colors.primary,
      textAlign: "center",
    },
  });
};

export default useStyle;
