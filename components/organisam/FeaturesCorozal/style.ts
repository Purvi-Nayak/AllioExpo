// style.ts
import { CARD_WIDTH, SPACING } from '@utils/constant';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
export interface FeatureDataItem {
  image: any;
  title: string;
  description: string;
  buttonText: string;
}

const styles = StyleSheet.create({
  textone: {
    padding: 10,
    fontSize: scale(28),
    fontWeight: 'bold',
  },
});

export default function useStyle() {
  return { CARD_WIDTH, SPACING, styles };
}
