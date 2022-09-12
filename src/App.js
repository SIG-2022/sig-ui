import React from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import {baseTheme} from './assets/global/Theme-variable'
import Themeroutes from "./routes/Router";
const App = () => {

  const routing = useRoutes(Themeroutes);
  return (
    <ThemeProvider theme={baseTheme}>
      {routing}
    </ThemeProvider>
  );
};

export default App;
