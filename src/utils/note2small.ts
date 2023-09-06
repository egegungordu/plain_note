import { Note } from "@prisma/client";
import { SmallNote } from "@/app/actions";

const SHORT_CONTENT_LENGTH = 64;

export default function note2small(note: Note): SmallNote;
export default function note2small(content: string): string;
export default function note2small(note: Note | string): SmallNote | string {
  if (typeof note === "string") {
    return note.slice(0, SHORT_CONTENT_LENGTH);
  } else {
    return {
      ...note,
      shortContent: note.content
        ? note.content.slice(0, SHORT_CONTENT_LENGTH)
        : "",
    };
  }
}
