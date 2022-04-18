import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Web3Provider } from "./components/providers";
import { Layout } from "components/ui";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <Web3Provider>
    <Layout>
      <App />
    </Layout>
  </Web3Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
