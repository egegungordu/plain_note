"use client"

import { TbPencil } from "react-icons/tb"
import { createNote } from "./serveractions"
import { useTransition } from 'react'
import { useRouter } from "next/navigation"

export default function NewNoteButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter();

  console.log(isPending)

  return (
    <button
      onClick={() => startTransition(async () => {
        const note = await createNote()
        if (!note) return
        router.push(`/note/${note.id}`)
      })}
      className="border-2 border-orange-700 mx-4 mt-4 rounded-full hover:bg-orange-700 transition-colors h-10 flex items-center justify-center">
      <span className="text-sm font-semibold text-neutral-300">
        New note
      </span>
      <TbPencil className="text-lg text-neutral-300 ml-2" />
    </button>
  )
}