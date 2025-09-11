import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export interface BiometricInfo {
  isAvailable: boolean;
  type: string;
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
}

export class BiometricHelper {
  /**
   * Check biometric availability and capabilities
   */
  static async getBiometricInfo(): Promise<BiometricInfo> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      let type = 'Biometric';
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        type = 'Face ID';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        type = 'Fingerprint';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        type = 'Iris';
      }
      
      return {
        isAvailable: hasHardware && isEnrolled,
        type,
        hasHardware,
        isEnrolled,
        supportedTypes,
      };
    } catch (error) {
      console.error('Error checking biometric info:', error);
      return {
        isAvailable: false,
        type: 'None',
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
      };
    }
  }

  /**
   * Authenticate using biometric
   */
  static async authenticate(promptMessage?: string): Promise<LocalAuthentication.LocalAuthenticationResult> {
    try {
      const biometricInfo = await this.getBiometricInfo();
      
      if (!biometricInfo.isAvailable) {
        return {
          success: false,
          error: 'not_available' as LocalAuthentication.LocalAuthenticationError,
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || `Authenticate with ${biometricInfo.type}`,
        fallbackLabel: 'Use MPIN',
        disableDeviceFallback: true,
        cancelLabel: 'Cancel',
      });

      return result;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'authentication_failed' as LocalAuthentication.LocalAuthenticationError,
      };
    }
  }

  /**
   * Save authentication method preference
   */
  static async saveAuthMethod(method: 'biometric' | 'mpin'): Promise<void> {
    try {
      await SecureStore.setItemAsync('auth_method', method);
    } catch (error) {
      console.error('Error saving auth method:', error);
      throw error;
    }
  }

  /**
   * Get saved authentication method
   */
  static async getAuthMethod(): Promise<'biometric' | 'mpin' | null> {
    try {
      const method = await SecureStore.getItemAsync('auth_method');
      return method as 'biometric' | 'mpin' | null;
    } catch (error) {
      console.error('Error getting auth method:', error);
      return null;
    }
  }

  /**
   * Check if user has completed auth setup
   */
  static async hasAuthSetup(): Promise<boolean> {
    try {
      const authMethod = await this.getAuthMethod();
      return authMethod !== null;
    } catch (error) {
      console.error('Error checking auth setup:', error);
      return false;
    }
  }

  /**
   * Clear all authentication data
   */
  static async clearAuthData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('auth_method');
      await SecureStore.deleteItemAsync('user_mpin');
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  }
}

export class MPINHelper {
  /**
   * Save MPIN securely
   */
  static async saveMPIN(pin: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('user_mpin', pin);
    } catch (error) {
      console.error('Error saving MPIN:', error);
      throw error;
    }
  }

  /**
   * Verify MPIN
   */
  static async verifyMPIN(pin: string): Promise<boolean> {
    try {
      const storedMPIN = await SecureStore.getItemAsync('user_mpin');
      return storedMPIN === pin;
    } catch (error) {
      console.error('Error verifying MPIN:', error);
      return false;
    }
  }

  /**
   * Check if MPIN exists
   */
  static async hasMPIN(): Promise<boolean> {
    try {
      const mpin = await SecureStore.getItemAsync('user_mpin');
      return mpin !== null;
    } catch (error) {
      console.error('Error checking MPIN:', error);
      return false;
    }
  }

  /**
   * Delete MPIN
   */
  static async deleteMPIN(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('user_mpin');
    } catch (error) {
      console.error('Error deleting MPIN:', error);
      throw error;
    }
  }

  /**
   * Validate MPIN format
   */
  static validateMPIN(pin: string): { isValid: boolean; error?: string } {
    if (!pin) {
      return { isValid: false, error: 'MPIN is required' };
    }
    
    if (pin.length !== 4) {
      return { isValid: false, error: 'MPIN must be 4 digits' };
    }
    
    if (!/^\d{4}$/.test(pin)) {
      return { isValid: false, error: 'MPIN must contain only numbers' };
    }
    
    // Check for sequential numbers
    if (pin === '1234' || pin === '4321' || pin === '0123') {
      return { isValid: false, error: 'MPIN cannot be sequential' };
    }
    
    // Check for repeated numbers
    if (pin === '0000' || pin === '1111' || pin === '2222' || 
        pin === '3333' || pin === '4444' || pin === '5555' || 
        pin === '6666' || pin === '7777' || pin === '8888' || 
        pin === '9999') {
      return { isValid: false, error: 'MPIN cannot be all same digits' };
    }
    
    return { isValid: true };
  }
}
