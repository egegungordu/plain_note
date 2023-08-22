import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { authOptions } from "../../auth/[...nextauth]/authoptions";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  console.log(session);
  if (!owner) return;

  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      owner: {
        equals: owner,
      },
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
