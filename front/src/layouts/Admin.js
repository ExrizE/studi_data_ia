import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Index from "../views/admin/Index.js";

export default function Admin() {
  return (
    <>
      <Switch>
        <Route path="/admin/dashboard" exact component={Index} />
        <Redirect from="/admin" to="/admin/dashboard" />
      </Switch>
    </>
  );
}
