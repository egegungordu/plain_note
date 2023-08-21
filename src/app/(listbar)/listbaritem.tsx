"use client"
import Link from "next/link"
import { SmallNote } from "./listbaritems"
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import { TbHeart, TbHeartFilled, TbTrash } from "react-icons/tb";
import { deleteStoreNote, editStoreNote } from "@/store/notesSlice"
import { useSelector, useDispatch, type TypedUseSelectorHook } from "react-redux"
import { store, RootState, AppDispatch } from "@/store"
import { deleteNote } from "../serveractions";
import { saveNote } from "../note/[note]/serveractions";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
const useAppDispatch = () => useDispatch<AppDispatch>()

export default function ListbarItem({ note }: { note: SmallNote }) {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const selected = id === note.id;
  const dispatch = useAppDispatch();

  const title = useAppSelector((state) => {
    const editedNote = state.notes.editedNotesBuffer[note.id]
    if (editedNote) {
      return editedNote.title ?? note.title;
    } else {
      return note.title;
    }
  });

  const shortContent = useAppSelector((state) => {
    const editedNote = state.notes.editedNotesBuffer[note.id]
    if (editedNote) {
      return editedNote.content ?? note.shortContent;
    } else {
      return note.shortContent;
    }
  })

  const isFavorite = useAppSelector((state) => {
    const editedNote = state.notes.editedNotesBuffer[note.id]
    if (editedNote) {
      return editedNote.isFavorite ?? note.isFavorite;
    } else {
      return note.isFavorite;
    }
  })

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNote(note.id);
    dispatch(deleteStoreNote(note.id))
  }

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    saveNote({
      id: note.id,
      isFavorite: !isFavorite,
    })
    dispatch(editStoreNote({
      id: note.id,
      isFavorite: !isFavorite,
    }))
  }

  return (
    <li
      className={clsx("w-full group hover:bg-neutral-800/50", selected && "bg-neutral-800/50")}
    >
      <Link href={`/note/${note.id}`} className="w-full">
        <div className="pl-8 pr-4 py-3 flex items-center justify-start">
          <div className="flex flex-col items-center justify-center">
            <h2 placeholder="Untitled" className="text-neutral-300 w-64 group-hover:w-48 text-sm font-semibold overflow-ellipsis overflow-hidden whitespace-nowrap empty:after:content-[attr(placeholder)]">
              {title}
            </h2>

            <div className="flex items-center mt-1 w-64 group-hover:w-48">
              <span className="text-neutral-500 text-xs">
                {note.createdAt.toLocaleDateString()}
              </span>

              <p className="text-neutral-500 text-xs ml-2 overflow-ellipsis overflow-hidden whitespace-nowrap group-hover:hidden">
                {shortContent}
              </p>

              <span className="text-neutral-500 text-xs ml-2 hidden group-hover:block">
                {note.createdAt.toLocaleTimeString([], { timeStyle: "short" })
                  .replace("AM", "am")
                  .replace("PM", "pm")}
              </span>
            </div>
          </div>

          <div className="flex-grow hidden group-hover:flex items-center justify-end">
            <button onClick={handleToggleFavorite} className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800/50 hover:bg-neutral-700/75 focus:outline-none">
              {isFavorite ? (
                <TbHeartFilled className="w-4 h-4 text-neutral-300" />
              ) : (
                <TbHeart className="w-4 h-4 text-neutral-300" />
              )}

            </button>

            <button onClick={handleDelete}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-800/80 hover:bg-red-700/75 focus:outline-none ml-2">
              <TbTrash className="w-4 h-4 text-neutral-300" />
            </button>
          </div>
        </div>
      </Link>
    </li>
  )
}