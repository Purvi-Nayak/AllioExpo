import responsive from "@/utils/responsive";
import { useMemo } from "react";
import { Dimensions } from "react-native";

/**
 * Custom hook for responsive design utilities
 * Provides media query-like functionality for React Native
 */
export const useResponsive = () => {
  const screenData = Dimensions.get("window");

  const responsiveData = useMemo(() => {
    return {
      // Screen info
      screenWidth: screenData.width,
      screenHeight: screenData.height,

      // Platform detection
      isWeb: responsive.isWeb,
      isMobile: responsive.isMobile,
      isTablet: responsive.isTablet,
      isDesktop: responsive.isDesktop,

      // Breakpoints
      breakpoints: responsive.breakpoints,

      // Responsive utilities
      spacing: responsive.spacing,
      typography: responsive.typography,
      layout: responsive.layout,

      // Helper functions for conditional rendering/styling
      showOnMobile: !responsive.isWeb || responsive.isMobile,
      showOnTablet: responsive.isTablet,
      showOnDesktop: responsive.isDesktop,
      showOnWebOnly: responsive.isWeb,
      showOnNativeOnly: !responsive.isWeb,

      // Responsive style helpers
      containerStyle: responsive.containerStyle,

      // Responsive sizing functions
      wp: responsive.width, // width percentage
      hp: responsive.height, // height percentage
      ms: responsive.moderateScale, // moderate scale
      vs: responsive.verticalScale, // vertical scale
      s: responsive.scale, // scale

      // Media query style generator
      mediaQuery: (styles: {
        mobile?: any;
        tablet?: any;
        desktop?: any;
        web?: any;
        native?: any;
      }) => {
        if (responsive.isWeb) {
          if (responsive.isDesktop && styles.desktop) return styles.desktop;
          if (responsive.isTablet && styles.tablet) return styles.tablet;
          if (responsive.isMobile && styles.mobile) return styles.mobile;
          if (styles.web) return styles.web;
        } else {
          if (styles.native) return styles.native;
          if (styles.mobile) return styles.mobile;
        }
        return {};
      },

      // Style variants based on screen size
      getStyleVariant: (
        baseStyle: any,
        variants?: {
          mobile?: any;
          tablet?: any;
          desktop?: any;
        }
      ) => {
        const variantStyle = variants
          ? {
              ...(responsive.isMobile && variants.mobile),
              ...(responsive.isTablet && variants.tablet),
              ...(responsive.isDesktop && variants.desktop),
            }
          : {};

        return { ...baseStyle, ...variantStyle };
      },
    };
  }, [screenData.width, screenData.height]);

  return responsiveData;
};

/**
 * Hook specifically for responsive text sizing
 */
export const useResponsiveText = () => {
  const { typography } = useResponsive();

  return {
    caption: typography.caption(),
    body: typography.body(),
    bodyLarge: typography.bodyLarge(),
    subtitle: typography.subtitle(),
    title: typography.title(),
    titleLarge: typography.titleLarge(),
    display: typography.display(),
  };
};

/**
 * Hook specifically for responsive spacing
 */
export const useResponsiveSpacing = () => {
  const { spacing } = useResponsive();

  return {
    xs: spacing.xs(),
    sm: spacing.sm(),
    md: spacing.md(),
    lg: spacing.lg(),
    xl: spacing.xl(),
    xxl: spacing.xxl(),
  };
};

/**
 * Hook for conditional rendering based on screen size
 */
export const useMediaQuery = () => {
  const responsiveData = useResponsive();

  return {
    isMobile: responsiveData.isMobile,
    isTablet: responsiveData.isTablet,
    isDesktop: responsiveData.isDesktop,
    isWeb: responsiveData.isWeb,

    // Boolean values for conditional rendering
    showOnMobile: responsiveData.showOnMobile,
    showOnTablet: responsiveData.showOnTablet,
    showOnDesktop: responsiveData.showOnDesktop,
    showOnWebOnly: responsiveData.showOnWebOnly,
    showOnNativeOnly: responsiveData.showOnNativeOnly,
  };
};

export default useResponsive;
