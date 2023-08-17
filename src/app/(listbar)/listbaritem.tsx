"use client"
import { Note } from "./listbar"
import Link from "next/link"

export default function ListbarItem({ note }: { note: Note }) {
  return (
    <li
      className="w-full  hover:bg-neutral-800/50"
    >
      <Link href={`/note/${note.id}`} className="w-full">
        <div className="px-8 py-3 ">
          <h2 className="text-neutral-300 text-sm font-semibold">
            {note.title}
          </h2>
          <div className="flex items-center mt-1 w-64">
            <span className="text-neutral-500 text-xs">
              {note.createdAt.toLocaleDateString()}
            </span>
            <p className="text-neutral-500 text-xs ml-2 overflow-ellipsis overflow-hidden whitespace-nowrap">
              {note.content}
            </p>
          </div>
        </div>
      </Link>
    </li>
  )
}