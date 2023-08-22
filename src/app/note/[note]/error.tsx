'use client'

export default function Error() {
  return (

    <div className="p-8 flex flex-col w-full justify-center items-center">
      <h1 className="text-3xl font-semibold text-neutral-300">
        Note not found
      </h1>
      <p className="text-neutral-400 mt-4">
        This note does not exist or you do not have permission to view it.
      </p>
    </div>
  )
}