import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SmallNote } from "@/app/(listbar)/listbaritems";
import { Note } from "@prisma/client";

export interface NotesState {
  notes: SmallNote[];
  editedNotesBuffer: Record<string, Note>;
}

const initialState: NotesState = {
  notes: [],
  editedNotesBuffer: {},
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setStoreNotes(state, action: PayloadAction<SmallNote[]>) {
      state.notes = action.payload;
    },
    addStoreNote(state, action: PayloadAction<SmallNote>) {
      state.notes = [action.payload, ...state.notes];
    },
    deleteStoreNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    updateStoreNote(
      state,
      action: PayloadAction<Partial<Note> & Pick<Note, "id">>
    ) {
      const id = action.payload.id;
      state.editedNotesBuffer = {
        ...state.editedNotesBuffer,
        [id]: {
          ...state.editedNotesBuffer[id],
          ...action.payload,
        },
      };
    },
  },
});

export const { setStoreNotes, updateStoreNote, addStoreNote, deleteStoreNote } =
  notesSlice.actions;
export default notesSlice.reducer;
