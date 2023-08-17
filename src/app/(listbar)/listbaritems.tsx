import { Note } from "./listbar"
import ListbarItem from "./listbaritem"

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

export default async function ListbarItems() {
  const notes = await getNotes()

  return (
    <ul className="flex flex-col items-center justify-start mt-4 divide-y divide-neutral-800">
      {notes.map((note) => (
        <ListbarItem key={note.id} note={note} />
      ))}
    </ul>
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