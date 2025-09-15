import { sendOtp } from "@/api";
import { showError, showSuccess } from "@/utils/toastConfig";
import { useRouter } from "expo-router";
import { useState } from "react";

export type ForgotPasswordValues = { email: string };

const useForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const navigateToLogin = () => {
    console.log("🚀 Navigating from forgot password to login...");

    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(public)/login");
      }
    } catch (error) {
      router.navigate("/(public)/login");
    }
  };

  const handleForgotPassword = async (values: ForgotPasswordValues) => {
    const email = values.email.trim().toLowerCase();
    setLoading(true);
    try {
      if (!email) {
        showError("Please enter your email address.");
        return;
      }

      const response = await sendOtp({ email });

      if (response.data?.status === "true") {
        showSuccess("OTP sent successfully! Please check your email.");
        // Navigate to verify-otp screen with email parameter
        router.push({
          pathname: "/verify-otp",
          params: { email }
        });
      } else {
        showError(response.data?.error || "Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      showError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleForgotPassword, navigateToLogin };
};

export default useForgotPasswordForm;
