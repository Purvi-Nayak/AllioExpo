import Text from '@components/atoms/Text';
import FeatureCard from '@components/cards/FeatureCard';
import { CARD_WIDTH } from '@utils/constant';
import React, { useRef } from 'react';
import { Dimensions, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';
import useStyle from './style';
type FeatureDataItem = {
  image: any;
  title: string;
  description: string;
  buttonText: string;
};
const windowWidth = Dimensions.get('window').width;

interface FeaturesCarouselProps {
  data: FeatureDataItem[];
  onPress: (label: string) => void;
}

export const FeaturesCarousel: React.FC<FeaturesCarouselProps> = ({
  data,
  onPress,
}) => {
  const styles = useStyle();
  // Adjust card width as needed
  const carouselRef = useRef<ICarouselInstance>(null);

  return (
    <>
      <Text style={styles.textone}>{'FeaturesCarousel.title'}</Text>

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
          snapDirection: 'left',
        }}
        onConfigurePanGesture={(gesture: any) => {
          gesture.enabled(false);
        }}
        renderItem={({ item }: { item: FeatureDataItem }) => (
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
        customConfig={() => ({ viewCount: 3, type: 'positive' })}
      />
    </>
  );
};
