"use server";

import { prisma } from "@/db";

export async function saveNote({
  id,
  title,
  content,
  owner,
}: {
  id: string;
  title: string;
  content: string;
  owner: string;
}) {
  const note = await prisma.note.update({
    where: { id, owner },
    data: { title, content },
  });

  return note;
}
