"use server";

import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function saveNote({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: string;
}) {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return;
  const shortContent = content.slice(0, 64);
  const note = await prisma.note.update({
    where: { id, owner },
    data: { title, content, shortContent },
  });

  return note;
}
