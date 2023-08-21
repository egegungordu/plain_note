"use client"

import { useRef } from "react"
import { store } from "@/store"
import { setStoreNotes } from "@/store/notesSlice"
import type { SmallNote } from "@/app/(listbar)/listbaritems";

export default function ReduxPreloader({ notes }: { notes: SmallNote[] }) {
  const loaded = useRef(false)
  if (!loaded.current) {
    store.dispatch(setStoreNotes(notes))
    loaded.current = true
  }

  return null
}