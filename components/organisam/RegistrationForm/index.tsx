// import useValidation from '@/utils/velidationSchema';
// import Button from '@components/atoms/Button';
// import Input from '@components/atoms/Input';
// import Text from '@components/atoms/Text';
// import { useRouter } from 'expo-router';
// import { Formik } from 'formik';
// import React from 'react';
// import { TouchableOpacity, View } from 'react-native';
// import useStyle from './style';

// // Initial form values
// const initialValues = {
//   firstName: '',
//   lastName: '',
//   email: '',
//   mobileNo: '',
//   password: '',
//   confirmPassword: '',
// };

// const RegistrationForm = () => {
//   const styles = useStyle();
//   const router = useRouter();
//   const { registrationValidationSchema } = useValidation();

//   const handleRegister = async (values: typeof initialValues) => {
//     try {
//       // Log all form data to console
//       console.log('=== REGISTRATION FORM SUBMISSION ===');
//       console.log('Registration Form Data:', values);
//       console.log('First Name:', values.firstName);
//       console.log('Last Name:', values.lastName);
//       console.log('Email:', values.email);
//       console.log('Mobile Number:', values.mobileNo);
//       console.log('Password:', values.password);
//       console.log('Confirm Password:', values.confirmPassword);
//       console.log('=====================================');

//       // Simulate API call delay
//       console.log('Sending registration request...');
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       console.log('Registration successful!');
//       console.log('Navigating to login screen...');

//       // Navigate to login screen
//       router.push('/(public)/login');
//     } catch (error) {
//       console.error('Registration Error:', error);
//     }
//   };

//   const navigateToLogin = () => {
//     console.log("User clicked 'Login' - navigating to login screen");
//     router.push('/(public)/login');
//   };

//   return (
//     <View style={styles.formContainer}>
//       <Text style={styles.title} type="bold">
//         Create Account
//       </Text>
//       <Text style={styles.subtitle}>Fill in the details below</Text>

//       <View style={styles.inputContainer}>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={registrationValidationSchema}
//           onSubmit={handleRegister}>
//           {({
//             handleChange,
//             handleSubmit,
//             values,
//             errors,
//             touched,
//             isSubmitting,
//           }) => (
//             <>
//               <Input
//                 label="First Name"
//                 placeholder="e.g., Ronak"
//                 value={values.firstName}
//                 onChangeText={handleChange('firstName')}
//                 error={touched.firstName ? errors.firstName : undefined}
//                 touched={touched.firstName}
//                 autoCapitalize="words"
//               />

//               <Input
//                 label="Last Name"
//                 placeholder="e.g., Gami"
//                 value={values.lastName}
//                 onChangeText={handleChange('lastName')}
//                 error={touched.lastName ? errors.lastName : undefined}
//                 touched={touched.lastName}
//                 autoCapitalize="words"
//               />

//               <Input
//                 label="Email"
//                 placeholder="e.g., Ronak.Gami@example.com"
//                 value={values.email}
//                 onChangeText={handleChange('email')}
//                 error={touched.email ? errors.email : undefined}
//                 touched={touched.email}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />

//               <Input
//                 label="Mobile Number"
//                 placeholder="e.g., 9876543210"
//                 value={values.mobileNo}
//                 onChangeText={handleChange('mobileNo')}
//                 error={touched.mobileNo ? errors.mobileNo : undefined}
//                 touched={touched.mobileNo}
//                 keyboardType="phone-pad"
//                 maxLength={10}
//               />

//               <Input
//                 label="Password"
//                 placeholder="Password@123"
//                 value={values.password}
//                 onChangeText={handleChange('password')}
//                 error={touched.password ? errors.password : undefined}
//                 touched={touched.password}
//                 secureTextEntry
//               />

//               <Input
//                 label="Confirm Password"
//                 placeholder="Re-enter your password"
//                 value={values.confirmPassword}
//                 onChangeText={handleChange('confirmPassword')}
//                 error={
//                   touched.confirmPassword ? errors.confirmPassword : undefined
//                 }
//                 touched={touched.confirmPassword}
//                 secureTextEntry
//               />

//               <Button
//                 title={isSubmitting ? 'Creating...' : 'Register'}
//                 onPress={handleSubmit as () => void}
//                 disabled={isSubmitting}
//                 loading={isSubmitting}
//                 style={styles.registerButton}
//               />
//             </>
//           )}
//         </Formik>
//       </View>

//       <View style={styles.dividerContainer}>
//         <Text style={styles.orText}>Already have an account?</Text>
//         <TouchableOpacity onPress={navigateToLogin}>
//           <Text style={styles.loginText} type="semibold">
//             Login
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default RegistrationForm;
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Web } from "@/components/atoms/ResponsiveComponent";
import Text from "@/components/atoms/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { Formik } from "formik";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import useStyle from "./style";
import useRegisterForm from "./useRegisterForm";

interface RegistrationFormProps {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ setLoading }) => {
  const styles = useStyle();
  const responsive = useResponsive();
  const {
    initialValues,
    registrationValidationSchema,
    handleRegister,
    loading,
    navigateToLogin,
  } = useRegisterForm();

  const onRegisterSubmit = async (values: any) => {
    setLoading?.(true);
    await handleRegister(values);
    setLoading?.(false);
  };

  return (
    <View style={styles.formContainer}>
      {/* Conditional logo display - larger on desktop, smaller on mobile */}
      <Web>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/Allio_logo.png")}
            style={styles.logo}
          />
        </View>
      </Web>

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
        Create Account
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
        Sign up to get started
      </Text>

      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={registrationValidationSchema}
          onSubmit={onRegisterSubmit}
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
                label="First Name"
                placeholder="Enter your first name"
                value={values.firstName}
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                error={errors.firstName}
                touched={touched.firstName}
                autoCapitalize="words"
              />

              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={values.lastName}
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                error={errors.lastName}
                touched={touched.lastName}
                autoCapitalize="words"
              />

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
                label="Mobile Number"
                placeholder="Enter your phone number"
                value={values.mobileNo}
                onChangeText={handleChange("mobileNo")}
                onBlur={handleBlur("mobileNo")}
                error={errors.mobileNo}
                touched={touched.mobileNo}
                keyboardType="phone-pad"
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

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                secureTextEntry
              />

              <Button
                title="Create Account"
                onPress={handleSubmit as () => void}
                disabled={loading}
                loading={loading}
                style={[
                  styles.registerButton,
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
        <Text style={styles.orText}>Already have an account?</Text>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.loginText} type="semibold">
            Log In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationForm;
