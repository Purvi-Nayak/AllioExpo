import { setNewMpin } from "@/api";
import { useTheme } from "@/constants/Colors";
import {
  saveAuthMethod,
  saveMPIN,
  setSecurityMethod
} from "@/redux/slices/AuthSlice";
import { RootState } from "@/redux/store";
import { encryptMPIN, updateUserAuthPreferences, updateUserAuthPreferencesByEmail } from "@/utils/helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { styles } from "./styles";

const SetupMPINScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.auth);
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [isLoading, setIsLoading] = useState(false);

  // Get params to check if this is a reset flow
  const params = useLocalSearchParams<{ email?: string; isReset?: string }>();
  const isResetFlow = params.isReset === "true";
  const email = params.email;

  const handleDigitPress = (digit: string) => {
    if (step === "enter") {
      if (mpin.length < 4) {
        setMpin(prev => prev + digit);
      }
    } else {
      if (confirmMpin.length < 4) {
        const newConfirmMpin = confirmMpin + digit;
        setConfirmMpin(newConfirmMpin);
        
        // Auto-submit when 4 digits are entered in confirm step
        if (newConfirmMpin.length === 4) {
          handleMPINSetup(newConfirmMpin);
        }
      }
    }
  };

  const handleDeletePress = () => {
    if (step === "enter") {
      setMpin(prev => prev.slice(0, -1));
    } else {
      setConfirmMpin(prev => prev.slice(0, -1));
    }
  };

  const handleContinue = () => {
    if (step === "enter" && mpin.length === 4) {
      setStep("confirm");
    } else if (step === "confirm" && confirmMpin.length === 4) {
      handleMPINSetup();
    }
  };

  const handleMPINSetup = async (confirmPin?: string) => {
    const finalConfirmMpin = confirmPin || confirmMpin;
    
    if (mpin !== finalConfirmMpin) {
      Alert.alert("Error", "PINs do not match. Please try again.");
      setConfirmMpin("");
      return;
    }

    setIsLoading(true);
    try {
      // Encrypt MPIN before saving
      const encryptedMPIN = encryptMPIN(mpin);
      
      if (isResetFlow && email) {
        // Reset flow: Call API to update MPIN and update Firestore by email
        const response = await setNewMpin({
          email,
          newMpin: encryptedMPIN
        });

        if (response.data?.status === "true") {
          // Update Firestore by email for reset flow
          await updateUserAuthPreferencesByEmail(email, {
            mpin: encryptedMPIN,
            mpinSet: true,
            authMethod: "mpin"
          });
          
          // Clear any existing auth data since this is a reset
          const { clearAuthData } = await import("@/redux/slices/AuthSlice");
          await clearAuthData();

          Alert.alert(
            "Success", 
            "Your MPIN has been updated successfully!", 
            [
              {
                text: "OK",
                onPress: () => {
                  router.replace("/login");
                }
              }
            ]
          );
        } else {
          Alert.alert("Error", response.data?.message || response.data?.error || "Failed to update MPIN. Please try again.");
        }
      } else {
        // Normal setup flow: Save to local storage and current user's Firestore
        await saveMPIN(encryptedMPIN);
        await saveAuthMethod("mpin");
        dispatch(setSecurityMethod("mpin"));
        
        // Save encrypted MPIN to Firestore for current user
        if (userData?.uid) {
          await updateUserAuthPreferences(userData.uid, {
            mpin: encryptedMPIN,
            mpinSet: true,
            authMethod: "mpin",
          });
          console.log("Encrypted MPIN saved to Firestore");
        }
        
        // Auto-navigate to home page without alert
        router.replace("/(private)/(tabs)/home");
      }
    } catch (error) {
      console.error("MPIN setup error:", error);
      Alert.alert("Error", "Failed to set up MPIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (step === "confirm") {
      setStep("enter");
      setConfirmMpin("");
    } else {
      router.back();
    }
  };

  const renderDots = (value: string) => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: value.length > index ? theme.primary : theme.lightGray,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
    
    return (
      <View style={styles.keypad}>
        {digits.map((digit, index) => (
          <Pressable
            key={index}
            style={[
              styles.keypadButton,
              {
                backgroundColor: digit === "" ? "transparent" : theme.white,
                borderColor: theme.lightGray,
              },
            ]}
            onPress={() => {
              if (digit === "⌫") {
                handleDeletePress();
              } else if (digit !== "") {
                handleDigitPress(digit);
              }
            }}
            disabled={digit === ""}
          >
            <Text style={[
              styles.keypadText, 
              { 
                color: digit === "⌫" ? theme.gray : theme.text,
                fontSize: digit === "⌫" ? 20 : 24,
              }
            ]}>
              {digit}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  // if (isLoading) {
  //   return <CustomLoader />;
  // }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          {step === "enter" 
            ? (isResetFlow ? "Set New MPIN" : "Set Your MPIN")
            : "Confirm Your MPIN"
          }
        </Text>
        <Text style={[styles.subtitle, { color: theme.gray }]}>
          {step === "enter" 
            ? (isResetFlow 
                ? "Create a new 4-digit PIN for your account" 
                : "Create a 4-digit PIN for secure access"
              )
            : "Enter your PIN again to confirm"
          }
        </Text>

        {renderDots(step === "enter" ? mpin : confirmMpin)}
        {renderKeypad()}

        {(step === "enter" && mpin.length === 4) && (
          <Pressable
            style={[styles.continueButton, { backgroundColor: theme.primary }]}
            onPress={handleContinue}
          >
            <Text style={[styles.continueText, { color: theme.white }]}>
              Continue
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SetupMPINScreen;