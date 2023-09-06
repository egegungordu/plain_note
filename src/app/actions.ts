"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authoptions";
import { prisma } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { note2small } from "@/utils";

const convertToSearchQuery = (search: string) => {
  // remove all non-alphanumeric characters
  const searchQuery = search.replace(/[^a-zA-Z0-9 ]/g, "");
  if (searchQuery.length === 0) return searchQuery;
  // surround all words with * to make it a wildcard search
  return searchQuery
    .split(" ")
    .map((word) => `*${word}*`)
    .join(" ");
};

export type SmallNote = Awaited<ReturnType<typeof getNotes>>[number];
export async function getNotes({
  search,
  folderId,
  isFavorite,
}: {
  search?: string;
  folderId?: string;
  isFavorite?: boolean;
}) {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return [];
  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      owner,
      folderId,
      isFavorite,
      title: {
        contains: search,
      },
    },
    select: {
      id: true,
      title: true,
      shortContent: true,
      createdAt: true,
      updatedAt: true,
      isFavorite: true,
      folder: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

  return notes;
}

export type Note = NonNullable<Awaited<ReturnType<typeof getNoteById>>>;
export async function getNoteById(id: string) {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return null;
  const note = await prisma.note.findUnique({
    where: {
      id,
      owner,
    },
    include: {
      folder: true,
    },
  });
  return note;
}

export async function createNote(folderId?: string) {
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
        folderId,
      },
    });

    return note;
  }
}

export async function deleteNote(id: string) {
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
}

export async function updateNote({
  id,
  title,
  content,
  isFavorite,
}: {
  id: string;
  title?: string;
  content?: string;
  isFavorite?: boolean;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const owner = session?.user?.email!;
  const shortContent = content ? note2small(content) : undefined;

  const note = await prisma.note.update({
    where: {
      id,
      owner,
    },
    data: {
      title,
      content,
      shortContent,
      isFavorite,
    },
  });

  return note;
}

export type Folder = Awaited<ReturnType<typeof getFolders>>[number];
export async function getFolders() {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return [];
  const folders = await prisma.folder.findMany({
    where: {
      owner,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return folders;
}

export async function createFolder({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;
  if (!owner) return;
  const folder = await prisma.folder.create({
    data: {
      name,
      owner,
      color,
    },
  });
  return folder;
}

export async function deleteFolder(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const owner = session?.user?.email!;

  const folder = await prisma.folder.delete({
    where: {
      id,
      owner,
    },
  });

  return folder;
}

export async function updateFolder({
  id,
  name,
  color,
}: {
  id: string;
  name?: string;
  color?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const owner = session?.user?.email!;

  const folder = await prisma.folder.update({
    where: {
      id,
      owner,
    },
    data: {
      name,
      color,
    },
  });

  return folder;
}
