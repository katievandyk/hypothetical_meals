import React, { Component } from 'react';
import Manufacturing from './views/Manufacturing';
import Login from './views/Login';
import Register from './views/Register';
import Ingredients from './views/Ingredients';
import ProductLines from './views/ProductLines';
import Reports from './views/Reports';
import Import from './views/Import';
import SKU from './views/SKU';
import { BrowserRouter, Route, Redirect, Switch} from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faEdit, faTrash, faList, faSortAlphaUp,
  faSortAlphaDown, faSortNumericUp, faSortNumericDown,
  faTimes, faChevronLeft, faChevronRight, faInfoCircle}
from '@fortawesome/free-solid-svg-icons';

import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import PrivateRoute from "./components/private-route/PrivateRoute";
import AdminRoute from "./components/private-route/AdminRoute";

import Dashboard from "./components/dashboard/Dashboard";

library.add(faSearch, faEdit, faTrash, faList, faSortAlphaUp,
   faSortAlphaDown, faSortNumericUp, faSortNumericDown,
   faTimes, faChevronLeft, faChevronRight, faInfoCircle
  );

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
       return (
            <Provider store = {store}>
              <BrowserRouter>
                  <div>
                    <Switch>
                      <Route exact={true} path="/login" component={Login} />
                      <Route exact={true} path="/" component={Login} />
                      <AdminRoute exact={true} path="/register" component={Register} />
                      <PrivateRoute path="/ingredients" component={Ingredients} />
                      <PrivateRoute path="/manufacturing" component={Manufacturing} />
                      <PrivateRoute path="/productlines" component={ProductLines} />
                      <PrivateRoute path="/sku" component={SKU} />
                      <PrivateRoute path="/productlines" component={ProductLines} />
                      <AdminRoute path="/import" component={Import} />
                      <PrivateRoute path="/reports" component={Reports} />
                      <Route path="api/*" component={Login} />
                    </Switch>

                  </div>

              </BrowserRouter>
            </Provider>
          );
  }
}

export default App;
