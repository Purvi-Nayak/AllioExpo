import React, { memo } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { ICONS } from '../../../assets';
import useStyle from './style';
interface Props {
  onPress: () => void;
  icon?: ImageSourcePropType;
  iconStyle?: ImageStyle;
  buttonStyle?: ViewStyle;
}

const CustomProfileButton: React.FC<Props> = ({
  onPress,
  icon,
  iconStyle,
  buttonStyle,
}) => {
  const styles = useStyle();

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Image
        source={icon || ICONS.profile}
        style={[styles.icon, iconStyle]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default memo(CustomProfileButton);
