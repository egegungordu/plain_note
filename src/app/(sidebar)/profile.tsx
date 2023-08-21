import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions";
import LoggedOutProfile from "./loggedoutprofile";
import LoggedInProfile from "./loggedinprofile"

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LoggedOutProfile />
  }

  return <LoggedInProfile user={session.user} />
}

export function ProfileSkeleton() {
  return (
    <div className="mt-auto w-72 bg-neutral-900 animate-pulse border-t border-t-neutral-800 px-6 py-4 flex items-center justify-start">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full rounded-full ring-1 ring-white/30 ring-inset" />
        <div className="w-10 h-10 rounded-full bg-neutral-800" />
      </div>
      <div className="ml-4 text-start">
        <div className="w-40 h-4 bg-neutral-800 rounded" />
        <div className="w-20 h-3 bg-neutral-800 rounded mt-1" />
      </div>
    </div>
  )
}