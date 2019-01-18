import React, { Component } from 'react';
import ManufacturingGoals from './views/ManufacturingGoals';
import Login from './views/Login';
import Home from './views/Home';
import Ingredients from './views/Ingredients';
import { BrowserRouter, Route} from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch);

class App extends Component {
  render() {
       return (
            <BrowserRouter>
                <div>
                  <Route exact={true} path="/" component={Home} />
                  <Route path="/login" component={Login} />
                  <Route path="/ingredients" component={Ingredients} />
                  <Route path="/goals" component={ManufacturingGoals} />
                </div>
            </BrowserRouter>
          );
  }
}

export default App;
