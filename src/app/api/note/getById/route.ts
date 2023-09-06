import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authoptions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return;
  const note = await prisma.note.findUnique({
    where: {
      id,
      owner,
    },
  });
  return note;

  return NextResponse.json(note);
}
