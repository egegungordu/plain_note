"use client"

import { SmallNote } from "./listbaritems"
import ListbarItem from "./listbaritem"
// import { useRef } from "react"

import { store } from "@/store"
import { useSelector, useDispatch, type TypedUseSelectorHook } from "react-redux"
import { RootState, AppDispatch } from "@/store"

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
const useAppDispatch = () => useDispatch<AppDispatch>()

export default function ListbarItemsClient({ notes }: { notes: SmallNote[] }) {
  // const ref = useRef<HTMLUListElement>(null)

  const storeNotes = useAppSelector((state) => state.notes.notes)

  return (
    <ul id="listbar" className="flex flex-col items-center justify-start mt-4 divide-y divide-neutral-800 overflow-auto">
      {/* <button onClick={() => scrollTo("6addb185-f725-44e2-92df-a8d168eb68e5")}>Scroll to 1</button> */}
      {/* <div aria-hidden={true} className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-600/60" /> */}
      {storeNotes.map((note) => (
        <ListbarItem key={note.id} note={note} data-id={note.id} />
      ))}
    </ul>
  )
}