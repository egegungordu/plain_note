import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { authOptions } from "../../auth/[...nextauth]/authoptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const req = await request.json();
  const id = req.id;
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email!;

  if (!session) {
    return null;
  }

  const note = await prisma.note.delete({
    where: { id, owner },
  });

  return NextResponse.json(note);
}
