"use server"

import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function deleteNote(id: string) {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email!;

  if (!session) {
    return null;
  }

  const note = await prisma.note.delete({
    where: { id, owner }
  });

  return note;
}
