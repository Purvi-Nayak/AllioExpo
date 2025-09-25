// import { useTheme } from "@/constants/Colors";
// import responsive from "@utils/responsive";
// import { StyleSheet } from "react-native";

// const useStyle = () => {
//   const colors = useTheme();
//   return StyleSheet.create({
//     logoContainer: {
//       alignItems: "center",
//     },
//     formContainer: {
//       justifyContent: "center",
//       paddingVertical: responsive.height(10),
//       ...responsive.containerStyle(500), // ✅ max 500px wide on web
//     },
//     title: {
//       fontSize: responsive.moderateScale(28), // smaller on web
//       color: colors.primary,
//     },
//     subtitle: {
//       fontSize: responsive.moderateScale(14),
//       color: colors.text,
//       textAlign: "left",
//       marginBottom: responsive.moderateScale(20),
//     },
//     loginButton: {
//       marginVertical: responsive.moderateScale(6),
//       backgroundColor: colors.primary,
//       paddingVertical: responsive.moderateScale(12),
//       borderRadius: responsive.moderateScale(8),
//     },
//     logo: {
//       width: responsive.width(50), // ~50% screen width
//       height: responsive.width(50),
//       resizeMode: "contain",
//     },
//     dividerContainer: {
//       flexDirection: "row",
//       justifyContent: "center",
//       alignItems: "center",
//       gap: responsive.moderateScale(3),
//     },
//     socialSignInText: {
//       fontSize: responsive.moderateScale(16),
//       color: colors.primary,
//       textAlign: "center",
//       marginVertical: responsive.moderateScale(10),
//     },
//     emailInput: {
//       marginBottom: responsive.moderateScale(12),
//       borderRadius: responsive.moderateScale(8),
//       paddingHorizontal: responsive.moderateScale(12),
//     },
//     inputContainer: {
//       marginBottom: responsive.moderateScale(10),
//       gap: responsive.moderateScale(10),
//     },
//     button: {
//       marginVertical: responsive.moderateScale(6),
//     },

//     socialButtonsWrapper: {
//       marginTop: responsive.moderateScale(12),
//     },
//     iconStyle: {
//       width: responsive.moderateScale(18),
//       height: responsive.moderateScale(18),
//       resizeMode: "contain",
//     },
//     dividerText: {
//       color: colors.primary,
//       fontSize: responsive.moderateScale(16),
//       justifyContent: "center",
//       textAlign: "center",
//     },
//     orText: {
//       color: colors.text,
//       fontSize: responsive.moderateScale(16),
//     },
//     signUpText: {
//       color: colors.primary,
//       fontSize: responsive.moderateScale(16),
//     },
//     container: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginTop: responsive.moderateScale(20),
//       paddingHorizontal: responsive.moderateScale(40),
//     },
//     icon: {
//       width: responsive.moderateScale(32),
//       height: responsive.moderateScale(32),
//       resizeMode: "contain",
//     },
//     SocialButtonStyle: {
//       flexDirection: "row",
//       justifyContent: "center",
//       marginVertical: responsive.moderateScale(12),
//     },
//     loginText: {
//       paddingVertical: responsive.moderateScale(20),
//       fontSize: responsive.moderateScale(18),
//       textAlign: "center",
//       color: colors.gray,
//     },
//     loginLink: {
//       fontSize: responsive.moderateScale(18),
//       color: colors.primary,
//       textAlign: "center",
//     },
//     line: {
//       flex: 1,
//       height: 1,
//       backgroundColor: colors.text,
//     },
//   });
// };

// export default useStyle;

import { useTheme } from "@/constants/Colors";
import responsive from "@utils/responsive";
import { StyleSheet } from "react-native";

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      ...responsive.containerStyle(500),
    },

    logoContainer: {
      alignItems: "center",
      marginTop: responsive.verticalScale(20),
    },

    logo: {
      width: responsive.width(40),
      height: responsive.width(40),
      resizeMode: "contain",
    },

    formContainer: {
      justifyContent: "center",
      paddingVertical: responsive.height(5),
      ...responsive.containerStyle(500),
    },

    title: {
      fontSize: responsive.moderateScale(28),
      color: colors.primary,
      marginBottom: responsive.verticalScale(10),
    },

    subtitle: {
      fontSize: responsive.moderateScale(14),
      color: colors.text,
      marginBottom: responsive.verticalScale(20),
    },

    emailInput: {
      marginBottom: responsive.verticalScale(12),
      borderRadius: responsive.moderateScale(8),
      paddingHorizontal: responsive.moderateScale(12),
      height: responsive.verticalScale(45),
      borderWidth: 1,
      borderColor: colors.border,
    },

    inputContainer: {
      marginBottom: responsive.verticalScale(10),
      gap: responsive.verticalScale(10),
    },

    loginButton: {
      marginVertical: responsive.verticalScale(6),
      backgroundColor: colors.primary,
      paddingVertical: responsive.verticalScale(12),
      borderRadius: responsive.moderateScale(8),
      alignItems: "center",
    },

    loginText: {
      fontSize: responsive.moderateScale(18),
      color: colors.gray,
      textAlign: "center",
      paddingVertical: responsive.verticalScale(12),
    },

    loginLink: {
      fontSize: responsive.moderateScale(18),
      color: colors.primary,
      textAlign: "center",
    },

    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: responsive.moderateScale(3),
      marginVertical: responsive.verticalScale(10),
    },

    dividerText: {
      fontSize: responsive.moderateScale(16),
      color: colors.primary,
      textAlign: "center",
    },

    orText: {
      fontSize: responsive.moderateScale(15),
      color: colors.text,
      textAlign: "center",
    },

    socialSignInText: {
      fontSize: responsive.moderateScale(16),
      color: colors.primary,
      textAlign: "center",
      marginVertical: responsive.verticalScale(10),
    },

    socialButtonsWrapper: {
      marginTop: responsive.verticalScale(12),
    },

    SocialButtonStyle: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: responsive.verticalScale(12),
      alignItems: "center",
    },

    iconStyle: {
      width: responsive.moderateScale(18),
      height: responsive.moderateScale(18),
      resizeMode: "contain",
    },

    icon: {
      width: responsive.moderateScale(32),
      height: responsive.moderateScale(32),
      resizeMode: "contain",
    },

    containerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: responsive.verticalScale(20),
      paddingHorizontal: responsive.width(10),
    },

    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.text,
    },
  });
};

export default useStyle;
