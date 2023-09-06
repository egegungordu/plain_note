import Greeting from "./greeting";
import { getServerSession } from "next-auth";

function Introductory({ loggedIn }: { loggedIn: boolean }) {
  if (loggedIn) {
    return (
      <>
        <p className="block mt-4">
          You can start by clicking the{" "}
          <span className="text-neutral-300 font-bold">New note</span> button at
          the top of the sidebar.
        </p>

        <p className="block mt-4">
          Create new folders, favorite your notes, and write in full-screen
          mode.
        </p>
      </>
    );
  }

  return (
    <>
      <p className="block mt-4">
        To get started, sign in with your Google account by clicking the{" "}
        <span className="text-neutral-300 font-bold">Sign in</span> button at
        the bottom of the sidebar.
      </p>
    </>
  );
}

export default async function Home() {
  const session = await getServerSession();
  const loggedIn = !!session?.user;
  const userName = session?.user?.name ?? "";

  return (
    <main className="relative pt-10 px-8 min-h-screen items-stretch justify-between text-neutral-300">
      <Greeting loggedIn={loggedIn} userName={userName} />

      <Introductory loggedIn={loggedIn} />
    </main>
  );
}
