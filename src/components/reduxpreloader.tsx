"use client"

import { useRef } from "react"
import { store } from "@/store"
import { setNotes } from "@/store/notesSlice"
import type { SmallNote } from "@/app/(listbar)/listbaritems";

export default function ReduxPreloader({ notes }: { notes: SmallNote[] }) {
  const loaded = useRef(false)
  if (!loaded.current) {
    store.dispatch(setNotes(notes))
    loaded.current = true
  }

  return null
}