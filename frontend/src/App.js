import React from "react";
import { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./page/Auth";
import EventPage from "./page/Event";
import BookingPage from "./page/Booking";
import MainNavigation from "./component/navigation/MainNavigation";
import AuthContext from "./context/auth-context";

import "./App.css";

class App extends Component {
  state = {
    userId: null,
    token: null,
  };

  login = (userId, token, tokenExpiration) => {
    this.setState({ userId: userId, token: token });
  };

  logout = () => {
    this.setState({ userId: null, token: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              userId: this.state.token,
              token: this.state.userId,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/event" exact />}
                {this.state.token && <Redirect from="/auth" to="/event" exact />}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                <Route path="/event" component={EventPage} />
                {this.state.token && (
                  <Route path="/booking" component={BookingPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
