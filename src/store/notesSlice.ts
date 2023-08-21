import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SmallNote } from "@/app/(listbar)/listbaritems";

export interface EditedNote {
  id: string;
  title?: string;
  content?: string;
  isFavorite?: boolean;
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
    setStoreNotes(state, action: PayloadAction<SmallNote[]>) {
      state.notes = action.payload;
    },
    addStoreNote(state, action: PayloadAction<SmallNote>) {
      state.notes = [action.payload, ...state.notes];
    },
    deleteStoreNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    editStoreNote(
      state,
      action: PayloadAction<Partial<EditedNote> & Pick<EditedNote, "id">>
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

export const { setStoreNotes, editStoreNote, addStoreNote, deleteStoreNote } =
  notesSlice.actions;
export default notesSlice.reducer;
