"use client"

import { Note } from "@prisma/client"
import { FormEventHandler, useRef, useState } from "react"
import { useEventListener } from "usehooks-ts"

export default function InteractiveNote({ note }: { note: Note }) {
  const noteRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      contentRef.current?.focus()
    }
  }

  const handleParagraphInput: FormEventHandler<HTMLParagraphElement> = (e) => {
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
  }

  // prevent the user from copying the html elements,
  // and only copy the text
  useEventListener("copy", (e) => {
    if (!noteRef.current?.contains(e.target as Node)) return;
    const text_only = document.getSelection()?.toString() ?? "";
    const clipdata = e.clipboardData;
    if (clipdata === null) return;
    clipdata.setData('text/plain', text_only);
    clipdata.setData('text/html', text_only);
    e.preventDefault();
  })

  return (
    <div ref={noteRef} className="py-8 w-full max-w-full h-full overflow-auto flex flex-col">
      <h1 id="note-title" placeholder="Untitled" onKeyDown={handleTitleKeyDown} spellCheck contentEditable suppressContentEditableWarning className="text-4xl px-8 mt-1 font-semibold text-neutral-300 empty:text-neutral-600 focus:before:absolute focus:before:w-0.5 focus:before:h-full focus:before:bg-orange-700 border-l-4 border-l-transparent focus:border-l-orange-700 focus:before:-left-2 relative focus:outline-none empty:after:content-[attr(placeholder)] empty:after:pointer-events-none hyphens-manual break-all">
        {note.title}
      </h1>

      <p id="note-content" ref={contentRef} onInput={handleParagraphInput} placeholder="Simply type here..." spellCheck contentEditable suppressContentEditableWarning className="text-neutral-300 mt-8 px-8 items-center empty:text-neutral-600 focus:before:absolute focus:before:w-0.5 focus:before:h-full focus:before:bg-orange-700 border-l-4 border-l-transparent focus:border-l-orange-700 focus:before:-left-2 relative focus:outline-none empty:after:content-[attr(placeholder)] empty:after:pointer-events-none break-all hyphens-manual">
        {note.content}
      </p>
    </div>
  )
}