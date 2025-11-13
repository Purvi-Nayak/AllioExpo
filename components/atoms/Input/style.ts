import { FONTS } from "@/assets";
import { useTheme } from "@/constants/Colors";
import responsive from "@utils/responsive";
import { Platform, StyleSheet } from "react-native";

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    label: {
      fontSize: responsive.moderateScale(14),
      color: colors.text,
      marginBottom: responsive.verticalScale(4),
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.text,
      borderRadius: responsive.moderateScale(10),
      backgroundColor: colors.background,
      paddingHorizontal: responsive.moderateScale(10),
    },
    inputContainerFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    inputContainerError: {
      borderColor: colors.error,
    },
    inputContainerDisabled: {
      backgroundColor: colors.lightgray,
      borderColor: colors.gray,
    },
    textInput: {
      flex: 1,
      fontSize: responsive.moderateScale(14),
      fontFamily: FONTS.regular,
      color: colors.text,
      paddingHorizontal: responsive.moderateScale(12),
      paddingVertical:
        Platform.OS === "ios"
          ? responsive.verticalScale(12)
          : responsive.verticalScale(8),
      ...(responsive.isWeb && {
        outlineWidth: 0,
        outlineColor: "transparent",
        outlineStyle: "none",
      }),
    },
    textInputMultiline: {
      paddingTop: responsive.verticalScale(12),
      textAlignVertical: "top",
      maxHeight: responsive.verticalScale(120), // Limit max height for multiline
    },
    passwordToggle: {
      padding: responsive.moderateScale(12),
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      marginLeft: responsive.moderateScale(4),
      marginTop: responsive.verticalScale(2),
    },
    icon: {
      width: responsive.moderateScale(20),
      height: responsive.moderateScale(20),
      tintColor: colors.primary,
      resizeMode: "contain",
    },
    passwordToggleText: {
      fontSize: responsive.moderateScale(18),
    },
    errorText: {
      fontSize: responsive.moderateScale(12),
      color: colors.error,
    },
    counterText: {
      fontSize: responsive.moderateScale(12),
      color: colors.gray,
      textAlign: "right",
      marginTop: responsive.verticalScale(4),
    },
    placeHolderColor: {
      color: colors.gray,
    },
  });
};

export default useStyle;
