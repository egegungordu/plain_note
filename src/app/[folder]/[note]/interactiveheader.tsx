"use client";

import { useState, useTransition, useEffect, useRef, Suspense } from "react";
import {
  TbArrowsMaximize,
  TbArrowsMinimize,
  TbCross,
  TbDeviceFloppy,
  TbDots,
  TbX,
} from "react-icons/tb";
import {
  useSelector,
  useDispatch,
  type TypedUseSelectorHook,
} from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setIsFullscreen } from "@/store/uiSlice";
import {
  updateStoreNote,
  deleteStoreNote,
  setStoreFolders,
  setStoreNotes,
  setStoreSearchResultInfo,
  setCurrentFolder,
} from "@/store/notesSlice";
import { useRouter } from "next/navigation";
import { getRelativeTimeString } from "@/utils";
import {
  updateNote,
  deleteNote,
  Note,
  getFolders,
  getNotes,
} from "@/app/actions";
import Popover from "@/components/popover";
import DeleteNoteModal from "@/components/deletenotemodal";
import CenteredModal from "@/components/centeredmodal";
import { store } from "@/store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

function useKey(
  key: string,
  cb: (event: KeyboardEvent) => void,
  prevent = false
) {
  const callback = useRef(cb);

  useEffect(() => {
    callback.current = cb;
  });

  useEffect(() => {
    function handle(event: KeyboardEvent) {
      if (
        event.code === key ||
        (key === "ctrls" && event.key === "s" && event.ctrlKey)
      ) {
        if (prevent) event.preventDefault();
        callback.current(event);
      }
    }

    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [key]);
}

const useTimedRerender = (interval: number) => {
  const [_, setRefresh] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefresh((prev) => prev + 1);
    }, interval);
    return () => clearInterval(intervalId);
  }, []);
};

function LastSavedIndicator({ note }: { note: Note }) {
  const lastSavedString = useAppSelector((state) => {
    const editedNote = state.notes.editedNotesBuffer[note.id];
    if (!editedNote)
      return `last saved ${getRelativeTimeString(note.updatedAt)}`;
    if (editedNote.saved && editedNote.updatedAt)
      return `last saved ${getRelativeTimeString(editedNote.updatedAt)}`;

    return "last changes not saved";
  });

  // rerender the this component every 10 seconds
  useTimedRerender(10000);

  // prevent text mismatch with server
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  if (!isMounted)
    return (
      <span className="ml-1 animate-pulse w-20 h-6 text-xs bg-neutral-800 mt-0.5 rounded" />
    );

  return (
    <span className="ml-1 text-xs text-neutral-400 mt-0.5 overflow-hidden whitespace-nowrap">
      {lastSavedString}
    </span>
  );
}

