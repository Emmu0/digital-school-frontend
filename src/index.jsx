import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./components/Auth/AuthProvider";


const accessToken = sessionStorage.getItem("token");

ReactDOM.render(
  <AuthProvider accessToken={accessToken}>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);

reportWebVitals();