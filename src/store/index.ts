import { configureStore } from "@reduxjs/toolkit";

import notesReducer from "./notesSlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      //TODO: make sure store is serializable
      serializableCheck: false,
    }),
  reducer: {
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
