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
      minHeight: responsive.isDesktop ? 600 : 500,
    }),
    ...(typeof responsive.layout.formMaxWidth === "number" && {
      maxWidth: responsive.layout.formMaxWidth,
    }),
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      ...responsive.containerStyle(responsive.isDesktop ? 600 : 500),
    },

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

    formContainer: formContainerStyle,

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

    emailInput: {
      marginBottom: spacing.elementSpacing,
      borderRadius: responsive.moderateScale(8),
      paddingHorizontal: spacing.elementSpacing,
      height: responsive.layout.inputHeight,
      borderWidth: 1,
      borderColor: colors.lightGray,
      fontSize: responsive.typography.body(),
    },

    loginButton: {
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

    loginText: {
      fontSize: responsive.typography.bodyLarge(),
      color: colors.gray,
      textAlign: "center",
      paddingVertical: spacing.elementSpacing,
      lineHeight: responsive.typography.bodyLarge() * 1.3,
    },

    loginLink: {
      fontSize: responsive.typography.bodyLarge(),
      color: colors.primary,
      textAlign: "center",
      fontWeight: "600",
    },

    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: spacing.elementSpacing,
      paddingHorizontal: responsive.isWeb ? 0 : 0, // Remove extra padding to align with inputs
      marginHorizontal: responsive.isWeb ? 0 : 0, // Align with form width
    },

    dividerText: {
      fontSize: responsive.typography.body(),
      color: colors.primary,
      textAlign: "center",
      marginHorizontal: spacing.smallSpacing,
    },

    orText: {
      fontSize: responsive.typography.body(),
      color: colors.text,
      textAlign: "center",
    },

    socialSignInText: {
      fontSize: responsive.typography.body(),
      color: colors.primary,
      textAlign: "center",
      marginHorizontal: spacing.smallSpacing,
      fontWeight: "500",
    },

    socialButtonsWrapper: {
      marginTop: spacing.elementSpacing,
      marginBottom: spacing.elementSpacing,
    },

    SocialButtonStyle: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.elementSpacing,
      marginVertical: spacing.elementSpacing,
      flexWrap: "nowrap",
      ...(responsive.isMobile && {
        paddingHorizontal: spacing.smallSpacing,
        gap: spacing.smallSpacing,
      }),
    },

    iconStyle: {
      width: responsive.moderateScale(20),
      height: responsive.moderateScale(20),
      resizeMode: "contain",
    },

    icon: {
      width: responsive.moderateScale(32),
      height: responsive.moderateScale(32),
      resizeMode: "contain",
    },

    containerRow: {
      flexDirection: "row", // Always keep in row for better layout
      justifyContent: "center", // Center the content
      alignItems: "center",
      marginTop: spacing.sectionSpacing,
      paddingHorizontal: responsive.isWeb ? 0 : spacing.elementSpacing,
      gap: responsive.spacing.xs(), // Small consistent gap between text and link
    },

    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.text,
      opacity: 0.3,
      marginHorizontal: spacing.smallSpacing,
    },

    signUpText: {
      color: colors.primary,
      fontSize: responsive.typography.body(),
      fontWeight: "600",
      ...(responsive.isWeb && {
        cursor: "pointer" as any,
        textDecorationLine: "underline" as any,
      }),
    },

    // Responsive utility classes
    webOnly: {
      ...(responsive.isWeb ? {} : { display: "none" }),
    },

    mobileOnly: {
      ...(responsive.isWeb ? { display: "none" } : {}),
    },

    desktopOnly: {
      ...(responsive.isDesktop ? {} : { display: "none" }),
    },

    tabletUp: {
      ...(responsive.isTablet || responsive.isDesktop
        ? {}
        : { display: "none" }),
    },
  });
};

export default useStyle;


