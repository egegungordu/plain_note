"use client";
import Image from "next/image";
import missingSvg from "../../../../public/undraw_missed_chances.svg";
import { TbX } from "react-icons/tb";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="relative p-8 flex flex-col w-full justify-center items-center">
      <button
        onClick={handleClose}
        className="absolute text-neutral-300 left-4 top-5 flex text-sm items-center justify-center p-2.5 rounded-full hover:bg-neutral-800"
      >
        <TbX className="w-4 h-4" />
      </button>
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
  );
}
