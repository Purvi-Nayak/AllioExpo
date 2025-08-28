import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import useStyle from "./style";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const styles = useStyle();

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual forgot password API call
      const response = await fetch("YOUR_API_ENDPOINT/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert(
          "Success",
          "Password reset instructions sent to your email",
          [{ text: "OK", onPress: () => router.replace("/(public)/login") }]
        );
      } else {
        Alert.alert("Error", "Failed to send reset instructions");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your
        password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleForgotPassword}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Sending..." : "Send Reset Instructions"}
        </Text>
      </TouchableOpacity>

      <Link replace href="/(public)/login" style={styles.link}>
        Back to Login
      </Link>
    </View>
  );
}
