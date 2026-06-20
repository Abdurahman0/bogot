import React from "react";
import * as ReactDOMRuntime from "react-dom";
import { createRoot } from "react-dom/client";
import "../env.js";

window.React = React;
window.ReactDOM = {
  ...ReactDOMRuntime,
  createRoot,
};

import("virtual:legacy-app");
