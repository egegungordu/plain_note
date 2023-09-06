"use client";

import { Note } from "@prisma/client";
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
import { updateStoreNote } from "@/store/notesSlice";
import { useRouter } from "next/navigation";
import { getRelativeTimeString } from "@/utils";
import { updateNote } from "@/app/actions";

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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const editedNote = useAppSelector(
    (state) => state.notes.editedNotesBuffer[note.id]
  );

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

      <button className="flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800">
        <TbDots className="w-4 h-4" />
      </button>
    </section>
  );
}
