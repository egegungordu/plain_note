"use client"
import Link from "next/link"
import { SmallNote } from "./listbaritems"
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';

export default function ListbarItem({ note }: { note: SmallNote }) {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const selected = id === note.id;

  return (
    <li
      className={clsx("w-full group hover:bg-neutral-800/50", selected && "bg-neutral-800/50")}
    >
      <Link href={`/note/${note.id}`} className="w-full">
        <div className="px-8 py-3 ">
          <h2 placeholder="Untitled" className="text-neutral-300 w-64 text-sm font-semibold overflow-ellipsis overflow-hidden whitespace-nowrap empty:after:content-[attr(placeholder)]">
            {note.title}
          </h2>
          <div className="flex items-center mt-1 w-64">
            <span className="text-neutral-500 text-xs">
              {note.createdAt.toLocaleDateString()}
            </span>
            <p className="text-neutral-500 text-xs ml-2 overflow-ellipsis overflow-hidden whitespace-nowrap group-hover:hidden">
              {note.shortContent}
            </p>
            <span className="text-neutral-500 text-xs ml-2 hidden group-hover:block">
              {note.createdAt.toLocaleTimeString([], { timeStyle: "short" })
                .replace("AM", "am")
                .replace("PM", "pm")}
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
}