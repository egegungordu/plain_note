import ListbarItemsClient from "./listbaritemsclient";
import { store } from "@/store";
import { setStoreNotes } from "@/store/notesSlice";
import ReduxPreloader from "@/components/reduxpreloader";
import { serverClient } from "../(trpc)/serverClient";
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from "@/server";

export type SmallNote = inferRouterOutputs<AppRouter>['note']['get'][number]

export default async function ListbarItems() {
  const notes = await serverClient.note.get();
  store.dispatch(setStoreNotes(notes));

  return (
    <>
      <ReduxPreloader notes={notes} />
      <ListbarItemsClient />
    </>
  )
}

export function ListbarItemsSkeleton() {
  return (
    <ul className="flex flex-col animate-pulse items-center justify-start mt-4 divide-y divide-neutral-800">
      {Array.from({ length: 5 }).map((_, index) => (
        <li
          key={index}
          className="w-full  hover:bg-neutral-800/50"
        >
          <div className="px-8 py-3 ">
            <div className="w-40 h-4 bg-neutral-800 rounded" />
            <div className="flex items-center mt-2 w-64">
              <div className="w-10 h-4 bg-neutral-800 rounded" />
              <div className="w-20 h-4 bg-neutral-800 rounded ml-2" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}