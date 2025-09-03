// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import * as SplashScreen from "expo-splash-screen";
// // import React, { createContext, useContext, useEffect, useState } from "react";

// // interface AuthContextType {
// //   isAuthenticated: boolean;
// //   isLoading: boolean;
// //   login: (token: string) => Promise<void>;
// //   logout: () => Promise<void>;
// // }

// // const AuthContext = createContext<AuthContextType | null>(null);

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error("useAuth must be used within an AuthProvider");
// //   }
// //   return context;
// // };

// // export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     checkAuthStatus();
// //   }, []);

// //   const checkAuthStatus = async () => {
// //     try {
// //       // Keep splash screen visible while checking auth
// //       await SplashScreen.preventAutoHideAsync();

// //       const token = await AsyncStorage.getItem("authToken");
// //       setIsAuthenticated(!!token);

// //       // You can add token validation here if needed
// //       if (token) {
// //         // Optionally validate token with your API
// //         // const isValid = await validateToken(token);
// //         // setIsAuthenticated(isValid);
// //       }
// //     } catch (error) {
// //       console.error("Error checking auth status:", error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const login = async (token: string) => {
// //     try {
// //       await AsyncStorage.setItem("authToken", token);
// //       setIsAuthenticated(true);
// //     } catch (error) {
// //       console.error("Error storing auth token:", error);
// //       throw error;
// //     }
// //   };

// //   const logout = async () => {
// //     try {
// //       await AsyncStorage.removeItem("authToken");
// //       setIsAuthenticated(false);
// //     } catch (error) {
// //       console.error("Error removing auth token:", error);
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import firebase from "@react-native-firebase/app";
// import { getAuth, onAuthStateChanged, User } from "@react-native-firebase/auth";
// import * as SplashScreen from "expo-splash-screen";
// import React, { createContext, useContext, useEffect, useState } from "react";

// interface AuthContextType {
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   user: User | null;
//   login: (token: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // Wait for Firebase to be initialized before setting up auth listener
//     const initializeAuth = async () => {
//       try {
//         // Keep splash screen visible while checking auth
//         await SplashScreen.preventAutoHideAsync();

//         // Wait for Firebase to be ready
//         if (firebase.apps.length === 0) {
//           // Wait a bit for Firebase to initialize
//           await new Promise((resolve) => setTimeout(resolve, 500));
//         }

//         if (firebase.apps.length > 0) {
//           const auth = getAuth();

//           // Set up auth state listener
//           const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             console.log(
//               "Auth state changed:",
//               user ? "User logged in" : "User logged out"
//             );

//             setUser(user);
//             setIsAuthenticated(!!user);

//             // Also check AsyncStorage for token
//             if (!user) {
//               const token = await AsyncStorage.getItem("authToken");
//               if (!token) {
//                 setIsAuthenticated(false);
//               }
//             }

//             setIsLoading(false);
//           });

//           return unsubscribe;
//         } else {
//           console.error("Firebase not initialized in AuthProvider");
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error("Error initializing auth:", error);
//         setIsLoading(false);
//       }
//     };

//     const unsubscribe = initializeAuth();

//     // Cleanup function
//     return () => {
//       if (typeof unsubscribe === "function") {
//         unsubscribe();
//       }
//     };
//   }, []);

//   const login = async (token: string) => {
//     try {
//       await AsyncStorage.setItem("authToken", token);
//       setIsAuthenticated(true);
//     } catch (error) {
//       console.error("Error storing auth token:", error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       if (firebase.apps.length > 0) {
//         const auth = getAuth();
//         await auth.signOut();
//       }

//       await AsyncStorage.removeItem("authToken");
//       setIsAuthenticated(false);
//       setUser(null);
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         isLoading,
//         user,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
