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
  Container, Row, Col, Button,
  Badge
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
                  <Col style={{'textAlign': 'right'}}> </Col>
                  <Col> <IngredientsKeywordSearch /> </Col>
                </Row>
                <Row>
                  <Col xs="8">SKU Filters:  {'  '}
                    <Badge href="#" color="light">None</Badge> {' '}
                    <Badge href="#" color="success">+ Add SKU Filter</Badge>
                  </Col>
                  <Col xs="4" style={{'textAlign': 'right'}}>
                    <Button color="success" size="sm" >Add Ingredient</Button>
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
