import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import Button from '@components/atoms/Button';
import Input from '@components/atoms/Input';
import Text from '@components/atoms/Text';
import RememberForgot from '@components/molecule/RememberForget';
import SignInWithGitHub from '../../molecule/SocialGithub';
import SignInWithFacebook from '../../molecule/SocialSignInFacebook';
import SignInWithGoogle from '../../molecule/SocialSignInGoogle';

import useValidation from '@/utils/velidationSchema';
import useStyle from './style';

const LoginForm: React.FC = () => {
  const styles = useStyle();
  const router = useRouter();
  const { loginValidationSchema } = useValidation();

  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues = { email: '', password: '' };

  return (
    <View style={styles.formContainer}>
      <Text  style={styles.title} type="bold" >Login</Text>
      <Text  style={styles.subtitle} type="regular" >
        Please sign in to continue
      </Text>

      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              router.push('/(private)/(tabs)/home');
            }, 150);
          }}
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
                placeholder="e.g., ronak.gami@example.com"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email ? errors.email : ''}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password ? errors.password : ''}
                touched={touched.password}
                secureTextEntry
              />

              <RememberForgot
                remember={remember}
                onCheckboxPress={() => setRemember((p) => !p)}
              />

              <Button
                title="login"
                onPress={handleSubmit as () => void}
                disabled={loading}
                loading={loading}
                style={styles.loginButton}
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

      <View style={styles.SocialButtonStyle}>
        <SignInWithFacebook setLoading={setLoading} />
        <SignInWithGoogle setLoading={setLoading} />
        <SignInWithGitHub />
      </View>
      <View style={styles.dividerContainer}>
        <Text  style={styles.orText} >
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push('/(public)/register')}>
          <Text style={styles.signUpText}  type="semibold">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
  </View>
  );
};

export default LoginForm;
