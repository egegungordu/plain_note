import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authoptions";

export async function GET() {
  // const { searchParams } = new URL(request.url);
  // const id = searchParams.get("id");
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return [];
  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      owner,
    },
    select: {
      id: true,
      title: true,
      shortContent: true,
      createdAt: true,
      updatedAt: true,
      isFavorite: true,
    },
  });

  return NextResponse.json(notes);
}
