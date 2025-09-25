import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Base guideline (e.g., iPhone 11)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// --- FIX: Cap width for web so scaling isn’t huge ---
const effectiveWidth =
  Platform.OS === "web" ? Math.min(screenWidth, 500) : screenWidth;

// scale by width
const scale = (size: number) => (effectiveWidth / guidelineBaseWidth) * size;

// scale by height
const verticalScale = (size: number) =>
  (screenHeight / guidelineBaseHeight) * size;

// moderate scaling
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// width in %
const width = (percent: number) => {
  const value = (screenWidth * percent) / 100;
  return Platform.OS === "web" ? value : PixelRatio.roundToNearestPixel(value);
};

// height in %
const height = (percent: number) => {
  const value = (screenHeight * percent) / 100;
  return Platform.OS === "web" ? value : PixelRatio.roundToNearestPixel(value);
};

// optional container for web centering
const containerStyle = (maxWidth = 500) => ({
  flex: 1,
  width: "100%",
  alignSelf: "center",
  ...(Platform.OS === "web"
    ? {
        maxWidth,
      }
    : {}),
  ...(Platform.OS === "android" || Platform.OS === "ios"
    ? {
        paddingHorizontal: width(5),
      }
    : {}),
});

const responsive = {
  width,
  height,
  scale,
  verticalScale,
  moderateScale,
  containerStyle,
};

export default responsive;
