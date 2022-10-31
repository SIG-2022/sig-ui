import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HashRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Spinner from "./views/Spinner/Spinner";
ReactDOM.render(
  
    <Suspense fallback={<Spinner />}>
      <HashRouter>
        <App />
      </HashRouter>
    </Suspense>,
  document.getElementById("root") 
);
