import { useTheme } from "@/constants/Colors";
import {
  saveAuthMethod,
  saveMPIN,
  setSecurityMethod
} from "@/redux/slices/AuthSlice";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

import { styles } from "./styles";

const SetupMPINScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [isLoading, setIsLoading] = useState(false);

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
      await saveMPIN(mpin);
      await saveAuthMethod("mpin");
      dispatch(setSecurityMethod("mpin"));
      
      // Auto-navigate to home page without alert
      router.replace("/(private)/(tabs)/home");
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
          {step === "enter" ? "Set Your MPIN" : "Confirm Your MPIN"}
        </Text>
        <Text style={[styles.subtitle, { color: theme.gray }]}>
          {step === "enter" 
            ? "Create a 4-digit PIN for secure access" 
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