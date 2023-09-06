"use client";

import { useRef } from "react";
import { store } from "@/store";
import { setStoreNotes, setStoreFolders } from "@/store/notesSlice";
import type { Folder, SmallNote } from "@/app/actions";

export function ReduxNotesPreloader({ notes }: { notes: SmallNote[] }) {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(setStoreNotes(notes));
    loaded.current = true;
  }

  return null;
}

export function ReduxFoldersPreloader({ folders }: { folders: Folder[] }) {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(setStoreFolders(folders));
    loaded.current = true;
  }

  return null;
}
