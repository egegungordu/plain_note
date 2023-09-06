import InteractiveNote from "./interactivenote";
import InteractiveHeader from "./interactiveheader";
import { Suspense } from "react";
import { TbArrowsMaximize, TbDeviceFloppy, TbDots, TbX } from "react-icons/tb";
import { getNoteById } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function Note({
  params,
}: {
  params: { folder: string; note: string };
}) {
  return (
    <section className="flex flex-col w-full h-full">
      <Suspense fallback={HeaderSkeleton()}>
        <Header folderId={params.folder} id={params.note} />
      </Suspense>
      <Suspense fallback={NoteSkeleton()}>
        <NoteContent folderId={params.folder} id={params.note} />
      </Suspense>
    </section>
  );
}

async function Header({ folderId, id }: { folderId: string; id: string }) {
  const note = await getNoteById(id);
  if (!note) notFound();
  return <InteractiveHeader note={note} />;
}

async function NoteContent({ folderId, id }: { folderId: string; id: string }) {
  const note = await getNoteById(id);
  if (!note) notFound();
  return <InteractiveNote note={note} />;
}

function NoteSkeleton() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-10 w-52 bg-neutral-800 rounded" />

      <div className="h-6 w-28 bg-neutral-800 rounded mt-8" />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="mt-2 flex items-center px-4 py-2.5 w-full text-neutral-300 focus:outline-none">
      <button
        disabled
        className="disabled:opacity-50 flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800"
      >
        <TbX className="w-4 h-4" />
      </button>

      <button
        disabled
        className="disabled:opacity-50 flex text-sm items-center justify-center px-4 py-2 rounded-full hover:bg-neutral-800"
      >
        <TbDeviceFloppy className="w-5 h-5 mr-2" />
        Save
      </button>

      <span className="ml-1 animate-pulse w-20 h-6 text-xs bg-neutral-800 mt-0.5 rounded" />

      <button
        disabled
        className="disabled:opacity-50 ml-auto flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800"
      >
        <TbArrowsMaximize className="w-4 h-4" />
      </button>

      <button
        disabled
        className="disabled:opacity-50 flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800"
      >
        <TbDots className="w-4 h-4" />
      </button>
    </div>
  );
}
