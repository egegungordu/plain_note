"use client"

import { useSession } from "next-auth/react"

export default function Greeting() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <h1 className="text-4xl font-bold text-neutral-300">Good day, <span className="text-orange-700">{session?.user?.name}</span></h1>
    )
  }

  return (
    <h1 className="text-4xl font-bold text-neutral-300">Welcome to <span className="text-orange-700">Plain Note</span></h1>
  )

}