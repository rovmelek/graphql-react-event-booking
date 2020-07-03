import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';

import './App.css';

function App() {
  return (
    <BrowserRouter >
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={AuthPage} />
        <Route path="/event" component={EventPage} />
        <Route path="/booking" component={BookingPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
