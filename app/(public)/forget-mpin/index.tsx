import { sendOtp } from "@/api";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useTheme } from "@/constants/Colors";
import { RootState } from "@/redux/store";
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
  const { emailOnlyValidationSchema } = useValidation();

  const initialValues = {
    email: userData?.email || "",
  };

  const handleSendOtp = async (email: string) => {
    setLoading(true);
    try {
      const response = await sendOtp({ email: email.trim().toLowerCase() });

      if (response.data?.status === "true") {
        showSuccess("OTP sent successfully! Please check your email.");
        // Navigate to verify-otp screen with email parameter
        router.push({
          pathname: "/verify-otp",
          params: { email: email.trim().toLowerCase() }
        });
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBackButton}>
          <Text style={[styles.headerBackText, { color: theme.primary }]}>← Back</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Formik
          initialValues={initialValues}
          validationSchema={emailOnlyValidationSchema}
          onSubmit={(values) => handleSendOtp(values.email)}
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
      </View>
    </SafeAreaView>
  );
};

export default ForgetMPINScreen;
