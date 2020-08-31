import { combineReducers } from "@reduxjs/toolkit";

import todosReducer from "src/pages/Todos/slice";

const rootReducer = combineReducers({
  todos: todosReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
