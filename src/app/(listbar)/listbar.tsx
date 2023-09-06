import ListbarItems, { ListbarItemsSkeleton } from "./listbaritems";
import { Suspense } from "react";
import Searchbar, { SearchbarResultInfo } from "./searchbar";
import CurrentFolderIndicator from "./currentfolderindicator";

export default function Listbar() {
  return (
    <section
      id="listbar"
      className="flex flex-col w-96 flex-shrink-0 border-r bg-neutral-900/70 border-r-neutral-800 py-4"
    >
      <Searchbar />

      <CurrentFolderIndicator />

      <SearchbarResultInfo />

      <Suspense fallback={<ListbarItemsSkeleton />}>
        <ListbarItems />
      </Suspense>
    </section>
  );
}
