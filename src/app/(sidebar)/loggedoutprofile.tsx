"use client";

import { signIn } from "next-auth/react";

export default function LoggedOutProfile() {
  const handleSignIn = () => {
    signIn("google");
  };

  return (
    <button
      onClick={handleSignIn}
      className="mt-auto bg-neutral-900 hover:bg-neutral-800 transition-colors border-t border-t-neutral-800 px-6 py-4 flex flex-col items-center justify-center"
    >
      <span className="text-sm font-semibold text-neutral-300">Sign in</span>

      <span className="text-xs text-neutral-500 mt-1">
        to save your notes & categorize them
      </span>
    </button>
  );
}
