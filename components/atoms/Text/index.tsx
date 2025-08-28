// components/ui/Text.tsx

import React from "react";
import {
  GestureResponderEvent,
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
} from "react-native";

interface TextProps extends RNTextProps {
  children?: React.ReactNode;
  type?: "regular" | "medium" | "bold" | "extrabold" | "semibold" | "light";
  style?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
}

const FONT_FAMILY = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  bold: "Poppins-Bold",
  extrabold: "Poppins-ExtraBold",
  semibold: "Poppins-SemiBold",
  light: "Poppins-Light",
} as const;

const Text: React.FC<TextProps> = ({
  type = "regular",
  children,
  style,
  ...rest
}) => {
  const fontFamily = FONT_FAMILY[type] || FONT_FAMILY.regular;

  return (
    <RNText style={[{ fontFamily }, style]} {...rest}>
      {children}
    </RNText>
  );
};

export default Text;
