import { IMAGES } from "@assets/index";
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import React, { useEffect } from "react";
import { ImageBackground, Platform, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useStyle from "./style";

interface Props {
  description: string;
}

export default function HeroSection({ description }: Props) {
  const styles = useStyle();

  const titleY = useSharedValue(50);
  const descY = useSharedValue(60);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    titleY.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    descY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    btnOpacity.value = withTiming(1, { duration: 1000 });
  }, [titleY, descY, btnOpacity]);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: titleY.value === 0 ? 1 : 0,
  }));
  const descStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: descY.value }],
    opacity: descY.value === 0 ? 1 : 0,
  }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
  }));

  return (
    <ImageBackground
      source={IMAGES.Mobile}
      resizeMode="cover"
      style={styles.bg}
    >
      {/* Overlay with conditional styling for web/mobile */}
      <View style={styles.overlay} />

      <View style={styles.contentContainer}>
        <Animated.View style={[titleStyle, styles.titleContainer]}>
          <Text type="bold" style={styles.title}>
            Welcome to ALLIO
          </Text>
          {Platform.OS === "web" && (
            <Text type="bold" style={styles.subtitle}>
              Your All-in-One Productivity Suite
            </Text>
          )}
        </Animated.View>

        <Animated.View style={[descStyle, styles.descriptionContainer]}>
          <Text style={styles.description}>{description}</Text>
        </Animated.View>

        {Platform.OS === "web" && (
          <Animated.View style={[styles.buttonRow, btnStyle]}>
            <Button
              title="Get Started"
              style={styles.primaryButton}
              textStyle={styles.buttonText}
            />
            <Button
              title="Learn More"
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </Animated.View>
        )}

        {/* Decorative Elements for Web */}
        {Platform.OS === "web" && (
          <Animated.View style={[styles.decorativeElements, btnStyle]}>
            <View style={styles.floatingCard1} />
            <View style={styles.floatingCard2} />
            <View style={styles.floatingCard3} />
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
}
