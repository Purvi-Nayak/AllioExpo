import { sendOtp, validateOtp } from "@/api";
import CustomLoader from "@/components/atoms/CustomLoader";
import { useTheme } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const theme = useTheme();

  // Get email from route params
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email;

  const keypadNumbers = [
    "1", "2", "3",
    "4", "5", "6", 
    "7", "8", "9",
    "", "0", "⌫"
  ];

  const handleKeypadPress = (value: string) => {
    if (value === "⌫") {
      setOtp(prev => prev.slice(0, -1));
    } else if (value !== "" && otp.length < 4) {
      const newOtp = otp + value;
      setOtp(newOtp);
      if (newOtp.length === 4) {
        setTimeout(() => handleValidateOtp(newOtp), 300);
      }
    }
  };

  const handleValidateOtp = async (otpValue: string) => {
    if (!email) {
      Alert.alert("Error", "Email not found. Please try again.");
      return;
    }

    try {
      setIsValidating(true);
      
      const response = await validateOtp({
        email,
        otp: otpValue
      });

      if (response.data?.status === "true") {
        // Navigate to existing setup MPIN screen
        router.push({
          pathname: "/setup-mpin",
          params: { email, isReset: "true" }
        });
      } else {
        Alert.alert("Error", response.data?.error || "Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (error) {
      console.error("Validate OTP error:", error);
      Alert.alert("Error", "Invalid OTP. Please try again.");
      setOtp("");
    } finally {
      setIsValidating(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Email not found. Please try again.");
      return;
    }

    try {
      setIsResending(true);
      
      const response = await sendOtp({ email });

      if (response.data?.status === "true") {
        Alert.alert("Success", "OTP resent successfully! Please check your email.");
        setOtp("");
      } else {
        Alert.alert("Error", response.data?.error || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton} 
          onPress={() => router.back()}
        >
          <Text 
            style={[
              styles.headerBackText, 
              { color: theme.text }
            ]}
          >
            ← Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text 
          style={[
            styles.title, 
            { color: theme.text }
          ]}
        >
          Verify OTP
        </Text>
        
        <Text 
          style={[
            styles.subtitle, 
            { color: theme.gray }
          ]}
        >
          We've sent a 4-digit OTP to {email}. Please enter it below.
        </Text>

        {/* OTP Dots */}
        <View style={styles.dotsContainer}>
          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index < otp.length 
                    ? theme.text
                    : "transparent",
                  borderColor: theme.text,
                  borderWidth: 2,
                }
              ]}
            />
          ))}
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          {keypadNumbers.map((number, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.keypadButton,
                {
                  backgroundColor: number === "" ? "transparent" : "transparent",
                  borderColor: theme.text,
                  borderWidth: number === "" ? 0 : 1,
                }
              ]}
              onPress={() => handleKeypadPress(number)}
              disabled={number === "" || isValidating}
            >
              <Text 
                style={[
                  styles.keypadText, 
                  { 
                    color: theme.text,
                    fontSize: number === "⌫" ? 20 : 24
                  }
                ]}
              >
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Resend OTP Button */}
        <TouchableOpacity 
          style={styles.resendButton} 
          onPress={handleResendOtp}
          disabled={isResending || isValidating}
        >
          <Text 
            style={[
              styles.resendText, 
              { color: theme.primary }
            ]}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </Text>
        </TouchableOpacity>
      </View>

      {(isValidating || isResending) && <CustomLoader visible={isValidating || isResending} />}
    </SafeAreaView>
  );
}
