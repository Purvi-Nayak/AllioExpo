import { Container, RegistrationForm } from "@/components";
import React from "react";

export default function RegisterScreen() {
  return (
    <Container showHeader={false} auth keyboardAvoiding>
      <RegistrationForm />
    </Container>
  );
}
// import { Container, RegistrationForm } from "@/components";
// import { useFocusEffect } from "@react-navigation/native";
// import { useRouter } from "expo-router";
// import React, { useCallback } from "react";
// import { BackHandler } from "react-native";

// export default function RegisterScreen() {
//   const router = useRouter();

//   // ✅ Handle hardware back button
//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         console.log("🔙 Hardware back button pressed on register screen");

//         try {
//           if (router.canGoBack()) {
//             console.log("✅ Going back to previous screen");
//             router.back();
//           } else {
//             console.log("✅ No previous screen, going to login");
//             router.replace("/(public)/login");
//           }
//         } catch (error) {
//           console.error("❌ Back navigation error:", error);
//           router.push("/(public)/login");
//         }

//         return true; // Prevent default behavior (exiting app)
//       };

//       const subscription = BackHandler.addEventListener(
//         "hardwareBackPress",
//         onBackPress
//       );
//       return () => subscription?.remove();
//     }, [router])
//   );

//   return (
//     <Container showHeader={false} auth keyboardAvoiding>
//       <RegistrationForm />
//     </Container>
//   );
// }
