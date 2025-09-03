// import { Formik, FormikProps } from 'formik';
// import React, { useRef } from 'react';
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import Button from '@components/atoms/Button';
// import Input from '@components/atoms/Input';
// import Text from '@components/atoms/Text';

// import useValidation from '@/utils/velidationSchema';
// import { useRouter } from 'expo-router';
// import useStyle from './style';
// import { useForgotPassword } from './useForgetpassForm';

// const ForgotPasswordForm: React.FC = () => {
//   const { forgotPasswordSchema } = useValidation();
//   const style = useStyle();
//   const router = useRouter();

//   const formikRef = useRef<FormikProps<{ email: string }>>(undefined);

//   const { handleForgotPassword, navigateToLogin, loading } = useForgotPassword({
//     onNavigateToLogin: () => {
//       formikRef.current?.resetForm();
//     },
//   });

//   return (
//     <KeyboardAvoidingView
//       style={style.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <ScrollView
//         contentContainerStyle={style.scrollView}
//         keyboardShouldPersistTaps="handled">
//         <Formik
//           initialValues={{ email: '' }}
//           validationSchema={forgotPasswordSchema}
//           onSubmit={handleForgotPassword}>
//           {({ handleChange, handleSubmit, values, errors, touched }) => (
//             <View style={style.form}>
//               <Text style={style.title}  type="bold" >
//                 Forgot Password
//               </Text>
//               <Text style={style.subtitle}  >
//                 Enter your email to receive a password reset link
//               </Text>
//               <Input
//                 placeholder="email"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 value={values.email}
//                 onChangeText={handleChange('email')}
//                 error={touched.email ? errors.email : ''}
//               />
//               <Button
//                 loading={loading}
//                 disabled={loading}
//                 title="Send Reset Link"
//                 onPress={handleSubmit as () => void}
//               />
//             </View>
//           )}
//         </Formik>

//         <View style={style.dividerContainer}>
//         <Text  style={style.orText} >
//           Don't have an account?
//         </Text>
//         <TouchableOpacity onPress={() => router.push('/(public)/register')}>
//           <Text style={style.signUpText}  type="semibold">
//             Sign Up
//           </Text>
//         </TouchableOpacity>
//       </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default ForgotPasswordForm;
// import useValidation from "@/utils/velidationSchema";
// import Button from "@components/atoms/Button";
// import Input from "@components/atoms/Input";
// import Text from "@components/atoms/Text";
// import { useRouter } from "expo-router";
// import { Formik } from "formik";
// import React from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import useStyle from "./style";

// // Initial form values
// const initialValues = {
//   email: "",
// };

// const ForgotPasswordForm: React.FC = () => {
//   const { forgotPasswordSchema } = useValidation();

//   const router = useRouter();
//   const styles = useStyle();
//   const handleForgotPassword = async (values: typeof initialValues) => {
//     try {
//       // Log all form data to console
//       console.log("=== FORGOT PASSWORD FORM SUBMISSION ===");
//       console.log("Forgot Password Form Data:", values);
//       console.log("Email:", values.email);
//       console.log("=======================================");

//       // Simulate API call delay
//       console.log("Sending password reset request...");
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       console.log("Password reset link sent successfully!");
//       console.log("Navigating to login screen...");

//       // Navigate to login screen
//       router.push("/(public)/login");
//     } catch (error) {
//       console.error("Forgot Password Error:", error);
//     }
//   };

//   const navigateToRegister = () => {
//     console.log("User clicked 'Sign Up' - navigating to register screen");
//     router.push("/(public)/register");
//   };

//   const navigateToLogin = () => {
//     console.log("User clicked 'Back to Login' - navigating to login screen");
//     router.push("/(public)/login");
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView style={styles.scrollView}>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={forgotPasswordSchema}
//           onSubmit={handleForgotPassword}
//         >
//           {({
//             handleChange,
//             handleSubmit,
//             values,
//             errors,
//             touched,
//             isSubmitting,
//           }) => (
//             <>
//             <View style={styles.form} >
//               <Text style={styles.title} type="bold">
//                 Forgot Password
//               </Text>
//               <Text style={styles.subtitle}>
//                 Enter your email to receive a password reset link
//               </Text>
//               <Input
//                 label="Email"
//                 placeholder="e.g., john.doe@example.com"
//                 value={values.email}
//                 onChangeText={handleChange("email")}
//                 error={touched.email ? errors.email : undefined}
//                 touched={touched.email}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />

//               <Button
//                 title={isSubmitting ? "Sending..." : "Send Reset Link"}
//                 onPress={handleSubmit as () => void}
//                 disabled={isSubmitting}
//                 loading={isSubmitting}
//               />
//             </View>
//             </>
//           )}

//         </Formik>
//       </ScrollView>

//       <View style={styles.dividerContainer}>
//         <TouchableOpacity onPress={navigateToLogin}>
//           <Text style={styles.loginText} type="semibold">
//             Back to Login
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default ForgotPasswordForm;
import useValidation from "@/utils/velidationSchema";
import Button from "@components/atoms/Button";
import Input from "@components/atoms/Input";
import Text from "@components/atoms/Text";
import { Formik } from "formik";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import useStyle from "./style";
import useForgotPasswordForm from "./useForgetpassForm";

// Define the type for form values
type ForgotPasswordValues = {
  email: string;
};

const initialValues: ForgotPasswordValues = { email: "" };

const ForgotPasswordForm: React.FC = () => {
  const styles = useStyle();
  const { forgotPasswordSchema } = useValidation();
  const { handleForgotPassword, navigateToLogin, loading } =
    useForgotPasswordForm();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView}>
        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <Text style={styles.title} type="bold">
                Forgot Password
              </Text>
              <Text style={styles.subtitle}>
                Enter your email to receive a password reset link
              </Text>
              <Input
                label="Email"
                placeholder="e.g., john.doe@example.com"
                value={values.email}
                onChangeText={handleChange("email")}
                error={touched.email ? errors.email : undefined}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Button
                title={loading ? "Sending..." : "Send Reset Link"}
                onPress={handleSubmit as () => void}
                disabled={loading}
                loading={loading}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
      <View style={styles.dividerContainer}>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.loginText} type="semibold">
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordForm;
