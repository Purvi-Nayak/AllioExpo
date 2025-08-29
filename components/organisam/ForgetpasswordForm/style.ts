import { useTheme } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

import { scale } from 'react-native-size-matters';


const useStyle = () => {
  const  colors  = useTheme();
  return StyleSheet.create({
    container: {
      marginTop: scale(50),
    },
    formContainer: {  
      flex: 1,
      justifyContent: 'center',
    
    },
    form: {
      gap: scale(20),
    },
    scrollView: {
      flexGrow: 1,
      paddingHorizontal: scale(10),
    },
    backButton: {
      position: 'absolute',
      top: scale(40),
      left: scale(20),
      zIndex: 1,
    },
 
    title: {
      fontSize: scale(34),
      color: colors.primary,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: scale(20),
    },
    subtitle: {
      fontSize: scale(16),
      color: colors.text,
    },
    loginButton: {
      marginTop: scale(16),
      marginVertical: scale(6),
      backgroundColor: colors.primary,
      borderRadius: scale(8),
      paddingVertical: scale(12),
    },
    dividerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: scale(20),
      alignItems: 'center',
      gap: 3,
    },
    orText: {
      color: colors.text,
      fontSize: scale(10),
    },
    loginText: {
      paddingVertical: scale(20),
      fontSize: scale(18),
      textAlign: 'center',
      color: colors.primary,
    },
    signUpText: {
      color: colors.primary,
      fontSize: scale(16),
    },
  });
};
export default useStyle;
