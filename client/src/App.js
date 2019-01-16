import React, { Component } from 'react';
import ManufacturingGoals from './views/ManufacturingGoals';
import Login from './views/Login';
import Home from './views/Home';
import Ingredient from './views/Ingredient';
import { BrowserRouter, Route} from "react-router-dom";

class App extends Component {
  render() {
       return (
            <BrowserRouter>
                <div>
                    <Route exact={true} path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/ingredient" component={Ingredient} />
                    <Route path="/goals" component={ManufacturingGoals} />
                </div>
            </BrowserRouter> );
  }
}

export default App;
