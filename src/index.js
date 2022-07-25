import "./style.css";
import App from "./components/App";

import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
