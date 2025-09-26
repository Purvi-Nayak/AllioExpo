import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, View } from "react-native";

import ContactUsSection from "@/components/organisam/ContactUsSection";
import { useTheme } from "@/constants/Colors";
import responsive from "@/utils/responsive";
import { IMAGES } from "@assets/index";
import { AboutDetails, Container, ImageSlider } from "@components/index";
import { FeaturesCarousel } from "@components/organisam/FeaturesCorozal";
import { FeaturesDataItem } from "@utils/constant";

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
  const theme = useTheme();

  const handleProfilePress = () => {
    router.push("/(private)/(tabs)/settings");
  };

  const handleFeaturePress = (label: string) => {
    const key = label.toLowerCase();
    if (key.includes("scan")) {
      router.push("/(private)/(tabs)/scanner");
      return;
    }
    if (key.includes("video")) {
      router.push("/(private)/(tabs)/media");
      return;
    }
    if (key.includes("photo")) {
      router.push("/(private)/(tabs)/media");
      return;
    }
    router.back();
  };

  // For web, use a modern layout structure
  if (Platform.OS === "web") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          paddingLeft: 250, // Account for drawer width
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          {/* Hero Section - Full width */}
          <AboutDetails />

          {/* Main Content Container */}
          <View
            style={{
              maxWidth: 1400,
              width: "100%",
              alignSelf: "center",
              paddingHorizontal: responsive.scale(40),
            }}
          >
            {/* Image Slider Section */}
            <View style={{ marginVertical: responsive.scale(60) }}>
              <ImageSlider images={promoImages} />
            </View>

            {/* Features Section */}
            <View style={{ marginVertical: responsive.scale(60) }}>
              <FeaturesCarousel
                data={FeaturesDataItem}
                onPress={handleFeaturePress}
              />
            </View>

            {/* Contact Section */}
            <View
              style={{
                marginVertical: responsive.scale(60),
                marginBottom: responsive.scale(80),
              }}
            >
              <ContactUsSection />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Mobile layout with Container
  return (
    <Container
      onProfilePress={handleProfilePress}
      title="Home"
      showAppLogo
      showProfileLogo
    >
      <AboutDetails />
      <ImageSlider images={promoImages} />
      <FeaturesCarousel data={FeaturesDataItem} onPress={handleFeaturePress} />
      <ContactUsSection />
    </Container>
  );
};

export default HomeScreen;
