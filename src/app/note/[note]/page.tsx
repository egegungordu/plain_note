import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions";
import InteractiveNote from "./interactivenote"
import InteractiveHeader from "./interactiveheader";

async function getNoteById(id: string) {
  "use server"

  const session = await getServerSession(authOptions);

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
    <section className="flex flex-col w-full h-full">
      <InteractiveHeader note={note} />
      <InteractiveNote note={note} />
    </section>
  )
}
