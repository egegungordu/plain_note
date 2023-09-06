"use client";

import ListbarItem from "./listbaritem";

import { useSelector, type TypedUseSelectorHook } from "react-redux";
import { RootState } from "@/store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function ListbarItemsClient() {
  const storeNotes = useAppSelector((state) => state.notes.notes);

  return (
    <ul
      id="listbar"
      className="flex flex-col items-center justify-start mt-2 divide-y divide-neutral-800 pt-4 -translate-y-4 overflow-auto"
    >
      {/* <button onClick={() => scrollTo("6addb185-f725-44e2-92df-a8d168eb68e5")}>Scroll to 1</button> */}
      {/* <div aria-hidden={true} className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-600/60" /> */}
      {storeNotes.map((note, index) => (
        <ListbarItem
          index={index}
          key={note.id}
          note={note}
          data-id={note.id}
        />
      ))}
    </ul>
  );
}
