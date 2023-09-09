"use client";

import { SmallNote } from "@/app/actions";
import CenteredModal from "./centeredmodal";
import { useTransition } from "react";

export default function DeleteNoteModal({
  show,
  note,
  onClose,
  onSubmit,
}: {
  show: boolean;
  note: SmallNote;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}) {
  const [isDeleting, startDeleteTransition] = useTransition();

  return (
    <CenteredModal show={show} onClose={onClose}>
      <div className="flex flex-col items-center justify-center py-6 px-6">
        <h1 className="text-xl font-bold text-neutral-200 mb-4">
          Delete note?
        </h1>
        <p className="text-sm text-neutral-300">
          Are you sure you want to delete the note{" "}
          <span className="font-bold">
            {note.title ? note.title : "Untitled"}
          </span>
          ?
        </p>
        <div className="flex items-center justify-between gap-4 w-full mt-10">
          <button
            onClick={onClose}
            className="flex text-sm text-neutral-300 items-center w-full justify-center px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => startDeleteTransition(onSubmit)}
            disabled={isDeleting}
            className="border-2 text-sm text-neutral-300 w-full border-red-700 px-4 py-2 rounded-full hover:bg-red-700 transition-colors h-10 flex items-center justify-center disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </CenteredModal>
  );
}
