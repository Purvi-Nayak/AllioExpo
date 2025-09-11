import CustomLoader from '@/components/atoms/CustomLoader';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MPIN_LENGTH = 4;

export default function AuthMethodScreen() {
  const router = useRouter();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const [mpin, setMpin] = useState('');
  const [step, setStep] = useState<'choose' | 'set-mpin' | 'confirm-mpin' | 'enter-mpin'>('choose');
  const [firstMpin, setFirstMpin] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setBiometricAvailable(hasHardware && isEnrolled);
      
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint');
      } else {
        setBiometricType('Biometric');
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const handleBiometric = async () => {
    setIsAuthenticating(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate with ${biometricType}`,
        fallbackLabel: 'Use MPIN instead',
        disableDeviceFallback: true,
      });
      
      if (result.success) {
        // Store biometric preference
        await SecureStore.setItemAsync('auth_method', 'biometric');
        Alert.alert('Success', 'Biometric authentication enabled!', [
          { text: 'OK', onPress: () => router.push('/(private)/(tabs)/home') }
        ]);
      } else {
        Alert.alert('Authentication Failed', 'Please try again or use MPIN.');
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Error', 'Biometric authentication failed. Please try MPIN.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleMpinInput = (digit: string) => {
    if (mpin.length < MPIN_LENGTH) {
      const newMpin = mpin + digit;
      setMpin(newMpin);
      
      // Vibrate on input
      Vibration.vibrate(10);
      
      if (newMpin.length === MPIN_LENGTH) {
        if (step === 'set-mpin') {
          setFirstMpin(newMpin);
          setMpin('');
          setStep('confirm-mpin');
        } else if (step === 'confirm-mpin') {
          if (newMpin === firstMpin) {
            saveMpin(newMpin);
          } else {
            Alert.alert('MPIN Mismatch', 'Please try again.', [
              { text: 'OK', onPress: () => { setMpin(''); setStep('set-mpin'); setFirstMpin(''); } }
            ]);
          }
        } else if (step === 'enter-mpin') {
          verifyMpin(newMpin);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (mpin.length > 0) {
      setMpin(mpin.slice(0, -1));
      Vibration.vibrate(10);
    }
  };

  const saveMpin = async (pin: string) => {
    try {
      await SecureStore.setItemAsync('user_mpin', pin);
      await SecureStore.setItemAsync('auth_method', 'mpin');
      Alert.alert('Success', 'MPIN set successfully!', [
        { text: 'OK', onPress: () => router.push('/(private)/(tabs)/home') }
      ]);
    } catch (error) {
      console.error('Error saving MPIN:', error);
      Alert.alert('Error', 'Failed to save MPIN. Please try again.');
    }
  };

  const verifyMpin = async (pin: string) => {
    try {
      const storedMpin = await SecureStore.getItemAsync('user_mpin');
      if (storedMpin === pin) {
        router.push('/(private)/(tabs)/home');
      } else {
        setMpin('');
        Vibration.vibrate([100, 50, 100]);
        Alert.alert('Incorrect MPIN', 'Please try again.');
      }
    } catch (error) {
      console.error('Error verifying MPIN:', error);
      Alert.alert('Error', 'Failed to verify MPIN.');
    }
  };

  const renderKeypad = () => (
    <View style={styles.keypad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <TouchableOpacity
          key={digit}
          style={styles.key}
          onPress={() => handleMpinInput(digit.toString())}
          activeOpacity={0.7}
        >
          <Text style={styles.keyText}>{digit}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.key} />
      <TouchableOpacity
        style={styles.key}
        onPress={() => handleMpinInput('0')}
        activeOpacity={0.7}
      >
        <Text style={styles.keyText}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.key}
        onPress={handleBackspace}
        activeOpacity={0.7}
      >
        <Ionicons name="backspace-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  const renderMpinDots = () => (
    <View style={styles.mpinDots}>
      {[...Array(MPIN_LENGTH)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i < mpin.length ? '#FFCE1B' : '#E0E0E0' },
          ]}
        />
      ))}
    </View>
  );

  const getStepTitle = () => {
    switch (step) {
      case 'set-mpin':
        return 'Set Your MPIN';
      case 'confirm-mpin':
        return 'Confirm Your MPIN';
      case 'enter-mpin':
        return 'Enter Your MPIN';
      default:
        return 'Choose Authentication Method';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 'set-mpin':
        return 'Create a 4-digit PIN for secure access';
      case 'confirm-mpin':
        return 'Re-enter your PIN to confirm';
      case 'enter-mpin':
        return 'Enter your 4-digit PIN';
      default:
        return 'Select your preferred way to access the app';
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{getStepTitle()}</Text>
          <Text style={styles.subtitle}>{getStepSubtitle()}</Text>
        </View>

        {step === 'choose' && (
          <View style={styles.content}>
            <View style={styles.options}>
              {biometricAvailable && (
                <TouchableOpacity 
                  style={[styles.optionCard, styles.biometricCard]} 
                  onPress={handleBiometric}
                  disabled={isAuthenticating}
                  activeOpacity={0.8}
              >
                <View style={styles.optionIcon}>
                  <Ionicons 
                    name={biometricType === 'Face ID' ? 'scan' : 'finger-print'} 
                    size={40} 
                    color="#4CAF50" 
                  />
                </View>
                <Text style={styles.optionTitle}>Use {biometricType}</Text>
                <Text style={styles.optionDescription}>
                  Quick and secure access with {biometricType.toLowerCase()}
                </Text>
                {isAuthenticating && (
                  <Text style={styles.authenticatingText}>Authenticating...</Text>
                )}
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.optionCard, styles.mpinCard]} 
              onPress={() => setStep('set-mpin')}
              activeOpacity={0.8}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="keypad" size={40} color="#FF9800" />
              </View>
              <Text style={styles.optionTitle}>Set MPIN</Text>
              <Text style={styles.optionDescription}>
                Create a 4-digit PIN for secure access
              </Text>
            </TouchableOpacity>
          </View>

          {!biometricAvailable && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#2196F3" />
              <Text style={styles.infoText}>
                Biometric authentication is not available on this device. You can use MPIN instead.
              </Text>
            </View>
          )}
        </View>
      )}

      {(step === 'set-mpin' || step === 'confirm-mpin' || step === 'enter-mpin') && (
        <View style={styles.content}>
          <View style={styles.mpinContainer}>
            {renderMpinDots()}
            {renderKeypad()}
          </View>
          
          {step !== 'enter-mpin' && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setStep('choose')}
            >
              <Text style={styles.backButtonText}>Back to Options</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
    
    <CustomLoader 
      visible={isAuthenticating} 
      text={step === 'choose' ? `Setting up ${biometricType}...` : 'Processing...'} 
      backgroundColor="rgba(0, 0, 0, 0.7)"
      color="#FFCE1B"
      textColor="#FFCE1B"
    />
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  options: {
    gap: 20,
    marginTop: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  biometricCard: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  mpinCard: {
    borderColor: '#FF9800',
    borderWidth: 1,
  },
  optionIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F8F9FA',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
  authenticatingText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 8,
    lineHeight: 20,
  },
  mpinContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  mpinDots: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 16,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    justifyContent: 'center',
    gap: 20,
  },
  key: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
  },
  backButton: {
    backgroundColor: '#6C757D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
