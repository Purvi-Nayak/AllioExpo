import { useRouter } from 'expo-router';
import React from 'react';

import ContactUsSection from '@/components/organisam/ContactUsSection';
import { IMAGES } from '@assets/index';
import { AboutDetails, Container, ImageSlider } from '@components/index';
import { FeaturesCarousel } from '@components/organisam/FeaturesCorozal';
import { FeaturesDataItem } from '@utils/constant';

const promoImages = [
  IMAGES.OnboardingThree,
  IMAGES.SecondOnboarding,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
  IMAGES.OnboardingThree,
];

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push('/(private)/(tabs)/settings');
  };

  const handleFeaturePress = (label: string) => {
    const key = label.toLowerCase();
    if (key.includes('scan')) {
      router.push('/(private)/(tabs)/scanner');
      return;
    }
    if (key.includes('video')) {
      router.push('/(private)/(tabs)/media');
      return;
    }
    if (key.includes('photo')) {
      router.push('/(private)/(tabs)/media');
      return;
    }
    router.back();
  };

  return (
    <Container
      onProfilePress={handleProfilePress}
      title="Home"
      showAppLogo
      showProfileLogo
      keyboardAvoiding>
      <AboutDetails />
      <ImageSlider images={promoImages} />
      <FeaturesCarousel data={FeaturesDataItem} onPress={handleFeaturePress} />
      <ContactUsSection />
    </Container>
  );
};

export default HomeScreen;
