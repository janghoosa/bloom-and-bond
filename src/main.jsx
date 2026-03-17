import React from "react";
import ReactDOM from "react-dom/client";
import { Toast } from "@heroui/react";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <Toast.Provider placement="bottom" />
      <App />
    </>
  </React.StrictMode>,
);
