import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../utils/auth.js";

// components

import FooterSmall from "../components/Footers/FooterSmall.js";

// views

import Login from "../views/auth/Login.js";
import Register from "../views/auth/Register.js";

export default function Auth() {
  return (
    <>
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"></div>
          <Switch>
          <Route path="/auth/login" render={() => (
            !isAuthenticated() ? (
              <Login />
            ) : (
              <Redirect to="/" />
            )
          )} />
          <Route path="/auth/register" render={() => (
            !isAuthenticated() ? (
              <Register />
            ) : (
              <Redirect to="/" />
            )
          )} />
            <Redirect from="/auth" to="/auth/login" />
          </Switch>
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
