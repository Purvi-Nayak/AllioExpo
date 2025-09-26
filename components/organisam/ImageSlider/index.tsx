// import React, { memo } from 'react';
import Text from "@components/atoms/Text";
import { memo } from "react";
import { Image, Platform, View } from "react-native";
import { CustomFlatList } from "../../index";
import useStyle from "./style";
import { useImageSlider } from "./useImageSlide";

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

  // Enhanced web layout with better styling
  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webHeader}>
          <Text style={styles.webTitle}>Experience ALLIO</Text>
          <Text style={styles.webSubtitle}>
            See how ALLIO transforms your productivity workflow
          </Text>
        </View>

        <View style={styles.webSliderContainer}>
          <CustomFlatList
            ref={flatListRef as React.RefObject<any>}
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={IMAGE_WIDTH + IMAGE_MARGIN * 2}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.webContentContainer}
            keyExtractor={(_item: any, idx: number) => idx.toString()}
            renderItem={({ item, index }: { item: any; index: number }) => (
              <View
                style={[
                  styles.webImageContainer,
                  index === current && styles.webActiveImage,
                ]}
              >
                <Image
                  source={item}
                  style={styles.webImage}
                  resizeMode="cover"
                />
              </View>
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

          {/* Web-specific pagination indicators */}
          <View style={styles.webPagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.webPaginationDot,
                  index === current && styles.webPaginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Mobile layout (original)
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
