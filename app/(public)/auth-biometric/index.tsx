import { useTheme } from "@/constants/Colors";
import { authenticateWithBiometric } from "@/redux/slices/AuthSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    Text,
    View,
} from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";

const AuthBiometricScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { userData, hasBiometric } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Auto-trigger biometric authentication when screen loads
    handleBiometricAuth();
  }, []);

  const handleBiometricAuth = async () => {
    if (!hasBiometric) {
      Alert.alert(
        "Biometric Not Available",
        "Biometric authentication is not available on this device.",
        [
          {
            text: "Use MPIN",
            onPress: () => router.replace("/(public)/auth-mpin"),
          },
        ]
      );
      return;
    }

    setIsLoading(true);
    try {
      const isAuthenticated = await authenticateWithBiometric();
      
      if (isAuthenticated) {
        router.replace("/(private)/(tabs)/home");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          Alert.alert(
            "Too Many Failed Attempts",
            "Please use your MPIN to access your account.",
            [
              {
                text: "Use MPIN",
                onPress: () => router.replace("/(public)/auth-mpin"),
              },
              {
                text: "Logout",
                onPress: () => router.replace("/(public)/login"),
                style: "destructive",
              },
            ]
          );
        } else {
          Alert.alert(
            "Authentication Failed",
            "Biometric authentication was not successful. Please try again.",
            [
              {
                text: "Try Again",
                onPress: () => handleBiometricAuth(),
              },
              {
                text: "Use MPIN",
                onPress: () => router.replace("/(public)/auth-mpin"),
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      Alert.alert(
        "Authentication Error",
        "An error occurred during biometric authentication.",
        [
          {
            text: "Use MPIN",
            onPress: () => router.replace("/(public)/auth-mpin"),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMPIN = () => {
    router.replace("/(public)/auth-mpin");
  };

//   if (isLoading) {
//     return <CustomLoader />;
//   }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: theme.text }]}>
            Welcome back
          </Text>
          {userData?.firstName && (
            <Text style={[styles.nameText, { color: theme.primary }]}>
              {userData.firstName}
            </Text>
          )}
        </View>

        <View style={styles.biometricContainer}>
          <View style={[styles.biometricIcon, { borderColor: theme.primary }]}>
            <Text style={[styles.biometricEmoji, { color: theme.primary }]}>
              👤
            </Text>
          </View>
          
          <Text style={[styles.title, { color: theme.text }]}>
            Biometric Authentication
          </Text>
          <Text style={[styles.subtitle, { color: theme.gray }]}>
            Use your fingerprint or Face ID to access your account securely
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={handleBiometricAuth}
          >
            <Text style={[styles.retryText, { color: theme.white }]}>
              Try Again
            </Text>
          </Pressable>

          <Pressable style={styles.mpinButton} onPress={handleUseMPIN}>
            <Text style={[styles.mpinText, { color: theme.primary }]}>
              Use MPIN Instead
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthBiometricScreen;
