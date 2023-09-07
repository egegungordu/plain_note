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
import { useTransition, useState } from "react";
import CenteredModal from "@/components/centeredmodal";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function DeleteFolderModal({
  show,
  deleteTarget,
  onClose,
  onSubmit,
}: {
  show: boolean;
  deleteTarget: Folder | null;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <CenteredModal show={show} onClose={onClose}>
      <div className="flex flex-col items-center justify-center py-6 px-6">
        <h1 className="text-xl font-bold text-neutral-200 mb-4">
          Delete folder?
        </h1>
        <p className="text-sm text-neutral-300">
          Are you sure you want to delete the folder{" "}
          <span className="font-bold">
            {deleteTarget ? deleteTarget.name : ""}
          </span>
          ? <br /> The notes inside this folder will not be deleted.
        </p>
        <div className="flex items-center justify-between gap-4 w-full mt-10">
          <button
            onClick={onClose}
            className="flex text-sm text-neutral-300 items-center w-full justify-center px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="border-2 text-sm text-neutral-300 w-full border-red-700 px-4 py-2 rounded-full hover:bg-red-700 transition-colors h-10 flex items-center justify-center"
          >
            Delete
          </button>
        </div>
      </div>
    </CenteredModal>
  );
}

function Folder({
  folder,
  handleClick,
  handleDelete,
  currentFolder,
}: {
  folder: Folder;
  handleClick: (id: string) => void;
  handleDelete: (folder: Folder) => Promise<void>;
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
        onClick={() => startDeleteTransition(() => handleDelete(folder))}
        className="text-xs text-neutral-300 px-2 py-1 opacity-0 flex absolute group-hover:opacity-100 transition-opacity right-4 top-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 focus:outline-none ml-2"
      >
        Delete
      </button>
    </div>
  );
}

export default function FoldersClient() {
  const folders = useAppSelector((state) => state.notes.folders);
  const currentFolder = useAppSelector((state) => state.notes.currentFolder);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Folder | null>(null);
  const dispatch = useAppDispatch();

  const handleClick = async (id: string) => {
    dispatch(setStoreSearchResultInfo({ count: 0, query: "" }));
    dispatch(setCurrentFolder(id));
    const notes = await getNotes({
      folderId: id,
    });
    dispatch(setStoreNotes(notes));
  };

  const handleDelete = async (folder: Folder) => {
    setShowDeleteFolderModal(true);
    setDeleteTarget(folder);
  };

  const handleSubmitDelete = async () => {
    setShowDeleteFolderModal(false);
    if (!deleteTarget) return;
    await deleteFolder(deleteTarget.id);
    const folders = await getFolders();
    dispatch(setStoreFolders(folders));
    const notes = await getNotes({});
    dispatch(setStoreNotes(notes));
    if (deleteTarget.id === currentFolder) {
      dispatch(setStoreSearchResultInfo({ count: 0, query: "" }));
      dispatch(setCurrentFolder("all"));
    }
  };

  const handleCloseDeleteFolderModal = () => {
    setShowDeleteFolderModal(false);
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

      <DeleteFolderModal
        show={showDeleteFolderModal}
        deleteTarget={deleteTarget}
        onClose={handleCloseDeleteFolderModal}
        onSubmit={handleSubmitDelete}
      />
    </>
  );
}
