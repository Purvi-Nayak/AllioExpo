import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Text from "@/components/atoms/Text";
import RememberForgot from "@/components/molecule/RememberForget";
import SignInWithFacebook from "@/components/molecule/SocialSignInFacebook";
import SignInWithGoogle from "@/components/molecule/SocialSignInGoogle";
import { useResponsive } from "@/hooks/useResponsive";
import { Formik } from "formik";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import useStyle from "./style";
import { useLoginForm } from "./useLoginForm";

interface LoginFormProps {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLoading }) => {
  const styles = useStyle();
  const responsive = useResponsive();
  const {
    initialValues,
    loginValidationSchema,
    handleLogin,
    remember,
    setRemember,
    loading,
    navigateToRegister,
  } = useLoginForm();

  const onLoginSubmit = async (values: any) => {
    setLoading?.(true);
    await handleLogin(values);
    setLoading?.(false);
  };

  return (
    <View style={styles.formContainer}>
      {/* Removed Allio header/logo for web platform */}

      <Text
        style={[
          styles.title,
          responsive.mediaQuery({
            desktop: {
              textAlign: "center",
              marginBottom: responsive.spacing.md(),
            },
            mobile: {
              textAlign: "left",
              marginBottom: responsive.spacing.sm(),
              marginTop: responsive.spacing.lg(),
            },
          }),
        ]}
        type="bold"
      >
        {Platform.OS === "web" ? "Welcome Back" : "Login"}
      </Text>

      <Text
        style={[
          styles.subtitle,
          responsive.mediaQuery({
            desktop: { textAlign: "center" },
            mobile: { textAlign: "left" },
          }),
        ]}
        type="regular"
      >
        {Platform.OS === "web"
          ? "Sign in to access your account"
          : "Please sign in to continue"}
      </Text>

      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={onLoginSubmit}
        >
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <>
              <Input
                label="Email"
                placeholder="e.g., user@example.com"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={errors.password}
                touched={touched.password}
                secureTextEntry
              />

              <RememberForgot
                remember={remember}
                onCheckboxPress={setRemember}
              />

              <Button
                title="Sign In"
                onPress={handleSubmit as () => void}
                disabled={loading}
                loading={loading}
                style={[
                  styles.loginButton,
                  responsive.mediaQuery({
                    desktop: { height: responsive.layout.buttonHeight },
                    mobile: { height: 48 },
                  }),
                ]}
              />
            </>
          )}
        </Formik>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.socialSignInText}>Social Sign-In</Text>
        <View style={styles.line} />
      </View>

      <View
        style={[
          styles.SocialButtonStyle,
          responsive.mediaQuery({
            mobile: {
              flexDirection: "row" as const,
              gap: responsive.spacing.md(),
              justifyContent: "center",
              alignItems: "center",
            },
            tablet: {
              flexDirection: "row" as const,
              gap: responsive.spacing.md(),
              justifyContent: "center",
            },
            desktop: {
              flexDirection: "row" as const,
              gap: responsive.spacing.lg(),
              justifyContent: "center",
            },
          }),
        ]}
      >
        <SignInWithFacebook setLoading={setLoading ?? (() => {})} />
        <SignInWithGoogle setLoading={setLoading ?? (() => {})} />
      </View>

      <View style={styles.containerRow}>
        <Text style={styles.orText}>Don&apos;t have an account?</Text>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.signUpText} type="semibold">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;
