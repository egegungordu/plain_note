import { configureStore } from "@reduxjs/toolkit";

import notesReducer from "./notesSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      //TODO: make sure store is serializable
      serializableCheck: false,
    }),
  reducer: {
    notes: notesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
