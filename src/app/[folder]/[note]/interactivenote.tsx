"use client";

import { Note } from "@/app/actions";
import {
  FormEventHandler,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { updateStoreNote } from "@/store/notesSlice";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import { store, AppDispatch, RootState } from "@/store";
import clsx from "clsx";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function InteractiveNote({ note }: { note: Note }) {
  const noteRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [editedNote, setEditedNote] = useState(note);
  const isFullscreen = useAppSelector((state) => state.ui.isFullscreen);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const editedNote = store.getState().notes.editedNotesBuffer[note.id];
    if (editedNote) {
      setEditedNote((prev) => ({
        ...prev,
        content: editedNote.content ?? prev.content,
        title: editedNote.title ?? prev.title,
      }));
    }
  }, [note.id]);

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.focus();
    }
  };

  const handleTitleInput = (e: React.ChangeEvent<HTMLHeadingElement>) => {
    dispatch(
      updateStoreNote({
        id: note.id,
        title: e.currentTarget.textContent ?? "",
        saved: false,
      })
    );
  };

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
      e.currentTarget.innerHTML = "";
    }

    dispatch(
      updateStoreNote({
        id: note.id,
        content: e.currentTarget.textContent ?? "",
        saved: false,
      })
    );
  };

  return (
    <div
      ref={noteRef}
      className={clsx(
        isFullscreen && "px-8 md:px-16 lg:px-32",
        "py-8 w-full max-w-full h-full overflow-auto flex flex-col"
      )}
    >
      <h1
        id="note-title"
        placeholder="Untitled"
        onInput={handleTitleInput}
        onKeyDown={handleTitleKeyDown}
        spellCheck
        /* @ts-ignore */
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        className="text-4xl px-8 mt-1 font-semibold text-neutral-300 empty:text-neutral-600 border-l-4 border-l-transparent focus:border-l-orange-700 focus:outline-none empty:after:content-[attr(placeholder)] empty:after:pointer-events-none hyphens-manual break-all"
      >
        {editedNote.title}
      </h1>

      <div
        id="note-content"
        ref={contentRef}
        onInput={handleContentInput}
        placeholder="Simply type here..."
        spellCheck
        /* @ts-ignore */
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        className="inline-block text-neutral-300 mt-8 px-8 items-center empty:text-neutral-600 border-l-4 border-l-transparent focus:border-l-orange-700 focus:outline-none empty:after:content-[attr(placeholder)] empty:after:pointer-events-none break-all hyphens-manual"
      >
        {editedNote.content}
      </div>
    </div>
  );
}
