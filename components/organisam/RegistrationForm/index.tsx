import useValidation from '@/utils/velidationSchema';
import Button from '@components/atoms/Button';
import Input from '@components/atoms/Input';
import Text from '@components/atoms/Text';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import useStyle from './style';

// Initial form values
const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  mobileNo: '',
  password: '',
  confirmPassword: '',
};

const RegistrationForm = () => {
  const styles = useStyle();
  const router = useRouter();
  const { registrationValidationSchema } = useValidation();

  const handleRegister = async (values: typeof initialValues) => {
    try {
      // Log all form data to console
      console.log('=== REGISTRATION FORM SUBMISSION ===');
      console.log('Registration Form Data:', values);
      console.log('First Name:', values.firstName);
      console.log('Last Name:', values.lastName);
      console.log('Email:', values.email);
      console.log('Mobile Number:', values.mobileNo);
      console.log('Password:', values.password);
      console.log('Confirm Password:', values.confirmPassword);
      console.log('=====================================');

      // Simulate API call delay
      console.log('Sending registration request...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Registration successful!');
      console.log('Navigating to login screen...');

      // Navigate to login screen
      router.push('/(public)/login');
    } catch (error) {
      console.error('Registration Error:', error);
    }
  };

  const navigateToLogin = () => {
    console.log("User clicked 'Login' - navigating to login screen");
    router.push('/(public)/login');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title} type="bold">
        Create Account
      </Text>
      <Text style={styles.subtitle}>Fill in the details below</Text>

      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={registrationValidationSchema}
          onSubmit={handleRegister}>
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <Input
                label="First Name"
                placeholder="e.g., Ronak"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                error={touched.firstName ? errors.firstName : undefined}
                touched={touched.firstName}
                autoCapitalize="words"
              />

              <Input
                label="Last Name"
                placeholder="e.g., Gami"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                error={touched.lastName ? errors.lastName : undefined}
                touched={touched.lastName}
                autoCapitalize="words"
              />

              <Input
                label="Email"
                placeholder="e.g., Ronak.Gami@example.com"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email ? errors.email : undefined}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Mobile Number"
                placeholder="e.g., 9876543210"
                value={values.mobileNo}
                onChangeText={handleChange('mobileNo')}
                error={touched.mobileNo ? errors.mobileNo : undefined}
                touched={touched.mobileNo}
                keyboardType="phone-pad"
                maxLength={10}
              />

              <Input
                label="Password"
                placeholder="Password@123"
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password ? errors.password : undefined}
                touched={touched.password}
                secureTextEntry
              />

              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                error={
                  touched.confirmPassword ? errors.confirmPassword : undefined
                }
                touched={touched.confirmPassword}
                secureTextEntry
              />

              <Button
                title={isSubmitting ? 'Creating...' : 'Register'}
                onPress={handleSubmit as () => void}
                disabled={isSubmitting}
                loading={isSubmitting}
                style={styles.registerButton}
              />
            </>
          )}
        </Formik>
      </View>

      <View style={styles.dividerContainer}>
        <Text style={styles.orText}>Already have an account?</Text>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.loginText} type="semibold">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationForm;
