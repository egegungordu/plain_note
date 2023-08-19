import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/db"
import ListbarItemsClient from "./listbaritemsclient";

async function getNotes() {
  const session = await getServerSession(authOptions);

  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: "desc"
    },
    where: {
      owner: {
        equals: session?.user?.email ?? "unknown"
      }
    },
    select: {
      id: true,
      title: true,
      shortContent: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  return notes;
}

export type SmallNote = Awaited<ReturnType<typeof getNotes>>[number]

export default async function ListbarItems() {
  const notes = await getNotes()
  return (
    <>
      <ListbarItemsClient notes={notes} />
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