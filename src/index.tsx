import React from "react";
import "regenerator-runtime/runtime.js"; // Required for async/await to work with ES5 browserlist target
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { envConfig } from "./shared/utils";
import gtmAnalytics from "./shared/utils/analytics";
// import "./appInsights"

gtmAnalytics.init(envConfig.REACT_GA_TRACKING_ID);

ReactDOM.render(
  <App isStandaloneApp baseRouteName="" />,
  document.getElementById("root")
);

module?.hot?.accept();

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker.register("/service-worker.js");
//   });
// }

reportWebVitals(console.log);
