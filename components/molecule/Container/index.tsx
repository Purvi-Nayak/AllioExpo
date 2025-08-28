import { useTheme } from '@/constants/Colors';
import React, { memo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import { CustomHeader, CustomLoader, CustomStatusBar } from '../../index';
import useStyle from './style';


interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  onProfilePress?: () => void;
  showLoader?: boolean;
  statusBarColor?: string;
  loaderText?: string;
  keyboardAvoiding?: boolean;
  style?: ViewStyle;
  auth?: boolean;
  showProfileLogo?: boolean;
  showAppLogo?: boolean;
  showBackArrow?: boolean;
  title?: string;
}

const Container: React.FC<PageLayoutProps> = ({
  children,
  showHeader = true,
  onProfilePress,
  showLoader = false,
  statusBarColor,
  loaderText = 'Loading...',
  keyboardAvoiding = false,
  style,
  auth = false,
  showProfileLogo = false,
  showAppLogo = false,
  showBackArrow = false,
  title = '',
}) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = useStyle();

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }] }>
      <CustomStatusBar
        backgroundColor={
          statusBarColor ?? (auth ? theme.background : theme.primary)
        }
        barStyle={auth && isDark ? 'light-content' : 'dark-content'}
      />
      {showHeader && (
        <CustomHeader
          showProfileLogo={showProfileLogo}
          showAppLogo={showAppLogo}
          onProfilePress={onProfilePress}
          showBackArrow={showBackArrow}
          title={title}
        />
      )}
      <CustomLoader visible={showLoader} text={loaderText} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.flex, style]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContainer}>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <>{children}</>
      )}
    </View>
  );
};

export default memo(Container);