export default function InteractiveHeader({ note }: { note: Note }) {
  const [isPending, startTransition] = useTransition();
  const isFullscreen = useAppSelector((state) => state.ui.isFullscreen);
  const [showMorePopover, setShowMorePopover] = useState(false);
  const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);
  const [favoriteIsPending, startFavoriteTransition] = useTransition();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const editedNote = useAppSelector(
    (state) => state.notes.editedNotesBuffer[note.id]
  );

  const isFavorite = useAppSelector((state) => {
    const editedNote = state.notes.editedNotesBuffer[note.id];
    if (editedNote) {
      return editedNote.isFavorite ?? note.isFavorite;
    } else {
      return note.isFavorite;
    }
  });

  const handleCloseMorePopover = () => {
    // setShowDeleteNoteModal(false);
    setShowMorePopover(false);
  };

  const handleOpenMorePopover = () => {
    setShowMorePopover(true);
  };

  const getNoteState = () => {
    // this is not react style, but whatever
    const title = document.querySelector("#note-title") as HTMLHeadingElement;
    const content = document.querySelector(
      "#note-content"
    ) as HTMLParagraphElement;

    return {
      title: title.textContent! ?? "",
      content: content.textContent ?? "",
    };
  };

  const handleClose = () => {
    router.push("/");
    if (isFullscreen) handleToggleFullscreen();
  };

  const handleSave = () => {
    const { title, content } = getNoteState();
    const id = note.id;

    // if the note was last saved, don't save it again
    if (editedNote !== undefined && editedNote.saved) return;

    startTransition(async () => {
      const note = await updateNote({
        id,
        title,
        content,
      });
      if (!note) return;
      dispatch(updateStoreNote({ ...note, saved: true }));
    });
  };

  useKey("Escape", handleClose);
  useKey("ctrls", handleSave, true);

  const handleToggleFullscreen = () => {
    const sidebar = document.querySelector("#sidebar") as HTMLDivElement;
    const listbar = document.querySelector("#listbar") as HTMLDivElement;

    if (isFullscreen) {
      sidebar.classList.remove("hidden");
      listbar.classList.remove("hidden");
    } else {
      sidebar.classList.add("hidden");
      listbar.classList.add("hidden");
    }

    dispatch(setIsFullscreen(!isFullscreen));
  };

  const handleToggleFavorite = () =>
    startFavoriteTransition(async () => {
      const updatedNote = await updateNote({
        id: note.id,
        isFavorite: !isFavorite,
      });
      if (!updatedNote) return;
      dispatch(
        updateStoreNote({
          id: note.id,
          isFavorite: updatedNote.isFavorite,
          saved: store.getState().notes.editedNotesBuffer[note.id]?.saved,
        })
      );
    });

  const handleCloseDeleteNoteModal = () => {
    setShowDeleteNoteModal(false);
  };

  const handleMoveFolder = () => {
    setShowMoveFolderModal(true);
  };

  const handleDelete = () => {
    setShowDeleteNoteModal(true);
  };

  const handleSubmitDelete = async () => {
    await deleteNote(note.id);
    dispatch(deleteStoreNote(note.id));
    router.push("/");
  };

  const handleCloseMoveFolderModal = () => {
    setShowMoveFolderModal(false);
  };

  const handleSubmitMoveFolder = async (folderId: string) => {
    await updateNote({
      id: note.id,
      folderId,
    });
    const notes = await getNotes({});
    dispatch(setStoreSearchResultInfo({ count: 0, query: "" }));
    dispatch(setCurrentFolder("all"));
    setShowMoveFolderModal(false);
    router.push("/");
    dispatch(setStoreNotes(notes));
  };

  return (
    <section className="mt-2 flex items-center px-4 py-2.5 w-full text-neutral-300 focus:outline-none">
      <button
        onClick={handleClose}
        className="flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800"
      >
        <TbX className="w-4 h-4" />
      </button>

      <button
        onClick={handleSave}
        className="flex text-sm items-center justify-center px-4 py-2 rounded-full hover:bg-neutral-800"
      >
        <TbDeviceFloppy className="w-5 h-5 mr-2" />
        Save
      </button>

      {isPending ? (
        <span className="ml-1 text-xs text-neutral-400 mt-0.5 overflow-hidden whitespace-nowrap">
          saving...
        </span>
      ) : (
        <LastSavedIndicator note={note} />
      )}

      <button
        onClick={handleToggleFullscreen}
        className="ml-auto flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800"
      >
        {isFullscreen ? (
          <TbArrowsMinimize className="w-4 h-4" />
        ) : (
          <TbArrowsMaximize className="w-4 h-4" />
        )}
      </button>

      <div className="relative">
        <Popover
          side="bl"
          show={showMorePopover}
          onClose={handleCloseMorePopover}
        >
          <div className="flex flex-col items-start justify-center py-3 gap-y-1 w-60">
            <button
              onClick={handleToggleFavorite}
              disabled={favoriteIsPending}
              className="text-sm text-neutral-300 w-full text-left hover:bg-neutral-800 py-2 px-6 disabled:opacity-50"
            >
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </button>

            <button
              onClick={handleMoveFolder}
              className="text-sm text-neutral-300 w-full text-left hover:bg-neutral-800 py-2 px-6"
            >
              Move folders
            </button>

            <button
              onClick={handleDelete}
              className="text-sm text-neutral-300 w-full text-left bg-red-800 hover:bg-red-700 py-2 px-6"
            >
              Delete
            </button>
          </div>
        </Popover>

        <button
          onClick={handleOpenMorePopover}
          className="flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800"
        >
          <TbDots className="w-4 h-4" />
        </button>

        <DeleteNoteModal
          show={showDeleteNoteModal}
          note={note}
          onClose={handleCloseDeleteNoteModal}
          onSubmit={handleSubmitDelete}
        />

        <ShowMoveFolderModal
          show={showMoveFolderModal}
          note={note}
          onClose={handleCloseMoveFolderModal}
          onSubmit={handleSubmitMoveFolder}
        />
      </div>
    </section>
  );
}

function ShowMoveFolderModal({
  show,
  onClose,
  onSubmit,
  note,
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: (folderId: string) => Promise<void>;
  note: Note;
}) {
  const [folderId, setFolderId] = useState("");
  const [isPending, startTransition] = useTransition();
  const folders = useAppSelector((state) => state.notes.folders);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setFolderId("");
    onClose();
  };

  return (
    <CenteredModal show={show} onClose={handleClose}>
      <div className="p-6">
        <h1 className="text-xl font-bold text-neutral-200 mb-4">
          Move to folder
        </h1>
        <p className="text-sm text-neutral-300 break-words">
          Select a folder to move the note{" "}
          <span className="font-bold">
            {note.title ? note.title : "Untitled"}
          </span>
          .
        </p>

        <select
          onChange={(e) => setFolderId(e.target.value)}
          value={folderId}
          className="w-full bg-neutral-800 text-neutral-300 rounded px-4 py-2 mt-4"
        >
          <option value="">Remove from folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-between gap-4 w-full mt-10">
          <button
            onClick={handleClose}
            className="flex items-center w-full justify-center px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <h1 className="text-sm text-neutral-300">Cancel</h1>
          </button>

          <button
            disabled={isPending}
            onClick={() => startTransition(() => onSubmit(folderId))}
            className="border-2 w-full border-orange-700 px-4 py-2 rounded-full hover:bg-orange-700 transition-colors h-10 flex items-center justify-center disabled:opacity-50"
          >
            <h1 className="text-sm text-neutral-300">Move</h1>
          </button>
        </div>
      </div>
    </CenteredModal>
  );
}
