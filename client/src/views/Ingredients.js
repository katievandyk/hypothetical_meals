import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import IngredientsSKUsDropdown from '../components/IngredientsSKUsDropdown';
import IngredientsKeywordSearch from '../components/IngredientsKeywordSearch';
import IngredientsEntry from '../components/IngredientsEntry';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import {
  Table,
  Container, Row, Col, Button
} from 'reactstrap';

class Ingredient extends Component {
   render() {
        return(
          <Provider store={store}>
            <div>
              <div>
                <AppNavbar />
              </div>
              <Container>
              <Container className="mb-3">
                <Row>
                  <Col> <h1>Ingredients</h1> </Col>
                  <Col> <IngredientsSKUsDropdown /> </Col>
                  <Col> <IngredientsKeywordSearch /> </Col>
                </Row>
                <Row>
                  <Col></Col>
                  <Col></Col>
                  <Col style={{'textAlign': 'right'}}>
                    <Button color="secondary" size="sm">Add Ingredient</Button> {' '}
                    <Button color="secondary" size="sm">Delete Selected</Button>
                  </Col>
                </Row>
              </Container>
                <IngredientsEntry/>
              </Container>
            </div>
          </Provider>
      );
   }
}

export default Ingredient;
