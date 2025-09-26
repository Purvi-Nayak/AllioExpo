import { apiCallBegan } from "../apiActions";
import createGenericSlice from "../types";

const slice = createGenericSlice({
  name: "user-data",
  initialState: {
    data: undefined,
  },
  reducers: {
    onChange: (state, action) => {
      state.data = action.payload;
    },
  },
});

const { onChange } = slice.actions;
export default slice.reducer;

export const setUserData = (data: object) =>
  apiCallBegan({ onChange: onChange.type, data });
