import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./page/Auth";
import EventPage from "./page/Event";
import BookingPage from "./page/Booking";
import MainNavigation from "./component/navigation/MainNavigation";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/event" component={EventPage} />
            <Route path="/booking" component={BookingPage} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
