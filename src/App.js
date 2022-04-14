import React from "react";
import Layouts from "./Layouts";
import "./App.scss";
import { ThemeProvider } from "@material-ui/core/styles";
import { Provider } from 'react-redux'
import { useStore } from './redux/store'
import theme from "./Components/Theme/theme";
import { StylesProvider } from "@material-ui/core/Styles";
import Routes from "./Components/Routes/Routes";

export default function App() {
  const store = useStore();
  return (
    <>
      <StylesProvider injectFirst>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layouts>
            <Routes />
          </Layouts>
        </ThemeProvider>
        </Provider>
      </StylesProvider>
    </>
  );
}


