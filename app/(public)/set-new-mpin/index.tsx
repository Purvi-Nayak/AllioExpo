import { setNewMpin } from "@/api";
import CustomLoader from "@/components/atoms/CustomLoader";
import { useTheme } from "@/constants/Colors";
import { encryptMPIN, updateUserAuthPreferencesByEmail } from "@/utils/helper";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface SetNewMpinProps {
  email?: string;
}

export default function SetNewMpin() {
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [isSettingMpin, setIsSettingMpin] = useState(false);
  const [step, setStep] = useState<"enter" | "confirm">("enter");
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
      if (step === "enter") {
        setMpin(prev => prev.slice(0, -1));
      } else {
        setConfirmMpin(prev => prev.slice(0, -1));
      }
    } else if (value !== "") {
      if (step === "enter") {
        if (mpin.length < 4) {
          const newMpin = mpin + value;
          setMpin(newMpin);
          if (newMpin.length === 4) {
            setTimeout(() => setStep("confirm"), 300);
          }
        }
      } else {
        if (confirmMpin.length < 4) {
          const newConfirmMpin = confirmMpin + value;
          setConfirmMpin(newConfirmMpin);
          if (newConfirmMpin.length === 4) {
            setTimeout(() => handleSetMpin(mpin, newConfirmMpin), 300);
          }
        }
      }
    }
  };

  const handleSetMpin = async (mpinValue: string, confirmMpinValue: string) => {
    if (mpinValue !== confirmMpinValue) {
      Alert.alert("Error", "MPIN doesn't match. Please try again.");
      setMpin("");
      setConfirmMpin("");
      setStep("enter");
      return;
    }

    try {
      setIsSettingMpin(true);

      if (!email) {
        Alert.alert("Error", "Email not found. Please try again.");
        return;
      }

      const encryptedMpin = encryptMPIN(mpinValue);
      
      const response = await setNewMpin({
        email,
        newMpin: encryptedMpin
      });

      if (response.data?.status === "true") {
        // Update Firestore to keep sync with encrypted MPIN
        try {
          await updateUserAuthPreferencesByEmail(email, {
            mpin: encryptedMpin, // Store encrypted in Firestore
            mpinSet: true,
            authMethod: "mpin"
          });
          console.log("Encrypted MPIN updated in Firestore via email");
        } catch (firestoreError) {
          console.error("Failed to update Firestore:", firestoreError);
          // Continue anyway since API succeeded
        }

        // Clear any auth data from Redux and secure storage
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
    } catch (error) {
      console.error("Set new MPIN error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSettingMpin(false);
    }
  };

  const handleBack = () => {
    if (step === "confirm") {
      setStep("enter");
      setConfirmMpin("");
    } else {
      router.back();
    }
  };

  const currentMpin = step === "enter" ? mpin : confirmMpin;
  const title = step === "enter" ? "Set New MPIN" : "Confirm MPIN";
  const subtitle = step === "enter" 
    ? "Create a new 4-digit MPIN for your account"
    : "Please confirm your new MPIN";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton} 
          onPress={handleBack}
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
          {title}
        </Text>
        
        <Text 
          style={[
            styles.subtitle, 
            { color: theme.gray }
          ]}
        >
          {subtitle}
        </Text>

        {/* MPIN Dots */}
        <View style={styles.dotsContainer}>
          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index < currentMpin.length 
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
              disabled={number === "" || isSettingMpin}
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
      </View>

      {isSettingMpin && <CustomLoader visible={isSettingMpin} />}
    </SafeAreaView>
  );
}
