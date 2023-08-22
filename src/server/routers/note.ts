import { router, publicProcedure } from "../trpc";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions";
import { prisma } from "@/db";
import { z } from "zod";

export const noteRouter = router({
  get: publicProcedure.query(async () => {
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

    return notes;
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input: { id } }) => {
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
    }),

  create: publicProcedure.mutation(async () => {
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
  }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input: { id } }) => {
      const session = await getServerSession(authOptions);

      if (!session) {
        return null;
      }

      const owner = session?.user?.email!;

      const note = await prisma.note.delete({
        where: {
          id,
          owner,
        },
      });

      return note;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        isFavorite: z.boolean().optional(),
      })
    )
    .mutation(async ({ input: { id, title, content, isFavorite } }) => {
      const session = await getServerSession(authOptions);
      const owner = session?.user?.email;
      if (!owner) return;
      const shortContent = content ? content.slice(0, 64) : undefined;
      const note = await prisma.note.update({
        where: { id, owner },
        data: { title, content, shortContent, isFavorite },
      });
      return note;
    }),
});
