import React, { memo } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  View,
  ViewStyle,
} from 'react-native';

import { IMAGES } from '../../../assets';

import useStyle from './style';
interface Props {
  logo?: ImageSourcePropType;
  logoStyle?: ImageStyle;
  containerStyle?: ViewStyle;
}

const CustomLogo: React.FC<Props> = ({ logo, logoStyle, containerStyle }) => {
  const styles = useStyle();

  return (
    <View style={[styles.logoContainer, containerStyle]}>
      <Image
        source={logo || IMAGES.Allio_Logo}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

export default memo(CustomLogo);
