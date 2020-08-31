import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "src/redux/rootReducer";
import {
  addTodoAsync,
  changeTodoState,
  deleteTodo,
  TodoState,
  Todo,
} from "./slice";
import { AppDispatch } from "src/redux/store";

const mapStateToProps = (state: RootState) => ({
  todos: state.todos,
  loading: state.todos.loading,
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      changeState: (id: number, todoState: TodoState) =>
        changeTodoState({ id, todoState }),
      delete: (id: number) => deleteTodo({ id }),
      add: (todo: Todo) => addTodoAsync(todo),
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type State = {
  todoText: string;
};

type Props = ConnectedProps<typeof connector> & {};

class Todos extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      todoText: "",
    };
  }
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return true;
  }
  handleDelete = (id: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    this.props.delete(id);
  };
  handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text: string = e.target.value;
    if (text.trim().length > 0) {
      this.setState({ todoText: e.target.value });
    }
  };
  handleTodoSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { todoText } = this.state;
    if (!(todoText.trim().length > 0)) return;
    const { todos } = this.props.todos;
    const maxId = todos.reduce((maxId: number, todo: Todo) => {
      return todo.id > maxId ? todo.id : maxId;
    }, 0);
    console.log("dadad");
    this.props.add({
      id: maxId + 1,
      title: todoText,
      state: TodoState.IN_PROGRESS,
    });
  };
  render() {
    const { loading, todos } = this.props.todos;
    const { todoText } = this.state;
    console.log("todoText==>", this.props);
    return (
      <div>
        <label>
          Todo:
          <input
            type="text"
            name="todo"
            value={todoText}
            placeholder="Enter todo."
            onChange={this.handleTextChange}
          />
        </label>
        <button onClick={this.handleTodoSubmit}>Submit</button>
        <p>{loading ? "Todo adding ..... " : ""}</p>
        {todos.map((todo: Todo) => {
          return (
            <li key={todo.id}>
              <p key="todo-title">{todo.title}</p>
              <p key="todo-state">{todo.state}</p>
              <button onClick={this.handleDelete(todo.id)}>Delete</button>
            </li>
          );
        })}
      </div>
    );
  }
}

export default connector(Todos);
