import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type TodosState = {
  todos: Todo[];
  loading: boolean;
};

export type Todo = {
  id: number;
  title: string;
  state: TodoState;
};

export enum TodoState {
  COMPLETED = "COMPLETED",
  DELETED = "DELETED",
  IN_PROGRESS = "IN_PROGRESS",
}

const initialState: TodosState = {
  todos: [
    {
      id: 1,
      title: "Ok Bye",
      state: TodoState.COMPLETED,
    },
    {
      id: 2,
      title: "Ok Bye 2",
      state: TodoState.COMPLETED,
    },
    {
      id: 3,
      title: "Ok Bye 23  asd",
      state: TodoState.IN_PROGRESS,
    },
  ],
  loading: false,
};
const sleep = (m: number) => new Promise((r) => setTimeout(r, m));

export const addTodoAsync = createAsyncThunk(
  "todoSlice/addTodoAsync",
  async (todo: Todo) => {
    await sleep(3000);
    return todo;
  }
);

const todosSlice = createSlice({
  name: "@todoSlice",
  initialState,
  reducers: {
    loadingStart(state) {
      state.loading = true;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.todos.push(action.payload);
      state.loading = false;
    },
    deleteTodo(state, actions: PayloadAction<{ id: number }>) {
      const { id } = actions.payload;
      state.todos.splice(
        state.todos.findIndex((todo) => todo.id === id),
        1
      );
    },
    changeTodoState(
      state,
      actions: PayloadAction<{ id: number; todoState: TodoState }>
    ) {
      const { id, todoState } = actions.payload;
      const index: number = state.todos.findIndex((todo: Todo) => {
        return todo.id === id;
      });
      if (index >= 0) {
        state.todos[index].state = todoState;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.todos.push(action.payload);
        state.loading = false;
      })
      .addCase(addTodoAsync.pending, (state, action) => {
        state.loading = true;
      });
  },
});

export const {
  loadingStart,
  addTodo,
  changeTodoState,
  deleteTodo,
} = todosSlice.actions;

export default todosSlice.reducer;
