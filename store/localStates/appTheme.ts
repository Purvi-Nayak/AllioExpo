import { apiCallBegan } from '../apiActions';
import createGenericSlice from '../types';

const slice = createGenericSlice({
  name: 'app-theme',
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

export const setAppTheme = (data: boolean) =>
  apiCallBegan({ onChange: onChange.type, data });
