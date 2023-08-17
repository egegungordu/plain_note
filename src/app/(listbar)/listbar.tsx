import { TbSearch } from "react-icons/tb"
import ListbarItems, { ListbarItemsSkeleton } from "./listbaritems"
import { Suspense } from "react"

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
}

export default function Listbar() {
  return (
    <section className="flex flex-col border-r bg-neutral-900/70 border-r-neutral-800 py-4">
      <div className="relative px-4">
        <input placeholder="Search for keywords..." type="text" className="bg-neutral-800 rounded-full w-72 h-10 text-neutral-300 text-sm pl-4 pr-10" />
        <button className="absolute flex items-center justify-center right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full hover:bg-neutral-700 transition-colors">
          <TbSearch className="text-lg text-neutral-300" />
        </button>
      </div>
      <h2 className="text-neutral-500 text-xl font-bold mt-4 px-8">
        All Notes
      </h2>

      <Suspense fallback={<ListbarItemsSkeleton />}>
        <ListbarItems />
      </Suspense>
    </section >
  )
}