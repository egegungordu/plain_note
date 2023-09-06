import { Suspense } from "react";
import Profile, { ProfileSkeleton } from "./profile";
import NewNoteButton from "./newnotebutton";
import QuickLinks from "./quicklinks";
import { getFolders } from "../actions";
import NewFolderButton from "./newfolderbutton";
import FoldersClient from "./foldersclient";
import { store } from "@/store";
import { setStoreFolders } from "@/store/notesSlice";
import { ReduxFoldersPreloader } from "@/components/reduxpreloader";

function FolderSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-start hover:bg-neutral-800 transition-colors px-8 py-2"
        >
          <div className="w-2 h-2 rounded-full bg-neutral-700 animate-pulse" />
          <div className="ml-2 w-16 h-3 rounded-md bg-neutral-700 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

async function Folders() {
  const folders = await getFolders();
  store.dispatch(setStoreFolders(folders));

  return (
    <ul className="flex flex-col items-stretch overflow-y-auto overflow-x-hidden">
      <ReduxFoldersPreloader folders={folders} />

      <FoldersClient />

      <div className="bg-neutral-800 h-[1px] mx-8 my-2" />

      <NewFolderButton />
    </ul>
  );
}

export default function Sidebar() {
  return (
    <aside
      id="sidebar"
      className="flex flex-col w-72 h-full border-r bg-neutral-900 border-r-neutral-800 isolate flex-shrink-0"
    >
      <NewNoteButton />

      <div className="flex flex-col py-4 h-full overflow-y-auto">
        <h1 className="text-sm font-semibold text-neutral-400 my-4 ml-10">
          Quick Links
        </h1>

        <QuickLinks />

        <h1 className="text-sm font-semibold text-neutral-400 my-4 ml-10">
          Folders
        </h1>

        <Suspense fallback={FolderSkeleton()}>
          <Folders />
        </Suspense>
      </div>

      <Suspense fallback={ProfileSkeleton()}>
        <Profile />
      </Suspense>
    </aside>
  );
}
