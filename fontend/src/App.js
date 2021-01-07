import "./App.css";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import EventPage from "./pages/Event";
import BookingPage from "./pages/Bookings";
import Main from "./components/Navigation/Main";
import authContext from "./context/auth-context";
import React, { Component } from "react";

export default class App extends Component {
  state = {
    token: null,
    userid: null,
  };
  login = (token, userid, tokenExp) => {
    this.setState({ token: token, userid: userid });
  };
  logout = () => {
    this.setState({ token: null, userid: null });
  };
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <authContext.Provider
            value={{
              token: this.state.token,
              userid: this.state.userid,
              login: this.login,
              logout: this.logout,
            }}
          >
            <Main />
            <main className="main_content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/auth" exact />}
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage}></Route>
                )}
                <Route path="/events" component={EventPage}></Route>
                {this.state.token && (
                  <Route path="/bookings" component={BookingPage}></Route>
                )}
              </Switch>
            </main>
          </authContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}
