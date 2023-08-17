"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { prisma } from "@/db";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_SECRET: string;
    }
  }
}

export async function createNote() {
  "use server";

  const token = cookies().get("next-auth.session-token");
  const session = await decode({
    token: token?.value,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log(token);
  console.log(session);
  const owner = session?.email;
  const loggedIn = owner != undefined;

  if (loggedIn) {
    const note = await prisma.note.create({
      data: {
        title: "New Note",
        content: "This is a new note",
        owner,
      },
    });

    revalidatePath("/");

    return note;
  }
}
