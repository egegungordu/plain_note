"use client";

import { TbBook, TbHeart } from "react-icons/tb";
import {
  useSelector,
  useDispatch,
  type TypedUseSelectorHook,
} from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setCurrentFolder,
  setStoreNotes,
  setStoreSearchResultInfo,
} from "@/store/notesSlice";
import clsx from "clsx";
import { getNotes } from "../actions";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

export default function QuickLinks() {
  const dispatch = useAppDispatch();
  const currentFolder = useAppSelector((state) => state.notes.currentFolder);

  const handleChangeFolderToAll = async () => {
    dispatch(setStoreSearchResultInfo({ count: 0, query: "" }));
    dispatch(setCurrentFolder("all"));
    const notes = await getNotes({});
    dispatch(setStoreNotes(notes));
  };

  const handleChangeFolderToFavorites = async () => {
    dispatch(setStoreSearchResultInfo({ count: 0, query: "" }));
    dispatch(setCurrentFolder("favorites"));
    const notes = await getNotes({ isFavorite: true });
    dispatch(setStoreNotes(notes));
  };

  return (
    <>
      <button
        onClick={() => handleChangeFolderToAll()}
        className={clsx(
          "flex items-center justify-start transition-colors px-10 py-2",
          currentFolder === "all"
            ? "bg-neutral-300 text-neutral-800 font-bold"
            : "hover:bg-neutral-800 text-neutral-300"
        )}
      >
        <TbBook className="w-5 h-5" />
        <h1 className="ml-2 text-sm">All Notes</h1>
      </button>

      <button
        onClick={() => handleChangeFolderToFavorites()}
        className={clsx(
          "flex items-center justify-start transition-colors px-10 py-2",
          currentFolder === "favorites"
            ? "bg-neutral-300 text-neutral-800 font-bold"
            : "hover:bg-neutral-800 text-neutral-300"
        )}
      >
        <TbHeart className="w-5 h-5" />
        <h1 className="ml-2 text-sm">Favorites</h1>
      </button>
    </>
  );
}
