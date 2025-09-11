// import { Stack } from "expo-router";

// export default function PublicLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="login/index" />
//       <Stack.Screen name="register/index" />
//       <Stack.Screen name="forgetpassword/index" />
//     </Stack>
//   );
// }
import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Authentication Screens */}
      <Stack.Screen name="login/index" />
      <Stack.Screen name="register/index" />
      <Stack.Screen name="forgetpassword/index" />
      
      {/* Security Setup Screens */}
      <Stack.Screen name="auth-setup/index" />
      <Stack.Screen name="setup-mpin/index" />
      
      {/* Security Verification Screens */}
      <Stack.Screen name="auth-mpin/index" />
      <Stack.Screen name="auth-biometric/index" />
    </Stack>
  );
}