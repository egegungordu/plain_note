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

  const note = await prisma.note.findUniqueOrThrow({
    where: { id, owner }
  });

  return note;
}

export default async function Note({
  params,
}: {
  params: { note: string }
}) {
  const note = (await getNoteById(params.note))!;

  return (
    <section className="flex flex-col w-full h-full">
      <InteractiveHeader note={note} />
      <InteractiveNote note={note} />
    </section>
  )
}
