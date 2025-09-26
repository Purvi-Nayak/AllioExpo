import React, { memo } from "react";

import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";

import { ICONS } from "../../../assets";
import { CustomHeaderLogo, CustomProfileButton } from "../../index";
import Text from "../Text";

import useStyle from "./style";

interface CustomHeaderProps {
  showBackArrow?: boolean;
  onBackPress?: () => void;
  showAppLogo?: boolean;
  title?: string;
  showProfileLogo?: boolean;
  onProfilePress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  showBackArrow = false,
  onBackPress,
  showAppLogo = false,
  title,
  showProfileLogo = false,
  onProfilePress,
}) => {
  const styles = useStyle();
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    }
  };

  return (
    <View style={styles.headerContainer}>
      {showBackArrow && (
        <TouchableOpacity onPress={handleBackPress} style={styles.leftButton}>
          <Image
            source={ICONS.BackArrow}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {showAppLogo && (
        <View style={styles.leftLogo}>
          <CustomHeaderLogo logoStyle={styles.logoStyle} />
        </View>
      )}

      <View style={styles.centerContainer}>
        {title && (
          <Text
            type="bold"
            style={styles.title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        )}
      </View>

      {showProfileLogo && (
        <View style={styles.rightButton}>
          <CustomProfileButton onPress={handleProfilePress} />
        </View>
      )}
    </View>
  );
};

export default memo(CustomHeader);
