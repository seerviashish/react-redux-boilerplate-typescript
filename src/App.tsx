import React from "react";
import "./App.css";
import Todos from "./pages/Todos";
import CompletedTodos from "./pages/CompletedTodos";
import { Provider } from "react-redux";
import store from "./redux/store";
import LocaleProvider from "./utils/i18n";
import AppThemeProvider from "./utils/theme";
import PermissionProvider from "./context/PermissionProvider";

const App: React.FC = () => {
  return (
    <PermissionProvider>
      <AppThemeProvider>
        <LocaleProvider>
          <Provider store={store}>
            <div className="App">
              <Todos />
              <CompletedTodos />
            </div>
          </Provider>
        </LocaleProvider>
      </AppThemeProvider>
    </PermissionProvider>
  );
};

export default App;
