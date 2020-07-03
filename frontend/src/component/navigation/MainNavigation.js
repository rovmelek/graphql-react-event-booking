import React from "react";
import { NavLink } from "react-router-dom";

import './MainNavigation.css';

const mainNavigation = (props) => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>EasyEvent</h1>
    </div>
    <nav className="main-navigation__item">
      <ul>
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
        <li>
          <NavLink to="/event">Event</NavLink>
        </li>
        <li>
          <NavLink to="/booking">booking</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNavigation;
