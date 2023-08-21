"use client"

import { Note } from "@prisma/client"
import { FormEventHandler, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react"
import { useEffectOnce, useEventListener } from "usehooks-ts"
import { store } from "@/store"
import { editStoreNote } from "@/store/notesSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"

const useAppDispatch = () => useDispatch<AppDispatch>()

export default function InteractiveNote({ note }: { note: Note }) {
  const noteRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const [editedNote, setEditedNote] = useState(note)
  const dispatch = useAppDispatch()

  useEffectOnce(() => {
    const editedNote = store.getState().notes.editedNotesBuffer[note.id];
    if (editedNote) {
      setEditedNote((prev) => ({
        ...prev,
        content: editedNote.content ?? prev.content,
        title: editedNote.title ?? prev.title,
      }))
    }
  })

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      contentRef.current?.focus()
    }
  }

  const handleTitleInput = (e: React.ChangeEvent<HTMLHeadingElement>) => {
    dispatch(editStoreNote({
      id: note.id,
      title: e.currentTarget.textContent ?? "",
    }))
  }

  const handleContentInput: FormEventHandler<HTMLParagraphElement> = (e) => {
    // bugfix: when the paragraph has a one line text,
    // and we focus on the paragraph from the title (by pressing enter),
    // and then we press enter again, and then we select all the text (ctrl+a),
    // and then we press backspace, the paragraph gets deleted.??
    // and a div gets created instead of the paragraph. ???

    // bugfix: when we detect that the paragraph is empty, we set
    // the innerHTML to an empty string

    // this also prevents the user from creating leading
    // newlines, which is kinda nice

    if (e.currentTarget.textContent === "") {
      e.currentTarget.innerHTML = ""
    }

    dispatch(editStoreNote({
      id: note.id,
      content: e.currentTarget.textContent ?? "",
    }))
  }

  // prevent the user from pasting html elements,
  // and only paste the text
  useEventListener("paste", (e) => {
    e.preventDefault();
    const text_only = e.clipboardData
      ? e.clipboardData.getData('text/plain')
      : // For IE
      // @ts-ignore
      window.clipboardData
        // @ts-ignore
        ? window.clipboardData.getData('Text')
        : '';

    if (document.queryCommandSupported('insertText')) {
      // document.execCommand('insertText', false, text_only);
      document.execCommand("insertText", false, text_only.trim());
    } else {
      // if the browser doesn't support insertText,
      // this prevents screws up the undo stack
      if (!noteRef.current?.contains(e.target as Node)) return;
      const text_only = e.clipboardData?.getData('text/plain') ?? "";
      const clipdata = e.clipboardData;
      if (clipdata === null) return;
      const selection = window.getSelection();
      if (selection === null) return;
      if (selection.rangeCount) {
        selection.getRangeAt(0).insertNode(document.createTextNode(text_only));
        selection.collapseToEnd();
      }
      e.preventDefault();
    }
  })

  return (
    <div ref={noteRef} className="py-8 w-full max-w-full h-full overflow-auto flex flex-col">
      <h1 id="note-title" placeholder="Untitled" onInput={handleTitleInput} onKeyDown={handleTitleKeyDown} spellCheck contentEditable suppressContentEditableWarning className="text-4xl px-8 mt-1 font-semibold text-neutral-300 empty:text-neutral-600 focus:before:absolute focus:before:w-0.5 focus:before:h-full focus:before:bg-orange-700 border-l-4 border-l-transparent focus:border-l-orange-700 focus:before:-left-2 relative focus:outline-none empty:after:content-[attr(placeholder)] empty:after:pointer-events-none hyphens-manual break-all">
        {editedNote.title}
      </h1>

      <p id="note-content" ref={contentRef} onInput={handleContentInput} placeholder="Simply type here..." spellCheck contentEditable suppressContentEditableWarning className="text-neutral-300 mt-8 px-8 items-center empty:text-neutral-600 focus:before:absolute focus:before:w-0.5 focus:before:h-full focus:before:bg-orange-700 border-l-4 border-l-transparent focus:border-l-orange-700 focus:before:-left-2 relative focus:outline-none empty:after:content-[attr(placeholder)] empty:after:pointer-events-none break-all hyphens-manual">
        {editedNote.content}
      </p>
    </div>
  )
}