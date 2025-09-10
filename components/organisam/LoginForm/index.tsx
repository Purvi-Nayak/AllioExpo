// import Button from "@/components/atoms/Button";
// import Input from "@/components/atoms/Input";
// import Text from "@/components/atoms/Text";
// import RememberForgot from "@/components/molecule/RememberForget";
// import SignInWithGithub from "@/components/molecule/SocialGithub";
// import SignInWithFacebook from "@/components/molecule/SocialSignInFacebook";
// import SignInWithGoogle from "@/components/molecule/SocialSignInGoogle";
// import { Formik } from "formik";
// import React from "react";
// import { TouchableOpacity, View } from "react-native";
// import useStyle from "./style";
// import { useLoginForm } from "./useLoginForm";

// interface LoginFormProps {
//   setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ setLoading }) => {
//   const styles = useStyle();
//   const {
//     initialValues,
//     loginValidationSchema,
//     handleLogin,
//     remember,
//     setRemember,
//     loading,
//     navigateToRegister,
//     navigateToForgotPassword,
//   } = useLoginForm();

//   const onLoginSubmit = async (values: any) => {
//     setLoading?.(true);
//     await handleLogin(values);
//     setLoading?.(false);
//   };

//   return (
//     <View style={styles.formContainer}>
//       <Text style={styles.title} type="bold">
//         Login
//       </Text>
//       <Text style={styles.subtitle} type="regular">
//         Please sign in to continue
//       </Text>

//       <View style={styles.inputContainer}>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={loginValidationSchema}
//           onSubmit={onLoginSubmit}
//         >
//           {({
//             handleChange,
//             handleSubmit,
//             handleBlur,
//             values,
//             errors,
//             touched,
//           }) => (
//             <>
//               <Input
//                 label="Email"
//                 placeholder="e.g., user@example.com"
//                 value={values.email}
//                 onChangeText={handleChange("email")}
//                 onBlur={handleBlur("email")}
//                 error={errors.email}
//                 touched={touched.email}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />

//               <Input
//                 label="Password"
//                 placeholder="Enter your password"
//                 value={values.password}
//                 onChangeText={handleChange("password")}
//                 onBlur={handleBlur("password")}
//                 error={errors.password}
//                 touched={touched.password}
//                 secureTextEntry
//               />

//               <RememberForgot
//                 remember={remember}
//                 onCheckboxPress={setRemember}
//                 onForgotPress={navigateToForgotPassword}
//               />

//               <Button
//                 title="Login"
//                 onPress={handleSubmit as () => void}
//                 disabled={loading}
//                 loading={loading}
//               />
//             </>
//           )}
//         </Formik>
//       </View>

//       <View style={styles.dividerContainer}>
//         <View style={styles.line} />
//         <Text style={styles.socialSignInText}>Social Sign-In</Text>
//         <View style={styles.line} />
//       </View>

//       <View style={styles.SocialButtonStyle}>
//         <SignInWithFacebook setLoading={setLoading} />
//         <SignInWithGoogle setLoading={setLoading} />
//         <SignInWithGithub setLoading={setLoading} />
//       </View>

//       <View style={styles.dividerContainer}>
//         <Text style={styles.orText}>Don't have an account?</Text>
//         <TouchableOpacity onPress={navigateToRegister}>
//           <Text style={styles.signUpText} type="semibold">
//             Sign Up
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default LoginForm;
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Text from "@/components/atoms/Text";
import RememberForgot from "@/components/molecule/RememberForget";
import SignInWithFacebook from "@/components/molecule/SocialSignInFacebook";
import SignInWithGoogle from "@/components/molecule/SocialSignInGoogle";
import { Formik } from "formik";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import useStyle from "./style";
import { useLoginForm } from "./useLoginForm";

interface LoginFormProps {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLoading }) => {
  const styles = useStyle();
  const {
    initialValues,
    loginValidationSchema,
    handleLogin,
    remember,
    setRemember,
    loading,
    navigateToRegister,
    navigateToForgotPassword,
  } = useLoginForm();

  const onLoginSubmit = async (values: any) => {
    setLoading?.(true);
    await handleLogin(values);
    setLoading?.(false);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title} type="bold">
        Login
      </Text>
      <Text style={styles.subtitle} type="regular">
        Please sign in to continue
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
                title="Login"
                onPress={handleSubmit as () => void}
                disabled={loading}
                loading={loading}
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
        <SignInWithFacebook setLoading={setLoading ?? (() => {})} />
        <SignInWithGoogle setLoading={setLoading ?? (() => {})} />
      </View>

      <View style={styles.dividerContainer}>
        <Text style={styles.orText}>Don't have an account?</Text>
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
