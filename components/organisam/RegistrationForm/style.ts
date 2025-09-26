// import { StyleSheet } from 'react-native';

// import { useTheme } from '@/constants/Colors';
// import { height, width } from '@utils/helper';
// import { scale } from 'react-native-size-matters';

// const useStyle = () => {
//   const colors  = useTheme();
//   return StyleSheet.create({
//     formContainer: {
//       justifyContent: 'center',
//       paddingHorizontal: scale(10),
//       paddingVertical: width * 0.11,
//     },
//     title: {
//       fontSize: scale(34),
//       color: colors.primary,
//     },
//     subtitle: {
//       fontSize: scale(16),
//       color: colors.text,
//       textAlign: 'left',
//       marginBottom: scale(30),
//     },
//     loginText: {
//       color: colors.primary,
//       fontSize: scale(16),
//     },
//     loginLink: {
//       fontSize: scale(18),
//       color: colors.primary,
//       textAlign: 'center',
//     },
//     registerButton: {
//       marginVertical: scale(6),
//       backgroundColor: colors.primary,
//       paddingVertical: height * 0.02,
//     },
//     inputContainer: {
//       marginBottom: scale(10),

//     },
//     dividerContainer: {
//       flexDirection: 'row',
//       justifyContent: 'center',
//       marginTop: scale(20),
//       alignItems: 'center',
//       gap: 3,
//     },
//     orText: {
//       color: colors.text,
//       fontSize: scale(16),
//     },
//   });
// };

// export default useStyle;
import { StyleSheet, ViewStyle } from "react-native";

import { useTheme } from "@/constants/Colors";
import responsive from "@utils/responsive";

const useStyle = () => {
  const colors = useTheme();

  // Responsive spacing and sizing helpers
  const getResponsiveSpacing = () => ({
    containerPadding: responsive.isWeb
      ? responsive.isDesktop
        ? responsive.spacing.xxl()
        : responsive.spacing.xl()
      : responsive.spacing.lg(),
    sectionSpacing: responsive.isWeb
      ? responsive.isDesktop
        ? responsive.spacing.xl()
        : responsive.spacing.lg()
      : responsive.spacing.md(),
    elementSpacing: responsive.spacing.md(),
    smallSpacing: responsive.spacing.sm(),
  });

  const spacing = getResponsiveSpacing();

  // Form container with responsive layout
  const formContainerStyle: ViewStyle = {
    justifyContent: "center" as const,
    paddingVertical: spacing.containerPadding,
    width: "100%",
    alignSelf: "center" as const,
    ...(responsive.isWeb && {
      minHeight: responsive.isDesktop ? 600 : 500,
    }),
    ...(typeof responsive.layout.formMaxWidth === "number" && {
      maxWidth: responsive.layout.formMaxWidth,
    }),
  };

  return StyleSheet.create({
    formContainer: formContainerStyle,

    logoContainer: {
      alignItems: "center",
      marginTop: responsive.isWeb
        ? responsive.isDesktop
          ? spacing.sectionSpacing
          : spacing.elementSpacing
        : spacing.elementSpacing,
      marginBottom: spacing.sectionSpacing,
    },

    logo: {
      width: responsive.isWeb
        ? responsive.isDesktop
          ? responsive.moderateScale(120)
          : responsive.moderateScale(100)
        : responsive.width(30),
      height: responsive.isWeb
        ? responsive.isDesktop
          ? responsive.moderateScale(120)
          : responsive.moderateScale(100)
        : responsive.width(30),
      resizeMode: "contain",
    },

    title: {
      fontSize: responsive.typography.titleLarge(),
      color: colors.primary,
      marginBottom: spacing.smallSpacing,
      textAlign: responsive.isWeb && responsive.isDesktop ? "center" : "left",
      fontWeight: "bold",
    },

    subtitle: {
      fontSize: responsive.typography.body(),
      color: colors.text,
      marginBottom: spacing.sectionSpacing,
      textAlign: responsive.isWeb && responsive.isDesktop ? "center" : "left",
      lineHeight: responsive.typography.body() * 1.4,
    },

    inputContainer: {
      marginBottom: spacing.elementSpacing,
      gap: spacing.elementSpacing,
    },

    registerButton: {
      marginVertical: spacing.smallSpacing,
      backgroundColor: colors.primary,
      paddingVertical: spacing.elementSpacing,
      borderRadius: responsive.moderateScale(8),
      alignItems: "center",
      height: responsive.layout.buttonHeight,
      justifyContent: "center",
      ...(responsive.isWeb && {
        cursor: "pointer" as any,
        transition: "all 0.2s ease" as any,
      }),
    },

    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: spacing.elementSpacing,
      marginHorizontal: responsive.isWeb ? 0 : 0,
      gap: responsive.spacing.xs(),
    },

    orText: {
      fontSize: responsive.typography.body(),
      color: colors.text,
      textAlign: "center",
    },

    loginText: {
      fontSize: responsive.typography.body(),
      color: colors.primary,
      textAlign: "center",
      fontWeight: "600",
      ...(responsive.isWeb && {
        cursor: "pointer" as any,
        textDecorationLine: "underline" as any,
      }),
    },

    loginLink: {
      fontSize: responsive.typography.body(),
      color: colors.primary,
      textAlign: "center",
      fontWeight: "600",
    },
  });
};

export default useStyle;
