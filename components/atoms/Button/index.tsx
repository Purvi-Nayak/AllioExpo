// components/ui/Button/index.tsx
import { useTheme } from "@/constants/Colors";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  GestureResponderHandlers,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Text from "../Text";
import useStyle from "./style";

const { width } = Dimensions.get("window");

interface ButtonProps extends GestureResponderHandlers {
  title: string;
  onPress?: () => void;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  prefixLogo?: React.ReactNode;
  postfixLogo?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  bgColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
  variant?: "filled" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  title,
  textColor,
  style,
  prefixLogo,
  postfixLogo,
  loading = false,
  disabled = false,
  bgColor,
  outlineColor,
  outlineWidth = 1,
  variant = "filled",
  size = "medium",
  onPress,
  ...props
}) => {
  const colors = useTheme();
  const styles = useStyle();

  // Determine button type based on props or variant
  const isOutlineType = variant === "outlined" || outlineColor !== undefined;
  const isTextType = variant === "text";
  const isFillType = variant === "filled" && !isOutlineType && !isTextType;

  // Button wrapper styles
  const wrapperStyles: StyleProp<ViewStyle> = [
    styles.button,
    styles[`${size}Button`],

    // Fill type styling
    isFillType && {
      backgroundColor: bgColor || colors.primary,
      borderWidth: 0,
    },

    // Outline type styling
    isOutlineType && {
      backgroundColor: "transparent",
      borderColor: outlineColor || colors.primary,
      borderWidth: outlineWidth,
    },

    // Text type styling
    isTextType && {
      backgroundColor: "transparent",
      borderWidth: 0,
    },

    // Disabled/loading state
    (disabled || loading) && styles.disabled,
    style,
  ];

  // Text color logic
  let currentTextColor = colors.text;

  if (textColor) {
    currentTextColor = textColor;
  } else if (isOutlineType) {
    currentTextColor = outlineColor || colors.primary;
  } else if (isTextType) {
    currentTextColor = colors.primary;
  } else if (isFillType) {
    // For dark backgrounds, use white text; for light backgrounds, use dark text
    const bgColorToUse = bgColor || colors.primary;
    currentTextColor =
      bgColorToUse === colors.primary ? colors.black : colors.white;
  }

  const handlePress = () => {
    if (!loading && !disabled && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={loading || disabled}
      style={wrapperStyles}
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={currentTextColor}
          size={size === "small" ? "small" : "small"}
        />
      ) : (
        <View style={styles.content}>
          {prefixLogo && (
            <View style={[styles.icon, styles.prefixIcon]}>{prefixLogo}</View>
          )}

          <Text
            style={[
              styles.text,
              styles[`${size}Text`],
              { color: currentTextColor },
            ]}
          >
            {title}
          </Text>

          {postfixLogo && (
            <View style={[styles.icon, styles.postfixIcon]}>{postfixLogo}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
