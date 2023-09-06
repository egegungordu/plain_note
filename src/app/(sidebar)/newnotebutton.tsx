"use client";

import { TbLoader2, TbPencil } from "react-icons/tb";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setCurrentFolder, setStoreNotes } from "@/store/notesSlice";
import { createNote, getNotes } from "../actions";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

export default function NewNoteButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentFolder = useAppSelector((state) => state.notes.currentFolder);

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          const folderId =
            currentFolder === "all" || currentFolder === "favorites"
              ? undefined
              : currentFolder;
          const note = await createNote(folderId);
          if (!note) return;
          setTimeout(() => {
            router.push(`/note/${note.id}`);
          }, 0);
          if (folderId === undefined) {
            dispatch(setCurrentFolder("all"));
            const notes = await getNotes({});
            dispatch(setStoreNotes(notes));
          } else {
            const notes = await getNotes({
              folderId: currentFolder,
            });
            dispatch(setStoreNotes(notes));
          }
        });
      }}
      disabled={isPending}
      className="border-2 border-orange-700 mx-4 mt-4 rounded-full hover:bg-orange-700 transition-colors h-10 flex-shrink-0 flex items-center justify-center disabled:opacity-70"
    >
      {isPending ? (
        <TbLoader2 className="text-lg animate-spin text-neutral-300" />
      ) : (
        <>
          <span className="text-sm font-semibold text-neutral-300">
            New note
          </span>
          <TbPencil className="text-lg text-neutral-300 ml-2" />
        </>
      )}
    </button>
  );
}
