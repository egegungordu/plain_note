import { router } from "./trpc";
import { noteRouter } from "./routers/note";

export const appRouter = router({
  note: noteRouter,
});

export type AppRouter = typeof appRouter;
