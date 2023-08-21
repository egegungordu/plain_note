"use client"

import TooltipElement from "@/components/tooltipelement"
import { Session } from "next-auth"
import { useState } from "react"
import Image from "next/image"

export default function LoggedInProfile({ user }: { user: Session["user"] }) {
  const { name, image } = user ?? { name: "", image: "" }

  const [count, setCount] = useState(0);

  return (
    <TooltipElement onClick={() => {
      setCount((prev) => prev + 1);
    }} as="button" text={name ?? ""} className="mt-auto w-72 bg-neutral-900 hover:bg-neutral-800 transition-colors border-t border-t-neutral-800 px-6 py-4 flex items-center justify-start">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full rounded-full ring-1 ring-white/30 ring-inset" />
        <Image
          width={40}
          height={40}
          src={image ?? ""}
          alt="avatar"
          className="rounded-full"
        />
      </div>
      <div className="ml-4 text-start">
        <h1 className="text-sm font-semibold text-neutral-300 overflow-ellipsis overflow-hidden whitespace-nowrap w-40">{name ?? ""}</h1>
        <h2 className="text-xs text-neutral-500">
          3.5 GB of 15 GB used
        </h2>
      </div>
    </TooltipElement>
  )
}