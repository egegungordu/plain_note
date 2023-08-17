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

const NEXTAUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? `__Secure-next-auth.session-token`
    : "next-auth.session-token";

export async function createNote() {
  "use server";

  const token = cookies().get(NEXTAUTH_COOKIE_NAME);
  const session = await decode({
    token: token?.value,
    secret: process.env.NEXTAUTH_SECRET,
  });
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
