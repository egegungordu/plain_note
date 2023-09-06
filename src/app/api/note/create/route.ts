import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authoptions";

export async function GET() {
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
    return note;
  }
}
