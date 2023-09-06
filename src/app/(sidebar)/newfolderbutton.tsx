"use client";

import { TbCheck, TbPlus, TbX } from "react-icons/tb";
import { createFolder } from "../actions";
import { getFolders } from "../actions";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { setStoreFolders } from "@/store/notesSlice";
import { useState } from "react";
import CenteredModal from "@/components/centeredmodal";
import clsx from "clsx";

const useAppDispatch = () => useDispatch<AppDispatch>();

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
];

const NewFolderModal = ({
  onClose,
  show,
  onSubmit,
}: {
  onClose: () => void;
  show: boolean;
  onSubmit: (name: string, color: string) => void;
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const handleClose = () => {
    setName("");
    setColor(COLORS[0]);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(name, color);
    setName("");
    setColor(COLORS[0]);
  };

  return (
    <CenteredModal onClose={handleClose} show={show}>
      <div className="flex flex-col items-start justify-center py-6 px-6">
        <h1 className="text-lg font-semibold text-neutral-300">
          Create a new folder
        </h1>

        <div className="bg-neutral-800 h-[1px] w-full my-4" />

        <h2 className="text-xs text-neutral-400">Folder Name</h2>

        <input
          type="text"
          placeholder="Folder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full h-8 px-2 rounded-md bg-neutral-800 text-neutral-300 text-sm"
        />

        <h2 className="text-xs text-neutral-400 mt-4">Folder Color</h2>

        <div className="grid grid-cols-8 gap-2 mt-2">
          {COLORS.map((color_) => (
            <button
              key={color_}
              onClick={() => setColor(color_)}
              className={clsx(
                "w-8 h-8 rounded-full border-2 border-neutral-900",
                color === color_ && "ring-2 ring-white"
              )}
              style={{ backgroundColor: color_ }}
            ></button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 w-full mt-10">
          <button
            onClick={handleClose}
            className="flex items-center w-full justify-center px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <h1 className="text-sm text-neutral-300">Cancel</h1>
          </button>

          <button
            disabled={name === ""}
            onClick={handleSubmit}
            className="border-2 w-full border-orange-700 px-4 py-2 rounded-full hover:bg-orange-700 transition-colors h-10 flex items-center justify-center disabled:opacity-50"
          >
            <h1 className="text-sm text-neutral-300">Create</h1>
          </button>
        </div>
      </div>
    </CenteredModal>
  );
};

export default function NewFolderButton() {
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const dispatch = useAppDispatch();

  const closeModal = () => {
    setShowNewFolderModal(false);
  };

  const handleClick = async () => {
    setShowNewFolderModal(true);
  };

  const handleSubmit = async (name: string, color: string) => {
    setShowNewFolderModal(false);
    const folder = await createFolder({
      name,
      color,
    });
    if (!folder) return;
    const folders = await getFolders();
    dispatch(setStoreFolders(folders));
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center justify-start hover:bg-neutral-800 transition-colors px-9 py-2"
      >
        <TbPlus className="w-3.5 h-3.5 text-neutral-400" />
        <h1 className="ml-1 text-xs text-neutral-400">Add Folder</h1>
      </button>

      <NewFolderModal
        onClose={closeModal}
        show={showNewFolderModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
