import React from "react";
import ReactDOM from "react-dom";
import { StateProvider } from "./StateProvider";
import reducer, { initialState } from "./reducer";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";
import "./i18n";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
