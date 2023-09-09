"use client";

import TooltipElement from "@/components/tooltipelement";
import { Session } from "next-auth";
import { useState } from "react";
import Image from "next/image";
import Popover from "@/components/popover";
import { signOut } from "next-auth/react";

export default function LoggedInProfile({ user }: { user: Session["user"] }) {
  const { name, image } = user ?? { name: "", image: "" };
  const [showPopover, setShowPopover] = useState(false);

  const handleClosePopover = () => {
    setShowPopover(false);
  };

  const handleOpenPopover = () => {
    setShowPopover(true);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="relative">
      <Popover side="t" show={showPopover} onClose={handleClosePopover}>
        <div className="flex flex-col items-start justify-center pt-6 pb-3 w-60">
          <h1 className="text-lg font-semibold text-neutral-300 px-6">
            {name ?? ""}
          </h1>

          <h2 className="text-sm text-neutral-500 break-all overflow-hidden text-ellipsis px-6">
            {user?.email ?? ""}
          </h2>

          <button
            onClick={handleSignOut}
            className="mt-4 text-sm text-neutral-300 w-full text-left hover:bg-neutral-800 py-2 px-6"
          >
            Sign out
          </button>
        </div>
      </Popover>

      <TooltipElement
        as="button"
        hide={showPopover}
        onClick={handleOpenPopover}
        text={name ?? ""}
        className="relative w-full mt-auto bg-neutral-900 hover:bg-neutral-800 transition-colors border-t border-t-neutral-800 px-6 py-4 flex items-center justify-start"
      >
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
          <h1 className="text-sm font-semibold text-neutral-300 overflow-ellipsis overflow-hidden whitespace-nowrap w-40">
            {name ?? ""}
          </h1>

          <h2 className="text-xs text-neutral-500">3.5 GB of 15 GB used</h2>
        </div>
      </TooltipElement>
    </div>
  );
}
