import { useNavigation, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useStyle from "./style";
export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const styles = useStyle();
  const navigation = useNavigation();
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual register API call
      console.log("Register called");
      router.push("/(public)/login");
    } finally {
      setIsLoading(false);
    }
  };
  const onLoginPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "login as never" }],
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Creating Account..." : "Register"}
        </Text>
      </TouchableOpacity>
      <Pressable onPress={onLoginPress} style={styles.link}>
        <Text>Already have an account? Login</Text>
      </Pressable>
      {/* <Link replace href="/(public)/login" style={styles.link}>
        Already have an account? Login
      </Link> */}
    </View>
  );
}
