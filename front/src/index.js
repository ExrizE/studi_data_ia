import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import PrivateRoute from './views/PrivateRoute';

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/styles/tailwind.css";

// layouts

import Admin from "./layouts/Admin.js";
import Auth from "./layouts/Auth.js";

// views without layouts
import Index from "./views/Index.js";

ReactDOM.render(  
  <Provider store={store}>
  <BrowserRouter>
    <Switch>
      <PrivateRoute path="/admin" component={Admin} />
      <Route path="/auth" component={Auth} />
      <PrivateRoute path='/' component={Index} />
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
