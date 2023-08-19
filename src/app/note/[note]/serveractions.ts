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
  const shortContent = content.slice(0, 64);
  const note = await prisma.note.update({
    where: { id, owner },
    data: { title, content, shortContent },
  });

  return note;
}
