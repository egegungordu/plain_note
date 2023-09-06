"use client";

import {
  useSelector,
  useDispatch,
  type TypedUseSelectorHook,
} from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setStoreNotes,
  setCurrentFolder,
  setStoreSearchResultInfo,
  setStoreFolders,
} from "@/store/notesSlice";
import { Folder, deleteFolder, getFolders, getNotes } from "../actions";
import clsx from "clsx";
import { useTransition } from "react";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function Folder({
  folder,
  handleClick,
  handleDelete,
  currentFolder,
}: {
  folder: Folder;
  handleClick: (id: string) => void;
  handleDelete: (id: string) => Promise<void>;
  currentFolder: string;
}) {
  const [deleteIsPending, startDeleteTransition] = useTransition();

  return (
    <div
      className={clsx(
        "group relative",
        deleteIsPending && "opacity-50 pointer-events-none"
      )}
    >
      <button
        onClick={() => handleClick(folder.id)}
        key={folder.id}
        className={clsx(
          "flex items-center justify-start transition-colors px-10 py-2 w-full",
          currentFolder === folder.id
            ? "bg-neutral-300 text-neutral-800"
            : "hover:bg-neutral-800 text-neutral-300"
        )}
      >
        <div
          className={clsx(
            "rounded-full flex-shrink-0 transition-colors w-2 h-2",
            currentFolder === folder.id && "ring-2 ring-neutral-900"
          )}
          style={{ backgroundColor: folder.color }}
        />

        <h1
          className={clsx(
            "ml-2 text-sm text-ellipsis overflow-hidden",
            currentFolder === folder.id && "font-bold"
          )}
        >
          {folder.name}
        </h1>
      </button>

      <button
        onClick={() => startDeleteTransition(() => handleDelete(folder.id))}
        className="text-xs text-neutral-300 px-2 py-1 hidden absolute group-hover:flex right-4 top-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 focus:outline-none ml-2"
      >
        Delete
      </button>
    </div>
  );
}

export default function FoldersClient() {
  const folders = useAppSelector((state) => state.notes.folders);
  const currentFolder = useAppSelector((state) => state.notes.currentFolder);
  const dispatch = useAppDispatch();

  const handleClick = async (id: string) => {
    dispatch(setStoreSearchResultInfo({ count: 0, query: "" }));
    dispatch(setCurrentFolder(id));
    const notes = await getNotes({
      folderId: id,
    });
    dispatch(setStoreNotes(notes));
  };

  const handleDelete = async (id: string) => {
    await deleteFolder(id);
    const folders = await getFolders();
    dispatch(setStoreFolders(folders));
    if (id === currentFolder) {
      dispatch(setStoreSearchResultInfo({ count: 0, query: "" }));
      const notes = await getNotes({});
      dispatch(setStoreNotes(notes));
      dispatch(setCurrentFolder("all"));
    }
  };

  return (
    <>
      {folders.map((folder) => (
        <Folder
          key={folder.id}
          folder={folder}
          handleClick={handleClick}
          handleDelete={handleDelete}
          currentFolder={currentFolder}
        />
      ))}
    </>
  );
}
