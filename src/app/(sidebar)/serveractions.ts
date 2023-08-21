"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions";

export async function createNote() {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return;
  const loggedIn = owner != undefined;

  if (loggedIn) {
    const note = await prisma.note.create({
      data: {
        title: "",
        content: "",
        shortContent: "",
        owner,
      },
    });

    revalidatePath("/");

    return note;
  }
}
