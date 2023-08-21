import { TbBook, TbHeart, TbPlus } from "react-icons/tb"
import { Suspense } from "react"
import Profile, { ProfileSkeleton } from "./profile"
import NewNoteButton from "./newnotebutton"

async function getData() {
  // await new Promise((resolve) => setTimeout(resolve, 4000))
  return [
    {
      id: 1,
      name: "Personal",
      color: "bg-red-500",
    },
    {
      id: 2,
      name: "School",
      color: "bg-sky-600",
    },
    {
      id: 3,
      name: "Work",
      color: "bg-orange-600"
    }
  ]
}

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
  )
}

async function Folder() {
  const data = await getData()

  return (
    <ul className="flex flex-col items-stretch">
      {data.map((folder) => (
        <button
          key={folder.id}
          className="flex items-center justify-start hover:bg-neutral-800 transition-colors px-10 py-2"
        >
          <div className={`w-2 h-2 rounded-full ${folder.color}`} />
          <h1 className="ml-2 text-sm text-neutral-300">{folder.name}</h1>
        </button>
      ))}
      <div className="bg-neutral-800 h-[1px] mx-8 my-2" />
      <button
        className="flex items-center justify-start hover:bg-neutral-800 transition-colors px-9 py-2"
      >
        <TbPlus className="w-3.5 h-3.5 text-neutral-400" />
        <h1 className="ml-1 text-xs text-neutral-400">Add Folder</h1>
      </button>
    </ul>
  )
}

export default function Sidebar() {
  return (
    <aside id="sidebar" className="relative flex flex-col border-r bg-neutral-900 border-r-neutral-800 isolate">

      {/* <div className="absolute -z-10 w-full h-1 top-0 bg-orange-700" /> */}
      {/* <div className="absolute -z-10 h-full w-0.5 left-6 bg-orange-800/80" /> */}

      <NewNoteButton />

      <div className="flex flex-col py-4">
        <h1 className="text-sm font-semibold text-neutral-400 my-4 ml-10">Quick Links</h1>

        <button className="flex items-center justify-start bg-neutral-300 transition-colors px-10 py-2">
          <TbBook className="w-5 h-5 text-neutral-800" />
          <h1 className="ml-2 text-sm text-neutral-800">All Notes</h1>
        </button>

        {/* <button className="flex items-center justify-start hover:bg-neutral-800 transition-colors px-8 py-2">
          <TbBook className="w-5 h-5 text-neutral-300" />
          <h1 className="ml-2 text-sm text-neutral-300">All Notes</h1>
        </button> */}

        <button className="flex items-center justify-start hover:bg-neutral-800 transition-colors px-10 py-2">
          <TbHeart className="w-5 h-5 text-neutral-300" />
          <h1 className="ml-2 text-sm text-neutral-300">Favorites</h1>
        </button>

        <h1 className="text-sm font-semibold text-neutral-400 my-4 ml-10">Folders</h1>

        <Suspense fallback={FolderSkeleton()}>
          <Folder />
        </Suspense>
      </div>

      <Suspense fallback={ProfileSkeleton()} >
        <Profile />
      </Suspense>
    </aside>
  )
}