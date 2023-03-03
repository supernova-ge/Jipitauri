import React from "react";
import "./styles/reset.css";
import "./styles/global.css";
import App from "./App";
import ReactDOM from "react-dom";
import ReactGA from "react-ga4";

ReactGA.initialize("G-2BMZ03WW8B");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
