import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  isFullscreen: boolean;
}

const initialState: UiState = {
  isFullscreen: false,
};

const notesSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsFullscreen(state, action: PayloadAction<boolean>) {
      state.isFullscreen = action.payload;
    },
  },
});

export const { setIsFullscreen } = notesSlice.actions;
export default notesSlice.reducer;
