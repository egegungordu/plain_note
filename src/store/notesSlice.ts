import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SmallNote } from "@/app/(listbar)/listbaritems";

export interface EditedNote {
  title: string;
  content: string;
}

export interface NotesState {
  notes: SmallNote[];
  editedNotesBuffer: Record<string, EditedNote>;
}

const initialState: NotesState = {
  notes: [],
  editedNotesBuffer: {},
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes(state, action: PayloadAction<SmallNote[]>) {
      state.notes = action.payload;
    },
    editNote(
      state,
      action: PayloadAction<{ id: string; editedNote: EditedNote }>
    ) {
      const { id, editedNote } = action.payload;
      state.editedNotesBuffer = {
        ...state.editedNotesBuffer,
        [id]: editedNote,
      };
    },
  },
});

export const { setNotes, editNote } = notesSlice.actions;
export default notesSlice.reducer;
