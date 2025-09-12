import { useTheme } from "@/constants/Colors";
import {
    saveAuthMethod,
    setBiometricAvailability,
    setSecurityMethod
} from "@/redux/slices/AuthSlice";
import { RootState } from "@/redux/store";
import { updateUserAuthPreferences } from "@/utils/helper";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    Text,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { styles } from "./styles";

const AuthSetupScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { hasBiometric, userData } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const available = hasHardware && isEnrolled;
      dispatch(setBiometricAvailability(available));
    } catch (error) {
      console.error("Failed to check biometric availability:", error);
      dispatch(setBiometricAvailability(false));
    }
  };

  const handleBiometricSetup = async () => {
    if (!hasBiometric) {
      Alert.alert(
        "Biometric Not Available",
        "Please set up Face ID or fingerprint in your device settings first.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Set up biometric authentication for your account",
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
      });

      if (result.success) {
        dispatch(setSecurityMethod("biometric"));
        await saveAuthMethod("biometric");
        
        // Save to Firestore
        if (userData?.uid) {
          await updateUserAuthPreferences(userData.uid, {
            authMethod: "biometric",
            mpinSet: true, // User has completed auth setup
          });
          console.log("Biometric auth method saved to Firestore");
        }
        
        Alert.alert(
          "Success",
          "Biometric authentication has been set up successfully!",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(private)/(tabs)/home"),
            },
          ]
        );
      } else {
        Alert.alert("Setup Failed", "Biometric authentication setup was cancelled.");
      }
    } catch (error) {
      console.error("Biometric setup error:", error);
      Alert.alert("Error", "Failed to set up biometric authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMPINSetup = () => {
    router.push("/(public)/setup-mpin");
  };

  // if (isLoading) {
  //   return <CustomLoader />;
  // }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Secure Your Account
        </Text>
        <Text style={[styles.subtitle, { color: theme.gray }]}>
          Choose your preferred authentication method for quick and secure access
        </Text>

        <View style={styles.optionsContainer}>
          {hasBiometric && (
            <Pressable
              style={[styles.optionButton, { borderColor: theme.primary }]}
              onPress={handleBiometricSetup}
            >
              <Text style={[styles.optionIcon, { color: theme.primary }]}>
                👤
              </Text>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Biometric Authentication
              </Text>
              <Text style={[styles.optionDescription, { color: theme.gray }]}>
                Use Face ID or fingerprint for quick access
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.optionButton, { borderColor: theme.primary }]}
            onPress={handleMPINSetup}
          >
            <Text style={[styles.optionIcon, { color: theme.primary }]}>
              🔢
            </Text>
            <Text style={[styles.optionTitle, { color: theme.text }]}>
              MPIN Authentication
            </Text>
            <Text style={[styles.optionDescription, { color: theme.gray }]}>
              Set up a 4-digit PIN for secure access
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.note, { color: theme.gray }]}>
          You can change this setting later in your account preferences
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AuthSetupScreen;

// export default function AuthSetupScreen() {
//   const theme = useTheme();
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { hasBiometric } = useSelector((state: RootState) => state.auth);
//   const [isLoading, setIsLoading] = useState(false);

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: theme.background,
//       paddingHorizontal: 20,
//     },
//     content: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     title: {
//       fontSize: 28,
//       fontFamily: "Poppins-Bold",
//       color: theme.text,
//       textAlign: "center",
//       marginBottom: 12,
//     },
//     subtitle: {
//       fontSize: 16,
//       fontFamily: "Poppins-Regular",
//       color: theme.gray,
//       textAlign: "center",
//       marginBottom: 40,
//       lineHeight: 24,
//     },
//     optionContainer: {
//       width: "100%",
//       marginBottom: 16,
//     },
//     option: {
//       backgroundColor: theme.white,
//       borderRadius: 16,
//       padding: 20,
//       borderWidth: 2,
//       borderColor: theme.lightGray,
//       shadowColor: theme.black,
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.1,
//       shadowRadius: 8,
//       elevation: 4,
//     },
//     optionPressed: {
//       borderColor: theme.primary,
//       backgroundColor: theme.primary + "10",
//     },
//     optionTitle: {
//       fontSize: 18,
//       fontFamily: "Poppins-SemiBold",
//       color: theme.text,
//       marginBottom: 8,
//     },
//     optionDescription: {
//       fontSize: 14,
//       fontFamily: "Poppins-Regular",
//       color: theme.gray,
//       lineHeight: 20,
//     },
//     skipButton: {
//       marginTop: 24,
//       padding: 12,
//     },
//     skipText: {
//       fontSize: 16,
//       fontFamily: "Poppins-Medium",
//       color: theme.gray,
//       textAlign: "center",
//     },
//   });

//   const handleBiometricSetup = async () => {
//     if (isLoading) return;
    
//     setIsLoading(true);
//     try {
//       const result = await LocalAuthentication.authenticateAsync({
//         promptMessage: "Set up biometric authentication",
//         disableDeviceFallback: false,
//       });

//       if (result.success) {
//         dispatch(setSecurityMethod("biometric"));
//         await saveAuthMethod("biometric");
//         router.replace("/(private)/(tabs)/home");
//       } else {
//         Alert.alert("Setup Failed", "Biometric authentication setup was cancelled or failed.");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to set up biometric authentication.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleMPINSetup = () => {
//     if (isLoading) return;
//     router.push("/(public)/setup-mpin");
//   };

//   const handleSkip = async () => {
//     if (isLoading) return;
    
//     Alert.alert(
//       "Skip Security Setup?",
//       "You can set this up later in Settings. You'll be logged out each time you close the app.",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Skip",
//           style: "destructive",
//           onPress: () => router.replace("/(private)/(tabs)/home"),
//         },
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>Secure Your Account</Text>
//         <Text style={styles.subtitle}>
//           Choose how you'd like to secure your app for future logins
//         </Text>

//         {hasBiometric && (
//           <View style={styles.optionContainer}>
//             <Pressable
//               style={({ pressed }) => [
//                 styles.option,
//                 pressed && styles.optionPressed,
//               ]}
//               onPress={handleBiometricSetup}
//               disabled={isLoading}
//             >
//               <Text style={styles.optionTitle}>🔐 Biometric Authentication</Text>
//               <Text style={styles.optionDescription}>
//                 Use your fingerprint or Face ID for quick and secure access
//               </Text>
//             </Pressable>
//           </View>
//         )}

//         <View style={styles.optionContainer}>
//           <Pressable
//             style={({ pressed }) => [
//               styles.option,
//               pressed && styles.optionPressed,
//             ]}
//             onPress={handleMPINSetup}
//             disabled={isLoading}
//           >
//             <Text style={styles.optionTitle}>🔢 MPIN (4-Digit Code)</Text>
//             <Text style={styles.optionDescription}>
//               Create a 4-digit PIN for secure app access
//             </Text>
//           </Pressable>
//         </View>

//         <Pressable style={styles.skipButton} onPress={handleSkip} disabled={isLoading}>
//           <Text style={styles.skipText}>Skip for now</Text>
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// }