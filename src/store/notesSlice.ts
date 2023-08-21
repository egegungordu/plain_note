import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SmallNote } from "@/app/(listbar)/listbaritems";

export interface EditedNote {
  id: string;
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
    addNote(state, action: PayloadAction<SmallNote>) {
      state.notes = [action.payload, ...state.notes];
    },
    editNote(state, action: PayloadAction<EditedNote>) {
      const id = action.payload.id;
      state.editedNotesBuffer = {
        ...state.editedNotesBuffer,
        [id]: action.payload,
      };
    },
  },
});

export const { setNotes, editNote, addNote } = notesSlice.actions;
export default notesSlice.reducer;
