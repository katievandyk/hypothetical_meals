import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import IngredientsAddModal from '../components/ingredients/IngredientsAddModal';
import IngredientsKeywordSearch from '../components/ingredients/IngredientsKeywordSearch';
import IngredientsEntry from '../components/ingredients/IngredientsEntry';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import {
  Container, Row, Col,
  Badge, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Ingredient extends Component {
  state = {
    dropdownOpen: false,
    sortby: ''
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

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
                  <Col>SKU Filters:  {'  '}
                    <Badge href="#" color="light">None</Badge> {' '}
                    <Badge href="#" color="success">+ Add SKU Filter</Badge>
                  </Col>
                  <Col style={{'textAlign': 'right'}}>
                    <ButtonDropdown style={{'display': 'inline-block'}} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                      <DropdownToggle caret>
                        Sort by: {this.state.sortby}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>FIELDS</DropdownItem>
                        <DropdownItem>
                          Name {' '}
                          <FontAwesomeIcon icon = "sort-alpha-down"/>
                        </DropdownItem>
                        <DropdownItem>
                          Name {' '}
                          <FontAwesomeIcon icon = "sort-alpha-up"/>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Number {' '}
                          <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                        <DropdownItem>Number {' '}
                          <FontAwesomeIcon icon = "sort-numeric-up"/></DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Vendor's Info {' '}
                          <FontAwesomeIcon icon = "sort-alpha-down"/>
                        </DropdownItem>
                        <DropdownItem>Vendor's Info {' '}
                          <FontAwesomeIcon icon = "sort-alpha-up"/>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Package Size {' '}
                          <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                        <DropdownItem>Package Size {' '}
                          <FontAwesomeIcon icon = "sort-numeric-up"/></DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Cost per Package {' '}
                          <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                        <DropdownItem>Cost per Package {' '}
                          <FontAwesomeIcon icon = "sort-numeric-up"/></DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown> {' '}
                    <IngredientsAddModal/>
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
