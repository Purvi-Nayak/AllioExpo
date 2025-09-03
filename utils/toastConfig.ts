// import { useTheme } from "@/constants/Colors";
// import { FONTS } from "@assets/index";
// import { scale } from "react-native-size-matters";
// import Toast from "react-native-toast-message";

// export const showSuccess = (message: string): void => {
//   const colors = useTheme();
//   Toast.show({
//     type: "success",
//     text1: "Success",
//     text2: message,
//     position: "bottom",
//     visibilityTime: 5000,
//     autoHide: true,
//     text1Style: {
//       fontSize: scale(16),
//       color: colors.green,
//       fontFamily: FONTS.bold,
//     },
//     text2Style: {
//       fontSize: scale(14),
//       color: colors.black,
//       fontFamily: FONTS.regular,
//     },
//   });
// };

// export const showError = (message: string): void => {
//   Toast.show({
//     type: "error",
//     text1: "Error",
//     text2: message,
//     position: "bottom",
//     visibilityTime: 5000,
//     autoHide: true,
//     text1Style: {
//       fontSize: scale(16),
//       color: colors.error,
//       fontFamily: FONTS.light,
//     },
//     text2Style: {
//       fontSize: scale(14),
//       color: colors.black,
//       fontFamily: FONTS.regular,
//     },
//   });
// };

// export const showInfo = (message: string): void => {
//   Toast.show({
//     type: "info",
//     text1: "Info",
//     text2: message,
//     position: "bottom",
//     visibilityTime: 5000,
//     autoHide: true,
//     text1Style: {
//       fontSize: scale(16),
//       color: colors.lightBlue,
//       fontFamily: FONTS.semiBold,
//     },
//     text2Style: {
//       fontSize: scale(14),
//       color: colors.black,
//       fontFamily: FONTS.regular,
//     },
//   });
// };

// export const showWarning = (message: string): void => {
//   Toast.show({
//     type: "info",
//     text1: "Warning",
//     text2: message,
//     position: "bottom",
//     visibilityTime: 5000,
//     autoHide: true,
//     text1Style: {
//       fontSize: scale(16),
//       color: colors.lightyellow,
//       fontFamily: FONTS.light,
//     },
//     text2Style: {
//       fontSize: scale(14),
//       color: colors.black,
//       fontFamily: FONTS.regular,
//     },
//   });
// };
import { colors } from "@/constants/Colors"; // ✅ Import static colors instead of useTheme hook
import { FONTS } from "@assets/index";
import { scale } from "react-native-size-matters";
import Toast from "react-native-toast-message";

export const showSuccess = (message: string): void => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    position: "bottom",
    visibilityTime: 5000,
    autoHide: true,
    text1Style: {
      fontSize: scale(16),
      color: colors.green, // ✅ Use static colors
      fontFamily: FONTS.bold,
    },
    text2Style: {
      fontSize: scale(14),
      color: colors.black,
      fontFamily: FONTS.regular,
    },
  });
};

export const showError = (message: string): void => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "bottom",
    visibilityTime: 5000,
    autoHide: true,
    text1Style: {
      fontSize: scale(16),
      color: colors.error, // ✅ Use static colors
      fontFamily: FONTS.light,
    },
    text2Style: {
      fontSize: scale(14),
      color: colors.black,
      fontFamily: FONTS.regular,
    },
  });
};

export const showInfo = (message: string): void => {
  Toast.show({
    type: "info",
    text1: "Info",
    text2: message,
    position: "bottom",
    visibilityTime: 5000,
    autoHide: true,
    text1Style: {
      fontSize: scale(16),
      color: colors.secondary, // ✅ Changed from lightBlue to secondary (better color)
      fontFamily: FONTS.light,
    },
    text2Style: {
      fontSize: scale(14),
      color: colors.black,
      fontFamily: FONTS.regular,
    },
  });
};

export const showWarning = (message: string): void => {
  Toast.show({
    type: "warning", // ✅ Changed from "info" to "warning"
    text1: "Warning",
    text2: message,
    position: "bottom",
    visibilityTime: 5000,
    autoHide: true,
    text1Style: {
      fontSize: scale(16),
      color: colors.primary, // ✅ Changed from lightyellow to primary (more visible)
      fontFamily: FONTS.light,
    },
    text2Style: {
      fontSize: scale(14),
      color: colors.black,
      fontFamily: FONTS.regular,
    },
  });
};

// ✅ Optional: Add a custom AllioExpo branded toast
export const showAllioSuccess = (message: string): void => {
  Toast.show({
    type: "success",
    text1: "AllioExpo",
    text2: message,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    text1Style: {
      fontSize: scale(18),
      color: colors.primary,
      fontFamily: FONTS.bold,
    },
    text2Style: {
      fontSize: scale(14),
      color: colors.darkGray,
      fontFamily: FONTS.regular,
    },
  });
};
