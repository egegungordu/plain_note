import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { authOptions } from "../../auth/[...nextauth]/authoptions";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  const req = await request.json();
  const { id, content, title, isFavorite } = req;
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return;
  const shortContent = content ? content.slice(0, 64) : undefined;
  const note = await prisma.note.update({
    where: { id, owner },
    data: { title, content, shortContent, isFavorite },
  });
  return NextResponse.json(note);
}
