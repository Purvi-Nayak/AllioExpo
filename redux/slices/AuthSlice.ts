// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface UserData {
//   email: string;
//   firstName: string;
//   lastName: string;
//   mobileNo: string;
//   profileImage: string;
// }

// interface AuthState {
//   userData: UserData;
//   token: string | null;
//   onboardingCompleted: boolean;
//   notificationsEnabled: boolean;
// }

// interface SetStateKeyPayload {
//   key: keyof AuthState;
//   value: any;
// }

// const initialState: AuthState = {
//   userData: {
//     email: "",
//     firstName: "",
//     lastName: "",
//     mobileNo: "",
//     profileImage: "",
//   },
//   token: null,
//   onboardingCompleted: true,
//   notificationsEnabled: false,
// };

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setStateKey: (state, action: PayloadAction<SetStateKeyPayload>) => {
//       const { key, value } = action.payload;
//       if (key === "userData" && typeof value === "object") {
//         state.userData = value as UserData;
//       } else if (key === "token" && (typeof value === "string" || value === null)) {
//         state.token = value as string | null;
//       } else if (key === "onboardingCompleted" && typeof value === "boolean") {
//         state.onboardingCompleted = value as boolean;
//       } else if (key === "notificationsEnabled" && typeof value === "boolean") {
//         state.notificationsEnabled = value as boolean;
//       }
//     },
//     logout: (state) => {
//       state.userData = {
//         email: "",
//         firstName: "",
//         lastName: "",
//         mobileNo: "",
//         profileImage: "",
//       };
//       state.token = null;
//     },
//   },
// });

// export const { setStateKey, logout } = authSlice.actions;
// export default authSlice.reducer;



// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface AuthState {
//   token: string | null;
//   userData: any | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   token: null,
//   userData: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setStateKey: (
//       state,
//       action: PayloadAction<{ key: keyof AuthState; value: any }>
//     ) => {
//       const { key, value } = action.payload;
//       (state as any)[key] = value;

//       // Update isAuthenticated based on token
//       if (key === "token") {
//         state.isAuthenticated = !!value;
//       }
//     },
//     clearAuth: (state) => {
//       state.token = null;
//       state.userData = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { setStateKey, clearAuth } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

// Types
export type AuthMethod = "mpin" | "biometric" | null;

interface AuthState {
  token: string | null;
  userData: any | null;
  isAuthenticated: boolean;

  // Security setup
  hasSetupSecurity: boolean;
  authMethod: AuthMethod;
  hasBiometric: boolean;

  // Flags
  isLoading: boolean;
  isCheckingAuth: boolean;
}

// Initial state
const initialState: AuthState = {
  token: null,
  userData: null,
  isAuthenticated: false,
  hasSetupSecurity: false,
  authMethod: null,
  hasBiometric: false,
  isLoading: false,
  isCheckingAuth: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Generic state setter
    setStateKey: (
      state,
      action: PayloadAction<{ key: keyof AuthState; value: any }>
    ) => {
      const { key, value } = action.payload;
      (state as any)[key] = value;

      if (key === "token") {
        state.isAuthenticated = !!value;
      }
    },

    // Auth flow
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; userData: any }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userData = action.payload.userData;
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.userData = null;
    },

    // Security setup
    setSecurityMethod: (state, action: PayloadAction<AuthMethod>) => {
      state.authMethod = action.payload;
      state.hasSetupSecurity = action.payload !== null;
    },
    setBiometricAvailability: (state, action: PayloadAction<boolean>) => {
      state.hasBiometric = action.payload;
    },

    // Loading / Checking
    setAuthChecking: (state, action: PayloadAction<boolean>) => {
      state.isCheckingAuth = action.payload;
    },

    // Logout
    clearAuth: (state) => {
      state.token = null;
      state.userData = null;
      state.isAuthenticated = false;
      state.hasSetupSecurity = false;
      state.authMethod = null;
    },

    // Hydrate persisted state
    hydrateAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
      Object.assign(state, action.payload);
      state.isCheckingAuth = false;
    },
  },
});

export const {
  setStateKey,
  loginStart,
  loginSuccess,
  loginFailure,
  setSecurityMethod,
  setBiometricAvailability,
  setAuthChecking,
  clearAuth,
  hydrateAuth,
} = authSlice.actions;

// -----------------
// Async helpers
// -----------------

export const saveAuthData = async (token: string, user: any) => {
  try {
    await SecureStore.setItemAsync("userToken", token);
    await SecureStore.setItemAsync("userData", JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save auth data:", err);
  }
};

export const saveMPIN = async (mpin: string) => {
  try {
    await SecureStore.setItemAsync("userMPIN", mpin);
    await SecureStore.setItemAsync("authMethod", "mpin");
  } catch (err) {
    console.error("Failed to save MPIN:", err);
  }
};

export const saveAuthMethod = async (method: AuthMethod) => {
  try {
    if (method) {
      await SecureStore.setItemAsync("authMethod", method);
    } else {
      await SecureStore.deleteItemAsync("authMethod");
    }
  } catch (err) {
    console.error("Failed to save auth method:", err);
  }
};

export const clearAuthData = async () => {
  try {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userData");
    await SecureStore.deleteItemAsync("userMPIN");
    await SecureStore.deleteItemAsync("authMethod");
  } catch (err) {
    console.error("Failed to clear auth data:", err);
  }
};

export const loadAuthData = async (): Promise<Partial<AuthState>> => {
  try {
    const [token, userData, authMethod] = await Promise.all([
      SecureStore.getItemAsync("userToken"),
      SecureStore.getItemAsync("userData"),
      SecureStore.getItemAsync("authMethod"),
    ]);

    const hasBiometric =
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync());

    return {
      token,
      userData: userData ? JSON.parse(userData) : null,
      isAuthenticated: !!token,
      authMethod: authMethod as AuthMethod,
      hasSetupSecurity: !!authMethod,
      hasBiometric,
      isCheckingAuth: false,
    };
  } catch (err) {
    console.error("Failed to load auth data:", err);
    return { isCheckingAuth: false };
  }
};

export const verifyMPIN = async (inputMPIN: string): Promise<boolean> => {
  try {
    const storedEncryptedMPIN = await SecureStore.getItemAsync("userMPIN");
    if (!storedEncryptedMPIN) {
      return false;
    }
    
    // Import encryption function
    const { encryptMPIN } = await import("@/utils/helper");
    const encryptedInput = encryptMPIN(inputMPIN);
    
    return storedEncryptedMPIN === encryptedInput;
  } catch (err) {
    console.error("Failed to verify MPIN:", err);
    return false;
  }
};

export const authenticateWithBiometric = async (): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access your account",
      disableDeviceFallback: false,
      cancelLabel: "Use MPIN instead",
    });
    return result.success;
  } catch (err) {
    console.error("Biometric authentication failed:", err);
    return false;
  }
};

export default authSlice.reducer;
