import api from "@/api";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useTheme } from "@/constants/Colors";
import { RootState } from "@/redux/store";
import { encryptMPIN, updateUserAuthPreferencesByEmail } from "@/utils/helper";
import { showError, showSuccess } from "@/utils/toastConfig";
import useValidation from "@/utils/velidationSchema";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
    Pressable,
    SafeAreaView,
    Text,
    View
} from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";


const ForgetMPINScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "newmpin">("email");
  const [otp, setOtp] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [userEmail, setUserEmail] = useState(userData?.email || "");
  const { emailOnlyValidationSchema } = useValidation();

  const initialValues = {
    email: userData?.email || "",
  };

  const sendOtp = async (email: string) => {
    setLoading(true);
    try {
      const response = await api.MPIN.sendOtp({
        data: { email: email.trim().toLowerCase() }
      });

      if (response.data?.status === "true") {
        setUserEmail(email);
        showSuccess("OTP sent successfully! Please check your email.");
        setStep("otp");
        console.log("OTP sent to:", email);
      } else {
        showError(response.data?.message || "Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      showError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = async (otpCode: string) => {
    setLoading(true);
    try {
      const response = await api.MPIN.validateOtp({
        data: { 
          email: userEmail,
          otp: otpCode
        }
      });

      if (response.data?.status === "true") {
        showSuccess("OTP verified successfully!");
        setStep("newmpin");
      } else {
        showError(response.data?.error || "Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (error: any) {
      console.error("Error validating OTP:", error);
      showError("Invalid OTP. Please try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const setNewMpinApi = async () => {
    if (newMpin !== confirmMpin) {
      showError("MPIN does not match. Please try again.");
      return;
    }

    if (newMpin.length !== 4) {
      showError("MPIN must be 4 digits.");
      return;
    }

    setLoading(true);
    try {
      // Encrypt MPIN before sending to API and storing in Firestore
      const encryptedMPIN = encryptMPIN(newMpin);
      
      const response = await api.MPIN.setNewMpin({
        data: { 
          email: userEmail,
          newMpin: newMpin // API might expect plain text
        }
      });
      
      if (response.data?.status === "true") {
        // Update Firestore to keep sync with encrypted MPIN
        try {
          await updateUserAuthPreferencesByEmail(userEmail, {
            mpin: encryptedMPIN, // Store encrypted in Firestore
            mpinSet: true,
            authMethod: "mpin"
          });
          console.log("Encrypted MPIN updated in Firestore via email");
        } catch (firestoreError) {
          console.error("Failed to update Firestore:", firestoreError);
          // Continue anyway since API succeeded
        }
        
        // Clear local storage
        const { clearAuthData } = await import("@/redux/slices/AuthSlice");
        await clearAuthData();
        
        showSuccess("MPIN reset successfully! Please login again.");
        
        setTimeout(() => {
          router.replace("/(public)/login");
        }, 2000);
      } else {
        showError(response.data?.error || "Failed to set new MPIN. Please try again.");
      }
    } catch (error: any) {
      console.error("Error setting new MPIN:", error);
      showError("Failed to set new MPIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <Formik
      initialValues={initialValues}
      validationSchema={emailOnlyValidationSchema}
      onSubmit={(values) => sendOtp(values.email)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: theme.text }]}>
            Reset Your MPIN
          </Text>
          <Text style={[styles.subtitle, { color: theme.gray }]}>
            Enter your email address to receive an OTP for MPIN reset.
          </Text>

          <Input
            label="Email Address"
            placeholder="Enter your email address"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email && errors.email ? String(errors.email) : undefined}
            editable={!userData?.email}
          />

          <Button
            title="Send OTP"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />

          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={[styles.backText, { color: theme.primary }]}>
              Back to MPIN Authentication
            </Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );

  const renderOtpStep = () => (
    <View style={styles.formContainer}>
      <Text style={[styles.title, { color: theme.text }]}>
        Enter OTP
      </Text>
      <Text style={[styles.subtitle, { color: theme.gray }]}>
        We've sent a 6-digit OTP to {userEmail}. Please enter it below.
      </Text>

      <Input
        label="OTP"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <Button
        title="Verify OTP"
        onPress={() => validateOtp(otp)}
        loading={loading}
        disabled={otp.length !== 6}
        style={styles.submitButton}
      />

      <Pressable 
        style={styles.resendButton} 
        onPress={() => sendOtp(userEmail)}
        disabled={loading}
      >
        <Text style={[styles.resendText, { color: theme.primary }]}>
          Resend OTP
        </Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => setStep("email")}>
        <Text style={[styles.backText, { color: theme.gray }]}>
          Change Email Address
        </Text>
      </Pressable>
    </View>
  );

  const renderNewMpinStep = () => (
    <View style={styles.formContainer}>
      <Text style={[styles.title, { color: theme.text }]}>
        Set New MPIN
      </Text>
      <Text style={[styles.subtitle, { color: theme.gray }]}>
        Create a new 4-digit MPIN for your account.
      </Text>

      <Input
        label="New MPIN"
        placeholder="Enter 4-digit MPIN"
        value={newMpin}
        onChangeText={setNewMpin}
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
      />

      <Input
        label="Confirm MPIN"
        placeholder="Confirm 4-digit MPIN"
        value={confirmMpin}
        onChangeText={setConfirmMpin}
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
      />

      <Button
        title="Set New MPIN"
        onPress={setNewMpinApi}
        loading={loading}
        disabled={newMpin.length !== 4 || confirmMpin.length !== 4}
        style={styles.submitButton}
      />

      <Pressable style={styles.backButton} onPress={() => setStep("otp")}>
        <Text style={[styles.backText, { color: theme.gray }]}>
          Back to OTP
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBackButton}>
          <Text style={[styles.headerBackText, { color: theme.primary }]}>← Back</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {step === "email" && renderEmailStep()}
        {step === "otp" && renderOtpStep()}
        {step === "newmpin" && renderNewMpinStep()}
      </View>
    </SafeAreaView>
  );
};

export default ForgetMPINScreen;
