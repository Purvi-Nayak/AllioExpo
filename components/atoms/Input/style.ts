import { useTheme } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { FONTS } from "../../../assets";

const useStyle = () => {
  const colors = useTheme(); // Your custom hook returns the theme directly
  return StyleSheet.create({
    wrapper: {
      marginBottom: scale(16),
    },
    label: {
      fontSize: scale(14),
      color: colors.text,
      marginBottom: scale(4),
      fontFamily: FONTS.medium,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.gray,
      borderRadius: scale(10),
      backgroundColor: colors.background,
      minHeight: scale(45),
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
      fontSize: scale(14),
      fontFamily: FONTS.regular,
      color: colors.text,
      paddingHorizontal: scale(12),
      paddingVertical: scale(12),
    },
    textInputMultiline: {
      paddingTop: scale(12),
      textAlignVertical: "top",
    },
    passwordToggle: {
      padding: scale(12),
    },
    icon: {
      width: scale(20),
      height: scale(20),
      tintColor: colors.gray,
    },
    errorText: {
      fontSize: scale(12),
      color: colors.error,
      marginTop: scale(4),
      fontFamily: FONTS.regular,
    },
    counterText: {
      fontSize: scale(12),
      color: colors.gray,
      textAlign: "right",
      marginTop: scale(4),
      fontFamily: FONTS.regular,
    },
  });
};

export default useStyle;
