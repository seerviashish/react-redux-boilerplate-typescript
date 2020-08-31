import {
  configureStore,
  Action,
  getDefaultMiddleware,
  ThunkAction,
} from "@reduxjs/toolkit";
import rootReducer, { RootState } from "./rootReducer";
import logger from "redux-logger";
import { buildEnvironment } from "src/@types/util-types";

const isDevOrLocalProfile =
  process.env.NODE_ENV &&
  [buildEnvironment.DEV, buildEnvironment.TEST].includes(process.env.NODE_ENV);

console.log(isDevOrLocalProfile);
const middlewares = isDevOrLocalProfile ? [logger] : [];

const store = configureStore({
  reducer: rootReducer,
  middleware: [...middlewares, ...getDefaultMiddleware()],
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
