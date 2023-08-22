import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { authOptions } from "../../auth/[...nextauth]/authoptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function POST() {
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

    // revalidatePath("/");

    return NextResponse.json(note);
  }
}
