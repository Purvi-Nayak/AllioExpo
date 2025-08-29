import { useTheme } from '@/constants/Colors';
import { StyleSheet } from 'react-native';


const useStyle = () => {
  const  colors  = useTheme();
  return StyleSheet.create({
    contentContainer: {
      justifyContent: 'center',
    },
    statusBar: {
      backgroundColor: colors.white,
    },
  });
};

export default useStyle;
