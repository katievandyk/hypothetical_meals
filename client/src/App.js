import React, { Component } from 'react';
import Manufacturing from './views/Manufacturing';
import Login from './views/Login';
import Register from './views/Register';
import Ingredients from './views/Ingredients';
import ProductLines from './views/ProductLines';
import Reports from './views/Reports';
import Import from './views/Import';
import SKU from './views/SKU';
import { BrowserRouter, Route, Redirect} from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch);

class App extends Component {
  render() {
       return (
            <BrowserRouter>
                <div>
                  <Route exact={true} path="/login" component={Login} />
                  <Route exact={true} path="/register" component={Register} />
                  <Route path="/ingredients" component={Ingredients} />
                  <Route path="/manufacturing" component={Manufacturing} />
                  <Route path="/productlines" component={ProductLines} />
                  <Route path="/sku" component={SKU} />
                  <Route path="/productlines" component={ProductLines} />
                  <Route path="/import" component={Import} />
                  <Route path="/reports" component={Reports} />
                  <Redirect from="/" to="login"/>
                </div>

            </BrowserRouter>
          );
  }
}

export default App;
