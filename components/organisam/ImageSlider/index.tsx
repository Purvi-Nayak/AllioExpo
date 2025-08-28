// import React, { memo } from 'react';
import { memo } from 'react';
import { Image, View } from 'react-native';
import { CustomFlatList } from '../../index';
import useStyle from './style';
import { useImageSlider } from './useImageSlide';

interface ImageSliderProps {
  images: any[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const styles = useStyle();
  const {
    flatListRef,
    current,
    onMomentumScrollEnd,
    IMAGE_WIDTH,
    IMAGE_MARGIN,
  } = useImageSlider(images);

  return (
    <View style={styles.container}>
      <CustomFlatList
        ref={flatListRef as React.RefObject<any>}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={IMAGE_WIDTH + IMAGE_MARGIN * 2}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(_item: any, idx: number) => idx.toString()}
        renderItem={({ item }: { item: any }) => (
          <Image source={item} style={styles.image} resizeMode="cover" />
        )}
        onMomentumScrollEnd={onMomentumScrollEnd as (event: any) => void}
        getItemLayout={(_: any, index: number) => ({
          length: IMAGE_WIDTH + IMAGE_MARGIN * 2,
          offset: (IMAGE_WIDTH + IMAGE_MARGIN * 2) * index,
          index,
        })}
        initialScrollIndex={current}
        extraData={current}
        ListEmptyComponent={null as React.ReactElement | null}
      />
    </View>
  );
};

export default memo(ImageSlider);
