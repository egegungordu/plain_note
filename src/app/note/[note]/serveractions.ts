"use server";

import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions";

export async function saveNote({
  id,
  title,
  content,
  isFavorite,
}: {
  id: string;
  title?: string;
  content?: string;
  isFavorite?: boolean;
}) {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return;
  const shortContent = content ? content.slice(0, 64) : undefined;
  const note = await prisma.note.update({
    where: { id, owner },
    data: { title, content, shortContent, isFavorite },
  });

  return note;
}
