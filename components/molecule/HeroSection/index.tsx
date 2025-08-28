import React, { useEffect } from 'react';
import { ImageBackground, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { IMAGES } from '../../../assets';
import { Text } from '../../index';
import useStyle from './style';

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
  }, []);

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
      style={styles.bg}>
      <View style={styles.overlay} />
      <Animated.View style={[titleStyle]}>
        <Text type="bold" style={styles.title}>
          {'HeroSection.titleone'}
        </Text>
      </Animated.View>
      <Animated.View style={[descStyle]}>
        <Text type="regular" style={styles.description}>
          {'HeroSection.description'}
        </Text>
      </Animated.View>
      <Animated.View style={[styles.buttonRow, btnStyle]}></Animated.View>

      {/* Decorative floating shape using Lottie or static */}
    </ImageBackground>
  );
}
