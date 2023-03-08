import React from "react";
import "./styles/reset.css";
import "./styles/global.css";
import App from "./App";
import ReactDOM from "react-dom";
import ReactGA from "react-ga4";
import { StoreProvider } from "easy-peasy";
import Store from "./store";
import { BrowserRouter } from "react-router-dom";

ReactGA.initialize("G-2BMZ03WW8B");

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={Store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
