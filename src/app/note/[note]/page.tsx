import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import InteractiveNote from "./interactivenote"

async function getNoteById(id: string) {
  "use server"

  const session = await getServerSession();

  if (!session) {
    return null
  }

  const owner = session.user?.email!;

  const note = await prisma.note.findUnique({
    where: { id, owner }
  });

  return note;
}

export default async function Note({
  params,
}: {
  params: { note: string }
}) {
  const note = await getNoteById(params.note)

  if (!note) {
    return <div className="p-8 flex flex-col w-full justify-center items-center">
      <h1 className="text-3xl font-semibold text-neutral-300">
        Note not found
      </h1>
      <p className="text-neutral-400 mt-4">
        This note does not exist or you do not have permission to view it.
      </p>
    </div>
  }

  return (
    <InteractiveNote note={note} />
  )
}
