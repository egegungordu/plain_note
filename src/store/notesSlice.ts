import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SmallNote } from "@/app/(listbar)/listbaritems";

export interface NotesState {
  notes: SmallNote[];
}

const initialState: NotesState = {
  notes: [],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes(state, action: PayloadAction<SmallNote[]>) {
      state.notes = action.payload;
    },
  },
});

export const { setNotes } = notesSlice.actions;
export default notesSlice.reducer;
