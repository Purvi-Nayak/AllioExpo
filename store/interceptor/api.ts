import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as actions from "../apiActions";
import { clearLoginResponse } from "../auth/login";

// Extend Axios config to include custom flags
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  formData?: boolean;
  isLogin?: boolean;
  // Add Authorization header optional (used in middleware)
  headers: Record<string, string>;
}

// Axios instance
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: any) => {
    config.headers = {
      ...config.headers,
      "Content-Type": config.formData
        ? "multipart/form-data"
        : "application/json",
      Accept: "application/json",
    };

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 500) {
      alert("Something went wrong on the server. Please try again later.");
    }

    return Promise.reject(error);
  }
);

// Redux middleware
const api =
  ({ dispatch, getState }: { dispatch: any; getState: () => any }) =>
  (next: any) =>
  async (action: any) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const {
      url,
      method,
      data,
      onStart,
      onSuccess,
      onFailed,
      formData = false,
      isLogin = false,
    } = action.payload;

    if (onStart) dispatch({ type: onStart });
    next(action);

    try {
      // Get token from Redux state
      const token = getState().login?.data?.token;

      const headers: Record<string, string> = {
        // Authorization only if NOT a login call and token exists
        ...(isLogin ? {} : token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const requestConfig: CustomAxiosRequestConfig = {
        url,
        method,
        data,
        headers,
        formData,
        isLogin,
      };

      const response = await apiClient.request(requestConfig);

      dispatch(actions.apiCallSuccess(response.data));
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401) {
        dispatch(clearLoginResponse());
      }

      const errorMessage =
        error?.response?.data ?? error?.message ?? "Network error";

      dispatch(actions.apiCallFailed(errorMessage));
      if (onFailed) dispatch({ type: onFailed, payload: errorMessage });
    }
  };

export default api;
