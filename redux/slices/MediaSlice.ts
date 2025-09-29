import api from "@/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface MediaState {
  images: string[];
  videos: string[];
}

const initialState: MediaState = {
  images: [],
  videos: [],
};

export const fetchImages = createAsyncThunk<string[], string>(
  "media/fetchImages",
  async (email, { rejectWithValue }) => {
    try {
      // Adapt to your API shape. Expecting api.MEDIA.getMedia({ data: { email, fileType } })
      const response = await api.MEDIA.getMedia({
        data: { email, fileType: "image" },
      });
      if (response?.data?.success) {
        return response.data.files;
      }
      return rejectWithValue("Failed to fetch images");
    } catch (error: any) {
      return rejectWithValue(error?.message || "An unknown error occurred");
    }
  }
);

export const fetchVideos = createAsyncThunk<string[], string>(
  "media/fetchVideos",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.MEDIA.getMedia({
        data: { email, fileType: "video" },
      });

      if (response?.data?.success) {
        return response.data.files;
      }
      return rejectWithValue("Failed to fetch videos");
    } catch (error: any) {
      return rejectWithValue(error?.message || "An unknown error occurred");
    }
  }
);

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.fulfilled, (state, action) => {
        console.log("media.fetchImages.fulfilled payload:", action.payload);
        state.images = action.payload;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        console.log("media.fetchVideos.fulfilled payload:", action.payload);
        state.videos = action.payload;
      });
  },
});

export default mediaSlice.reducer;
