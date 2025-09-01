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
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userData: any | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  userData: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setStateKey: (
      state,
      action: PayloadAction<{ key: keyof AuthState; value: any }>
    ) => {
      const { key, value } = action.payload;
      (state as any)[key] = value;

      // Update isAuthenticated based on token
      if (key === "token") {
        state.isAuthenticated = !!value;
      }
    },
    clearAuth: (state) => {
      state.token = null;
      state.userData = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setStateKey, clearAuth } = authSlice.actions;
export default authSlice.reducer;
