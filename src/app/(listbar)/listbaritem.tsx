"use client"
import Link from "next/link"
import { SmallNote } from "./listbaritems"
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import { TbHeart, TbHeartFilled, TbTrash } from "react-icons/tb";
import { deleteStoreNote, updateStoreNote } from "@/store/notesSlice"
import { useSelector, useDispatch, type TypedUseSelectorHook } from "react-redux"
import { store, RootState, AppDispatch } from "@/store"
import TooltipElement from "@/components/tooltipelement";
import { useRouter } from "next/navigation";
import { trpc } from "../(trpc)/client";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
const useAppDispatch = () => useDispatch<AppDispatch>()

export default function ListbarItem({ index, note }: { index: number, note: SmallNote }) {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const selected = id === note.id;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const deleteNote = trpc.note.delete.useMutation();
  const saveNote = trpc.note.update.useMutation();

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
    deleteNote.mutate({ id: note.id })
    dispatch(deleteStoreNote(note.id))
    if (selected) {
      const nextNoteIndex = index; // because this note will be deleted
      const nextNote = store.getState().notes.notes[nextNoteIndex]
      const prevNoteIndex = index - 1;
      const prevNote = store.getState().notes.notes[prevNoteIndex]

      if (nextNote) {
        router.push(`/note/${nextNote.id}`)
      } else if (prevNote) {
        router.push(`/note/${prevNote.id}`)
      } else {
        router.push("/")
      }
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    saveNote.mutate({
      id: note.id,
      isFavorite: !isFavorite,
    })
    dispatch(updateStoreNote({
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
            <TooltipElement
              onClick={handleToggleFavorite}
              as="button"
              offset={8}
              text="Favorite"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800/50 hover:bg-neutral-700/75 focus:outline-none">
              {isFavorite ? (
                <TbHeartFilled className="w-4 h-4 text-neutral-300" />
              ) : (
                <TbHeart className="w-4 h-4 text-neutral-300" />
              )}
            </TooltipElement>

            <TooltipElement
              text="Delete"
              as="button"
              offset={8}
              onClick={handleDelete}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-800/80 hover:bg-red-700/75 focus:outline-none ml-2">
              <TbTrash className="w-4 h-4 text-neutral-300" />
            </TooltipElement>
          </div>
        </div>
      </Link>
    </li>
  )
}