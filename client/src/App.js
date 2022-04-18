import React from "react";

// React Router Dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Pages
import { Home } from "./pages";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route component={Home} path="/" />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
