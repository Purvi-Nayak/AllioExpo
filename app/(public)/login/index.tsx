import { Button, Input, Text } from "@/components/index";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStyle from "./style";

interface FormErrors {
  email?: string;
  password?: string;
}

interface FormTouched {
  email?: boolean;
  password?: boolean;
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  const router = useRouter();
  const styles = useStyle();

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    // Clear error when user starts typing
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // Handle input blur
  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
  };

  const handleLogin = async () => {
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Basic validation
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Advanced validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual login API call
      console.log("Login called with:", { email, password });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // How to manage private stack if login done than go in private stack
      router.replace("/(private)/(tabs)/home");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            onBlur={handleEmailBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            touched={touched.email}
          />

          {/* Password Input */}
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={handlePasswordBlur}
            secureTextEntry
            error={errors.password}
            touched={touched.password}
          />

          {/* Login Button */}
          <Button
            title={isLoading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
          />

          {/* Links */}
          <View style={styles.linkContainer}>
            <Link href="/(public)/forgetpassword" style={styles.link}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </Link>

            <Link push href="/(public)/register" style={styles.link}>
              <Text style={styles.linkText}>
                Don't have an account? Register
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
