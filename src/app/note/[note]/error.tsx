'use client'
import Image from "next/image"
import missingSvg from "../../../../public/undraw_missed_chances.svg"

export default function Error() {
  return (

    <div className="p-8 flex flex-col w-full justify-center items-center">
      <Image
        src={missingSvg}
        alt="Missing note"
        width={300}
        height={300}
        className=""
      />

      <h1 className="text-3xl font-semibold text-neutral-300 mt-8">
        Note not found
      </h1>

      <p className="text-neutral-400 mt-6">
        This note does not exist or you do not have permission to view it.
      </p>
    </div>
  )
}