import { Note } from "@prisma/client";
import { SmallNote } from "@/app/(listbar)/listbaritems";

export default function note2small(note: Note): SmallNote {
  return {
    id: note.id,
    title: note.title,
    shortContent: note.content ? note.content.slice(0, 64) : "",
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    isFavorite: note.isFavorite,
  };
}
