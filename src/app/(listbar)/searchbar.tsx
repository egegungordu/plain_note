"use client";

import { TbSearch } from "react-icons/tb";
import { getNotes } from "../actions";
import {
  useSelector,
  useDispatch,
  type TypedUseSelectorHook,
} from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setStoreNotes, setStoreSearchResultInfo } from "@/store/notesSlice";
import { useState } from "react";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

export default function Searchbar() {
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const currentFolder = useAppSelector((state) => state.notes.currentFolder);
  const searchResultInfo = useAppSelector(
    (state) => state.notes.searchResultInfo
  );

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // return if search hasn't changed
    if (search === searchResultInfo.query) return;
    const notes = await getNotes({
      search,
      isFavorite: currentFolder === "favorites" ? true : undefined,
      folderId:
        currentFolder === "all" || currentFolder === "favorites"
          ? undefined
          : currentFolder,
    });
    dispatch(setStoreNotes(notes));
    dispatch(
      setStoreSearchResultInfo({
        count: notes.length,
        query: search,
      })
    );
  };

  return (
    <form className="relative px-4 w-full" onSubmit={handleSearch}>
      <input
        placeholder="Search for keywords..."
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-neutral-800 rounded-full h-10 w-full text-neutral-300 text-sm pl-4 pr-10"
      />
      <button
        type="submit"
        className="absolute flex items-center justify-center right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full hover:bg-neutral-700 transition-colors"
      >
        <TbSearch className="text-lg text-neutral-300" />
      </button>
    </form>
  );
}

export function SearchbarResultInfo() {
  const { count, query } = useAppSelector(
    (state) => state.notes.searchResultInfo
  );
  const showResultInfo = query !== "";
  return (
    <p className="text-neutral-500 text-xs font-medium px-8 mt-2 break-all w-full">
      {showResultInfo && (
        <>
          {count} result{count > 1 ? "s" : ""} for{" "}
          <span>&quot;{query}&quot;</span>
        </>
      )}
    </p>
  );
}
