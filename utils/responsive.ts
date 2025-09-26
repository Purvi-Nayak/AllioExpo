import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Base guideline (e.g., iPhone 11)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Breakpoints for responsive design
const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

// Media query helpers
const isWeb = Platform.OS === "web";
const isMobile = screenWidth < breakpoints.mobile;
const isTablet =
  screenWidth >= breakpoints.mobile && screenWidth < breakpoints.tablet;
const isDesktop = screenWidth >= breakpoints.tablet;

// --- FIX: Cap width for web so scaling isn't huge ---
const effectiveWidth = isWeb ? Math.min(screenWidth, 500) : screenWidth;

// scale by width with responsive adjustments
const scale = (size: number) => {
  const scaledSize = (effectiveWidth / guidelineBaseWidth) * size;

  if (isWeb) {
    if (isDesktop) return scaledSize * 0.8; // Slightly smaller on desktop
    if (isTablet) return scaledSize * 0.9; // Moderately smaller on tablet
    return scaledSize; // Normal on mobile web
  }

  return scaledSize; // Normal on native mobile
};

// scale by height with responsive adjustments
const verticalScale = (size: number) => {
  const scaledSize = (screenHeight / guidelineBaseHeight) * size;

  if (isWeb) {
    if (isDesktop) return scaledSize * 0.7; // More compact on desktop
    if (isTablet) return scaledSize * 0.8; // Slightly more compact on tablet
    return scaledSize; // Normal on mobile web
  }

  return scaledSize; // Normal on native mobile
};

// moderate scaling with responsive factor
const moderateScale = (size: number, factor = 0.5) => {
  const baseScale = scale(size);
  const moderatedSize = size + (baseScale - size) * factor;

  if (isWeb) {
    if (isDesktop) return Math.max(moderatedSize * 0.9, 12); // Ensure minimum readability
    if (isTablet) return Math.max(moderatedSize * 0.95, 12);
    return Math.max(moderatedSize, 12);
  }

  return moderatedSize;
};

// width in % with responsive adjustments
const width = (percent: number) => {
  let value = (screenWidth * percent) / 100;

  if (isWeb) {
    // On web, consider max content width
    const maxContentWidth = Math.min(screenWidth, 1200);
    value = (maxContentWidth * percent) / 100;
  }

  return isWeb ? value : PixelRatio.roundToNearestPixel(value);
};

// height in % with responsive adjustments
const height = (percent: number) => {
  const value = (screenHeight * percent) / 100;
  return isWeb ? value : PixelRatio.roundToNearestPixel(value);
};

// Enhanced container for responsive layouts
const containerStyle = (maxWidth = 500) => {
  const baseStyle: any = {
    flex: 1,
    width: "100%",
    alignSelf: "center" as const,
  };

  if (isWeb) {
    baseStyle.maxWidth = isDesktop ? Math.max(maxWidth, 600) : maxWidth;
    baseStyle.paddingHorizontal = isDesktop ? 40 : isTablet ? 30 : 20;
  }

  if (Platform.OS === "android" || Platform.OS === "ios") {
    baseStyle.paddingHorizontal = width(4);
  }

  return baseStyle;
};

// Spacing helpers for consistent responsive spacing
const spacing = {
  xs: () => moderateScale(4),
  sm: () => moderateScale(8),
  md: () => moderateScale(16),
  lg: () => moderateScale(24),
  xl: () => moderateScale(32),
  xxl: () => moderateScale(48),
};

// Typography helpers for consistent responsive text sizes
const typography = {
  caption: () => moderateScale(12),
  body: () => moderateScale(14),
  bodyLarge: () => moderateScale(16),
  subtitle: () => moderateScale(18),
  title: () => moderateScale(24),
  titleLarge: () => moderateScale(28),
  display: () => moderateScale(32),
};

// Layout helpers for different screen sizes
const layout = {
  formMaxWidth: isDesktop ? 450 : isTablet ? 400 : "100%",
  inputHeight: isWeb ? (isDesktop ? 48 : 44) : 45,
  buttonHeight: isWeb ? (isDesktop ? 50 : 46) : 48,
  cardPadding: isDesktop ? 32 : isTablet ? 24 : 16,
  sectionSpacing: isDesktop ? 40 : isTablet ? 32 : 24,
};

const responsive = {
  width,
  height,
  scale,
  verticalScale,
  moderateScale,
  containerStyle,
  spacing,
  typography,
  layout,
  // Breakpoint helpers
  isMobile,
  isTablet,
  isDesktop,
  isWeb,
  breakpoints,
};

export default responsive;
