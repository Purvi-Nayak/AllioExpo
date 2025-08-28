// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     justifyContent: "center",
// //     backgroundColor: "#fff",
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     textAlign: "center",
// //     marginBottom: 30,
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     textAlign: "center",
// //     marginBottom: 20,
// //     color: "#666",
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: "#ddd",
// //     padding: 15,
// //     marginBottom: 15,
// //     borderRadius: 8,
// //     fontSize: 16,
// //   },
// //   button: {
// //     backgroundColor: "#007AFF",
// //     padding: 15,
// //     borderRadius: 8,
// //     marginBottom: 15,
// //   },
// //   buttonText: {
// //     color: "white",
// //     textAlign: "center",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// //   link: {
// //     textAlign: "center",
// //     color: "#007AFF",
// //     marginTop: 10,
// //     fontSize: 16,
// //   },
// //   logoutButton: {
// //     backgroundColor: "#FF3B30",
// //     padding: 15,
// //     borderRadius: 8,
// //     marginTop: 20,
// //   },
// //   logoutButtonText: {
// //     color: "white",
// //     textAlign: "center",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// // });
// // export default styles;
// import { StyleSheet } from "react-native";

// import { FONTS } from "@/assets";
// import { useTheme } from "../../../constants/Colors";

// const useStyle = () => {
//   const theme = useTheme();

//   return StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 20,
//       justifyContent: "center",
//       backgroundColor: theme.white,
//     },
//     title: {
//       fontSize: 24,
//       textAlign: "center",
//       marginBottom: 30,
//       fontFamily: FONTS.regular,
//     },
//     subtitle: {
//       fontSize: 16,
//       textAlign: "center",
//       marginBottom: 20,
//       color: "#666",
//     },
//     input: {
//       borderWidth: 1,
//       borderColor: "#ddd",
//       padding: 15,
//       marginBottom: 15,
//       borderRadius: 8,
//       fontSize: 16,
//     },
//     button: {
//       backgroundColor: theme.primary,
//       padding: 15,
//       borderRadius: 8,
//       marginBottom: 15,
//     },
//     buttonText: {
//       color: "white",
//       textAlign: "center",
//       fontSize: 16,
//       fontWeight: "600",
//     },
//     link: {
//       textAlign: "center",
//       color: "#007AFF",
//       marginTop: 10,
//       fontSize: 16,
//     },
//     logoutButton: {
//       backgroundColor: "#FF3B30",
//       padding: 15,
//       borderRadius: 8,
//       marginTop: 20,
//     },
//     logoutButtonText: {
//       color: "white",
//       textAlign: "center",
//       fontSize: 16,
//       fontWeight: "600",
//     },
//   });
// };

// export default useStyle;
// screens/LoginScreen/style.ts
import { FONTS } from "@/assets";
import { useTheme } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flex: 1,
      paddingHorizontal: scale(24),
      justifyContent: "center",
    },

    header: {
      alignItems: "center",
      marginBottom: scale(40),
    },

    title: {
      fontSize: scale(28),
      fontFamily: FONTS.bold || FONTS.semibold || FONTS.medium,
      color: colors.text,
      marginBottom: scale(8),
      textAlign: "center",
    },

    subtitle: {
      fontSize: scale(16),
      fontFamily: FONTS.regular,
      color: colors.gray,
      textAlign: "center",
    },

    form: {
      width: "100%",
    },

    inputIcon: {
      width: scale(20),
      height: scale(20),
      tintColor: colors.gray,
    },

    loginButton: {
      marginTop: scale(24),
      marginBottom: scale(32),
      backgroundColor: colors.primary,
    },

    linkContainer: {
      alignItems: "center",
      gap: scale(16),
    },

    link: {
      alignItems: "center",
      paddingVertical: scale(8),
    },

    linkText: {
      fontSize: scale(16),
      fontFamily: FONTS.medium || FONTS.regular,
      color: colors.primary,
      textAlign: "center",
    },
  });
};

export default useStyle;
