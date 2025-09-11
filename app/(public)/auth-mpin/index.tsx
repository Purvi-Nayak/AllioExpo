import { useTheme } from "@/constants/Colors";
import { verifyMPIN } from "@/redux/slices/AuthSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    Text,
    View,
} from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";

const AuthMPINScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.auth);
  const [mpin, setMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleDigitPress = (digit: string) => {
    if (mpin.length < 4) {
      const newMpin = mpin + digit;
      setMpin(newMpin);
      
      // Auto-verify when 4 digits are entered
      if (newMpin.length === 4) {
        handleVerifyMPIN(newMpin);
      }
    }
  };

  const handleDeletePress = () => {
    setMpin(prev => prev.slice(0, -1));
  };

  const handleVerifyMPIN = async (inputMpin: string) => {
    setIsLoading(true);
    try {
      const isValid = await verifyMPIN(inputMpin);
      
      if (isValid) {
        router.replace("/(private)/(tabs)/home");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          Alert.alert(
            "Too Many Attempts", 
            "Please use biometric authentication or contact support.",
            [
              {
                text: "Use Biometric",
                onPress: () => router.replace("/(public)/auth-biometric"),
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
            "Incorrect MPIN",
            `Please try again. ${3 - newAttempts} attempts remaining.`
          );
        }
        setMpin("");
      }
    } catch (error) {
      console.error("MPIN verification error:", error);
      Alert.alert("Error", "Failed to verify MPIN. Please try again.");
      setMpin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotMPIN = () => {
    Alert.alert(
      "Reset MPIN",
      "To reset your MPIN, please use biometric authentication or logout and login again.",
      [
        {
          text: "Use Biometric",
          onPress: () => router.replace("/(public)/auth-biometric"),
        },
        {
          text: "Logout",
          onPress: () => router.replace("/(public)/login"),
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: mpin.length > index ? theme.primary : theme.lightGray,
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
            disabled={digit === "" || isLoading}
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

//   if (isLoading) {
//     return <CustomLoader  />;
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

        <Text style={[styles.title, { color: theme.text }]}>
          Enter Your MPIN
        </Text>
        <Text style={[styles.subtitle, { color: theme.gray }]}>
          Enter your 4-digit PIN to access your account
        </Text>

        {renderDots()}
        {renderKeypad()}

        <Pressable style={styles.forgotButton} onPress={handleForgotMPIN}>
          <Text style={[styles.forgotText, { color: theme.primary }]}>
            Forgot MPIN?
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AuthMPINScreen;
