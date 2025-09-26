import { apiCallBegan } from "../apiActions";
import { methods, routes } from "../apiRoute";
import createGenericSlice from "../types";

interface DataType {
  success: boolean;
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

const initialState = {
  data: {} as DataType | undefined,
  loading: false,
  error: null as DataType | null,
};

const slice = createGenericSlice({
  name: "profile",
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
  },
});

const { requested, success, failed, reset } = slice.actions;
export default slice.reducer;

export const profile = () =>
  apiCallBegan({
    url: routes.profile,
    method: methods.GET,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const clearProfileResponse = () => apiCallBegan({ onReset: reset.type });
