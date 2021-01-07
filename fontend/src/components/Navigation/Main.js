import React from "react";
import "./Main.css";
import { NavLink } from "react-router-dom";
import authContext from "../../context/auth-context";
export default function Main(props) {
  return (
    <authContext.Consumer>
      {(context) => {
        return (
          <header className="nav">
            <div className="nav-logo">
              <h1>esayEvne</h1>
            </div>
            <nav className="main-item">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Auth</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {context.token && (
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </header>
        );
      }}
    </authContext.Consumer>
  );
}
