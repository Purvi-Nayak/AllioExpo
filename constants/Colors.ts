import { useColorScheme } from "react-native";

/**
 * Custom static colors used across both themes
 */
export const colors = {
  primary: "#FBC02D",
  lightyellow: "#FFF9C4",
  black: "#000000",
  white: "#FFFFFF",
  hoverColor: "#F2EADF",
  skyBlue: "#87CEEB",
  babyBlue: "#ADD8E6",
  iceBlue: "#B3E0F2",
  lightBlue: "#ADD8E6",
  pastelBlue: "#D0EFFF",
  midnightBlue: "#191970",
  navyBlue: "#000080",
  secondary: "#00BFFF",
  third: "#0076DF",
  lightgray: "#B5B5B5",
  lightGray: "#D3D3D3",
  gray: "#909090",
  darkGray: "#323232",
  error: "#F44336",
  google: "#FF4433",
  pink: "#FF69B4",
  green: "#4CAF50",
  modelbg: "#0000004d",
  mainone: "rgba(0,0,0,0.5)",
};

/**
 * Adaptive theme colors for light and dark modes
 */
const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const baseTheme = {
  text: "",
  background: "",
  tint: "",
  icon: "",
  tabIconDefault: "",
  tabIconSelected: "",
  primary: "#FBC02D",
  lightyellow: "#FFF9C4",
  black: "#000000",
  white: "#FFFFFF",
  hoverColor: "#F2EADF",
  skyBlue: "#87CEEB",
  babyBlue: "#ADD8E6",
  iceBlue: "#B3E0F2",
  lightBlue: "#ADD8E6",
  pastelBlue: "#D0EFFF",
  midnightBlue: "#191970",
  navyBlue: "#000080",
  secondary: "#00BFFF",
  third: "#0076DF",
  lightgray: "#B5B5B5",
  lightGray: "#D3D3D3",
  gray: "#909090",
  darkGray: "#323232",
  error: "#F44336",
  google: "#FF4433",
  pink: "#FF69B4",
  green: "#4CAF50",
  modelbg: "#0000004d",
  mainone: "rgba(0,0,0,0.5)",
};

export const Themes = {
  light: {
    ...baseTheme,
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    ...baseTheme,
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    primary: "#FBC02D",
    lightyellow: "#FFF9C4",
    black: "#000000",
    white: "#FFFFFF",
    hoverColor: "#F2EADF",
    skyBlue: "#87CEEB",
    babyBlue: "#ADD8E6",
    iceBlue: "#B3E0F2",
    lightBlue: "#ADD8E6",
    pastelBlue: "#D0EFFF",
    midnightBlue: "#191970",
    navyBlue: "#000080",
    secondary: "#00BFFF",
    third: "#0076DF",
    lightgray: "#B5B5B5",
    lightGray: "#D3D3D3",
    gray: "#909090",
    darkGray: "#323232",
    error: "#F44336",
    google: "#FF4433",
    pink: "#FF69B4",
    green: "#4CAF50",
    modelbg: "#0000004d",
    mainone: "rgba(0,0,0,0.5)",
  },
};

export type ThemeType = typeof Themes.light & typeof colors;

/**
 * Hook to select and return current theme based on system mode
 */
export function useTheme(): ThemeType {
  const scheme = useColorScheme();
  const base = scheme === "dark" ? Themes.dark : Themes.light;
  return { ...colors, ...base };
}
