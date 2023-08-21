"use client"

import { TbLoader, TbLoader2, TbPencil } from "react-icons/tb"
import { createNote } from "./serveractions"
import { useTransition } from 'react'
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"
import { addStoreNote } from "@/store/notesSlice"
import { note2small } from "@/utils"

const useAppDispatch = () => useDispatch<AppDispatch>()

export default function NewNoteButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          const note = await createNote()
          if (!note) return
          dispatch(addStoreNote(note2small(note)))
          setTimeout(() => {
            router.push(`/note/${note.id}`)
          }, 0)
        })
      }}
      disabled={isPending}
      className="border-2 border-orange-700 mx-4 mt-4 rounded-full hover:bg-orange-700 transition-colors h-10 flex items-center justify-center disabled:opacity-70">
      {isPending ? <TbLoader2 className="text-lg animate-spin text-neutral-300" /> :
        <>
          <span className="text-sm font-semibold text-neutral-300">
            New note
          </span>
          <TbPencil className="text-lg text-neutral-300 ml-2" />
        </>
      }
    </button>
  )
}