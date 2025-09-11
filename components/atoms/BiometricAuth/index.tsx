import CustomLoader from '@/components/atoms/CustomLoader';
import { BiometricHelper, BiometricInfo } from '@/utils/authHelpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BiometricAuthProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  onFallback?: () => void;
  promptMessage?: string;
  showFallback?: boolean;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onError,
  onFallback,
  promptMessage,
  showFallback = true,
}) => {
  const [biometricInfo, setBiometricInfo] = useState<BiometricInfo | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    setIsLoading(true);
    try {
      const info = await BiometricHelper.getBiometricInfo();
      setBiometricInfo(info);
      console.log('✅ Biometric info:', info);
    } catch (error) {
      console.error('❌ Error checking biometric availability:', error);
      onError('Error checking biometric availability');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticate = async () => {
    if (!biometricInfo?.isAvailable) {
      onError('Biometric authentication not available');
      return;
    }

    setIsAuthenticating(true);
    try {
      const result = await BiometricHelper.authenticate(
        promptMessage || `Authenticate with ${biometricInfo.type}`
      );

      if (result.success) {
        await BiometricHelper.saveAuthMethod('biometric');
        onSuccess();
      } else {
        onError('Authentication failed');
      }
    } catch (error) {
      onError('Authentication error occurred');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getBiometricIcon = () => {
    if (!biometricInfo) return 'scan';
    
    switch (biometricInfo.type) {
      case 'Face ID':
        return 'scan';
      case 'Fingerprint':
        return 'finger-print';
      case 'Iris':
        return 'eye';
      default:
        return 'shield-checkmark';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <CustomLoader 
          visible={true} 
          text="Checking biometric availability..." 
          backgroundColor="transparent"
          color="#FFCE1B"
          textColor="#333"
        />
      </View>
    );
  }

  if (!biometricInfo || !biometricInfo.isAvailable) {
    return (
      <View style={styles.container}>
        <View style={styles.unavailableContainer}>
          <Ionicons name="warning" size={48} color="#FF9800" />
          <Text style={styles.unavailableTitle}>Biometric Unavailable</Text>
          <Text style={styles.unavailableText}>
            {!biometricInfo?.hasHardware 
              ? 'This device does not support biometric authentication.'
              : 'No biometric credentials are enrolled on this device.'
            }
          </Text>
          {showFallback && onFallback && (
            <TouchableOpacity style={styles.fallbackButton} onPress={onFallback}>
              <Text style={styles.fallbackButtonText}>Use MPIN Instead</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getBiometricIcon()} 
              size={64} 
              color={isAuthenticating ? '#4CAF50' : '#2196F3'} 
            />
          </View>
          
          <Text style={styles.title}>
            {isAuthenticating ? 'Authenticating...' : `Use ${biometricInfo.type}`}
          </Text>
          
          <Text style={styles.subtitle}>
            {isAuthenticating 
              ? `Please provide your ${biometricInfo.type.toLowerCase()}`
              : `Touch the ${biometricInfo.type.toLowerCase()} sensor to continue`
            }
          </Text>

          <TouchableOpacity
            style={[styles.authButton, isAuthenticating && styles.authButtonDisabled]}
            onPress={handleAuthenticate}
            disabled={isAuthenticating}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={getBiometricIcon()} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.authButtonText}>
              {isAuthenticating ? 'Authenticating...' : `Authenticate with ${biometricInfo.type}`}
            </Text>
          </TouchableOpacity>

          {showFallback && onFallback && (
            <TouchableOpacity style={styles.fallbackButton} onPress={onFallback}>
              <Text style={styles.fallbackButtonText}>Use MPIN Instead</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <CustomLoader 
        visible={isAuthenticating} 
        text={`Authenticating with ${biometricInfo.type}...`} 
        backgroundColor="rgba(0, 0, 0, 0.7)"
        color="#FFCE1B"
        textColor="#FFCE1B"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6C757D',
  },
  authContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  authButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  authButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fallbackButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  fallbackButtonText: {
    color: '#6C757D',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  unavailableContainer: {
    alignItems: 'center',
    padding: 20,
  },
  unavailableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 16,
    marginBottom: 8,
  },
  unavailableText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});
