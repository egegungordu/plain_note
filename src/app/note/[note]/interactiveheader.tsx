"use client"

import { Note } from "@prisma/client"
import { saveNote } from "./serveractions"
import { useTransition, useState } from "react"
import { TbArrowsMaximize, TbArrowsMinimize, TbDeviceFloppy, TbDots } from "react-icons/tb"
import { useSelector, useDispatch, type TypedUseSelectorHook } from "react-redux"
import { RootState, AppDispatch } from "@/store"
import { setIsFullscreen } from "@/store/uiSlice"

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
const useAppDispatch = () => useDispatch<AppDispatch>()

export default function InteractiveHeader({ note }: { note: Note }) {
  const [isPending, startTransition] = useTransition();
  const isFullscreen = useAppSelector((state) => state.ui.isFullscreen)
  const dispatch = useAppDispatch()

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

    startTransition(async () => {
      const note = await saveNote({
        id,
        title,
        content,
      })
    })
  }

  const handleToggleFullscreen = () => {
    const sidebar = document.querySelector("#sidebar") as HTMLDivElement
    const listbar = document.querySelector("#listbar") as HTMLDivElement

    if (isFullscreen) {
      sidebar.classList.remove("hidden")
      listbar.classList.remove("hidden")
    } else {
      sidebar.classList.add("hidden")
      listbar.classList.add("hidden")
    }

    dispatch(setIsFullscreen(!isFullscreen))
  }

  return (
    <section className="mt-2 flex items-center px-4 py-2.5 w-full text-neutral-300 focus:outline-none">
      <button onClick={handleSave} className="flex text-sm items-center justify-center px-4 py-2 rounded-full hover:bg-neutral-800">
        <TbDeviceFloppy className="w-5 h-5 mr-2" />
        Save
      </button>

      <span className="ml-1 text-xs text-neutral-400 mt-0.5 overflow-hidden whitespace-nowrap">
        {isPending ? "Saving..." : "Last saved 2 minutes ago"}
      </span>

      <button onClick={handleToggleFullscreen} className="ml-auto flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800">
        {isFullscreen ? (
          <TbArrowsMinimize className="w-4 h-4" />
        ) : (
          <TbArrowsMaximize className="w-4 h-4" />
        )}
      </button>

      <button className="flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800">
        <TbDots className="w-4 h-4" />
      </button>
    </section>
  )
}