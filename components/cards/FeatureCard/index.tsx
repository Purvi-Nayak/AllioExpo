import React, { memo } from 'react';
import { Image, View } from 'react-native';
import { Button, Text } from '../../index';
import useStyle from './style';
interface FeatureCardProps {
  image: any;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  description,
  buttonText,
  onPress,
}) => {
  const styles = useStyle();
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Button title={buttonText} style={styles.button} onPress={onPress} />
    </View>
  );
};

export default memo(FeatureCard);
