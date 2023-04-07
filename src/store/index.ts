import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import usersReducer from "./modules/users";
import signsReducer from "./modules/signs";
import checksReducer from "./modules/checks";
import newssReducer from "./modules/news";
import type { UsersState } from "./modules/users";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch } from "react-redux";
import type { Reducer, AnyAction } from "@reduxjs/toolkit";
import type { PersistPartial } from "redux-persist/es/persistReducer";

const presistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["token"],
};

const store = configureStore({
  reducer: {
    users: persistReducer(presistConfig, usersReducer) as Reducer<
      UsersState & PersistPartial,
      AnyAction
    >,
    signs: signsReducer,
    checks: checksReducer,
    news: newssReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
