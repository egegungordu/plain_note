import { TbSearch } from "react-icons/tb"
import ListbarItem from "./listbaritem"

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
}

async function getNotes() {
  await new Promise((resolve) => setTimeout(resolve, 4000))
  return [
    {
      id: "1",
      title: "Note 1",
      content: "Content 1",
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Note 2",
      content: "Content 2",
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Note 3",
      content: "Content 3",
      createdAt: new Date(),
    },
  ] as Note[]
}

export default async function Listbar() {
  const notes = await getNotes()

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

      <ul className="flex flex-col items-center justify-start mt-4 divide-y divide-neutral-800">
        {notes.map((note) => (
          <ListbarItem key={note.id} note={note} />
        ))}
      </ul>
    </section >
  )
}