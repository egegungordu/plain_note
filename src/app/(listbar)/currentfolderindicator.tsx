"use client";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import { RootState } from "@/store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function CurrentFolderIndicator() {
  const currentFolder = useAppSelector((state) => state.notes.currentFolder);
  const folders = useAppSelector((state) => state.notes.folders);

  //TODO FIX: there is a problem with using folders here, check browser console

  const getFolderName = () => {
    if (currentFolder === "all") return "All Notes";
    if (currentFolder === "favorites") return "Favorites";
    return folders.find((folder) => folder.id === currentFolder)?.name;
  };

  return (
    <h2 className="text-neutral-500 text-xl font-bold mt-4 px-10 break-all">
      {getFolderName()}
    </h2>
  );
}
