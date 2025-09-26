import { useTheme } from "@/constants/Colors";
import responsive from "@utils/responsive";
import { StyleSheet, ViewStyle } from "react-native";

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
      minHeight: responsive.isDesktop ? 400 : 350,
    }),
    ...(typeof responsive.layout.formMaxWidth === "number" && {
      maxWidth: responsive.layout.formMaxWidth,
    }),
  };

  return StyleSheet.create({
    container: {
      marginTop: responsive.verticalScale(50),
      justifyContent: "center",
      ...(responsive.containerStyle(500) as any),
    },

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

    form: {
      gap: spacing.elementSpacing,
    },

    scrollView: {
      flexGrow: 1,
      paddingHorizontal: responsive.isWeb
        ? responsive.isDesktop
          ? responsive.spacing.xl()
          : responsive.spacing.lg()
        : responsive.spacing.md(),
    },

    backButton: {
      position: "absolute",
      top: responsive.verticalScale(40),
      left: responsive.moderateScale(20),
      zIndex: 1,
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

    sendButton: {
      marginTop: spacing.elementSpacing,
      marginVertical: spacing.smallSpacing,
      backgroundColor: colors.primary,
      borderRadius: responsive.moderateScale(8),
      paddingVertical: spacing.elementSpacing,
      alignItems: "center",
      height: responsive.layout.buttonHeight,
      justifyContent: "center",
      ...(responsive.isWeb && {
        cursor: "pointer" as any,
        transition: "all 0.2s ease" as any,
      }),
    },

    loginButton: {
      marginTop: spacing.elementSpacing,
      marginVertical: spacing.smallSpacing,
      backgroundColor: colors.primary,
      borderRadius: responsive.moderateScale(8),
      paddingVertical: spacing.elementSpacing,
      alignItems: "center",
    },

    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.smallSpacing,
      marginVertical: spacing.elementSpacing,
    },

    orText: {
      fontSize: responsive.typography.caption(),
      color: colors.text,
      textAlign: "center",
    },

    loginText: {
      paddingVertical: spacing.elementSpacing,
      fontSize: responsive.typography.body(),
      textAlign: "center",
      color: colors.primary,
      fontWeight: "600",
      ...(responsive.isWeb && {
        cursor: "pointer" as any,
        textDecorationLine: "underline" as any,
      }),
    },

    signUpText: {
      color: colors.primary,
      fontSize: responsive.typography.body(),
      fontWeight: "600",
    },
  });
};

export default useStyle;
