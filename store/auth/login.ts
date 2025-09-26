import { apiCallBegan } from "../apiActions";
import { methods, routes } from "../apiRoute";
import createGenericSlice from "../types";

interface DataType {
  success: boolean;
  accessToken: string;
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  refreshToken: string;
  message: string;
}

const initialState = {
  data: {} as DataType | undefined,
  loading: false,
  error: null as DataType | null,
};

const slice = createGenericSlice({
  name: "login",
  initialState,
  reducers: {
    requested: (state) => {
      state.loading = true;
    },
    success: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    failed: (state, action) => {
      state.data = initialState.data;
      state.loading = false;
      state.error = action.payload;
    },
    reset: (state) => {
      state.data = initialState.data;
      state.loading = false;
      state.error = null;
    },
    onChange: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

const { requested, success, failed, reset, onChange } = slice.actions;
export default slice.reducer;

export const login = (data: object) =>
  apiCallBegan({
    url: routes.login,
    data,
    method: methods.POST,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
    isLogin: true,
  });

export const clearLoginResponse = () => apiCallBegan({ onReset: reset.type });

export const setLoginData = (data: object) =>
  apiCallBegan({ onChange: onChange.type, data });

export const logout = () => apiCallBegan({ onReset: reset.type });
