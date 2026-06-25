import React from "react";
import * as ReactDOMRuntime from "react-dom";
import { createRoot } from "react-dom/client";
import "../env.js";
import * as FlagsReact from "country-flag-icons/react/3x2";

window.React = React;
window.ReactDOM = {
  ...ReactDOMRuntime,
  createRoot,
};
window.Flags = FlagsReact;

import("virtual:legacy-app");
