import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Folder, SmallNote } from "@/app/actions";
import { Note } from "@prisma/client";

interface SaveableNote extends Note {
  saved: boolean;
}
type PartialSaveableNote = Partial<SaveableNote> &
  Pick<SaveableNote, "id"> &
  Pick<SaveableNote, "saved">;

export interface NotesState {
  notes: SmallNote[];
  folders: Folder[];
  editedNotesBuffer: Record<string, PartialSaveableNote>;
  searchResultInfo: { query: string; count: number };
  currentFolder: string;
}

const initialState: NotesState = {
  notes: [],
  folders: [],
  editedNotesBuffer: {},
  searchResultInfo: { query: "", count: 0 },
  currentFolder: "all",
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setStoreNotes(state, action: PayloadAction<SmallNote[]>) {
      state.notes = action.payload;
    },
    deleteStoreNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    updateStoreNote(state, action: PayloadAction<PartialSaveableNote>) {
      const id = action.payload.id;
      state.editedNotesBuffer = {
        ...state.editedNotesBuffer,
        [id]: {
          ...state.editedNotesBuffer[id],
          ...action.payload,
        },
      };
    },
    setStoreSearchResultInfo(
      state,
      action: PayloadAction<NotesState["searchResultInfo"]>
    ) {
      state.searchResultInfo = action.payload;
    },
    setStoreFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },
    setCurrentFolder(state, action: PayloadAction<string>) {
      state.currentFolder = action.payload;
    },
  },
});

export const {
  setStoreNotes,
  updateStoreNote,
  deleteStoreNote,
  setStoreSearchResultInfo,
  setStoreFolders,
  setCurrentFolder,
} = notesSlice.actions;
export default notesSlice.reducer;
