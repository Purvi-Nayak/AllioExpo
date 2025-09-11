import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

interface MPINInputProps {
  onComplete: (pin: string) => void;
  onBackspace?: () => void;
  title?: string;
  subtitle?: string;
  pinLength?: number;
  showKeypad?: boolean;
  currentPin?: string;
  error?: string;
}

export const MPINInput: React.FC<MPINInputProps> = ({
  onComplete,
  onBackspace,
  title = 'Enter MPIN',
  subtitle = 'Enter your 4-digit PIN',
  pinLength = 4,
  showKeypad = true,
  currentPin = '',
  error,
}) => {
  const [pin, setPin] = useState(currentPin);

  const handleInput = (digit: string) => {
    if (pin.length < pinLength) {
      const newPin = pin + digit;
      setPin(newPin);
      Vibration.vibrate(10);
      
      if (newPin.length === pinLength) {
        onComplete(newPin);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      const newPin = pin.slice(0, -1);
      setPin(newPin);
      Vibration.vibrate(10);
      onBackspace?.();
    }
  };

  const clearPin = () => {
    setPin('');
  };

  React.useEffect(() => {
    if (error) {
      clearPin();
    }
  }, [error]);

  React.useEffect(() => {
    setPin(currentPin);
  }, [currentPin]);

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[...Array(pinLength)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i < pin.length ? '#FFCE1B' : 'transparent',
              borderColor: error ? '#F44336' : i < pin.length ? '#FFCE1B' : '#E0E0E0',
            },
          ]}
        />
      ))}
    </View>
  );

  const renderKeypad = () => (
    <View style={styles.keypad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <TouchableOpacity
          key={digit}
          style={styles.key}
          onPress={() => handleInput(digit.toString())}
          activeOpacity={0.7}
        >
          <Text style={styles.keyText}>{digit}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.key} />
      <TouchableOpacity
        style={styles.key}
        onPress={() => handleInput('0')}
        activeOpacity={0.7}
      >
        <Text style={styles.keyText}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.key}
        onPress={handleBackspace}
        activeOpacity={0.7}
      >
        <Ionicons name="backspace-outline" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      {renderDots()}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {showKeypad && renderKeypad()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
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
});
