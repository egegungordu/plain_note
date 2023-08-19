"use client"

import { Note } from "@prisma/client"
import { saveNote } from "./serveractions"
import { useSession } from "next-auth/react"
import { useTransition } from "react"

export default function InteractiveHeader({ note }: { note: Note }) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const getNoteState = () => {
    // this is not react style, but whatever
    const title = document.querySelector("#note-title") as HTMLHeadingElement
    const content = document.querySelector("#note-content") as HTMLParagraphElement

    return {
      title: title.textContent! ?? "",
      content: content.textContent ?? ""
    }
  }
  const handleSave = () => {
    const { title, content } = getNoteState()
    const id = note.id
    const owner = session?.user?.email!

    startTransition(async () => {
      const note = await saveNote({
        id,
        title,
        content,
        owner,
      })
    })
  }

  return (
    <button onClick={handleSave} className="flex items-center justify-between px-8 py-4 w-full border-b border-neutral-700 text-neutral-300 focus:outline-none">
      Save
    </button>
  )
}