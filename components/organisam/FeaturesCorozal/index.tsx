import FeatureCard from "@/components/cards/FeatureCard";
import Text from "@components/atoms/Text";
import React, { useRef } from "react";
import { Dimensions, FlatList, Platform, View } from "react-native";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import type { FeatureDataItem } from "./style";
import useStyle from "./style";

const windowWidth = Dimensions.get("window").width;

interface FeaturesCarouselProps {
  data: FeatureDataItem[];
  onPress: (label: string) => void;
}

export const FeaturesCarousel: React.FC<FeaturesCarouselProps> = ({
  data,
  onPress,
}) => {
  const { CARD_WIDTH, styles } = useStyle();
  const carouselRef = useRef<ICarouselInstance>(null);

  // For web, use a modern grid layout with better styling
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <View style={styles.webHeader}>
          <Text style={styles.webTitle}>Features of ALLIO</Text>
          <Text style={styles.webSubtitle}>
            Discover the powerful tools that make ALLIO your ultimate
            productivity companion
          </Text>
        </View>
        <FlatList
          data={data}
          numColumns={3}
          key={"web-grid"}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.webGridContainer}
          columnWrapperStyle={styles.webColumnWrapper}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.webCardContainer,
                {
                  // Stagger animation delay
                  opacity: 1,
                  transform: [{ translateY: 0 }],
                },
              ]}
            >
              <FeatureCard
                image={item.image}
                title={item.title}
                description={item.description}
                buttonText={item.buttonText}
                onPress={() => onPress(item.title)}
              />
            </View>
          )}
          keyExtractor={(item, index) => `feature-${index}`}
        />
      </View>
    );
  }

  // Mobile carousel layout
  return (
    <View style={styles.container}>
      <Text style={styles.textone}>Features of ALLIO</Text>
      <Carousel
        ref={carouselRef}
        data={data}
        width={windowWidth}
        height={CARD_WIDTH * 0.9}
        loop
        mode="horizontal-stack"
        modeConfig={{
          stackInterval: 20,
          scaleInterval: 0.1,
          moveSize: CARD_WIDTH,
          snapDirection: "left",
        }}
        onConfigurePanGesture={(gesture) => {
          gesture.enabled(false);
        }}
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH }}>
            <FeatureCard
              image={item.image}
              title={item.title}
              description={item.description}
              buttonText={item.buttonText}
              onPress={() => onPress(item.title)}
            />
          </View>
        )}
        customConfig={() => ({ viewCount: 3, type: "positive" })}
      />
    </View>
  );
};
