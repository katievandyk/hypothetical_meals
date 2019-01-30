import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import IngredientsAddModal from '../components/ingredients/IngredientsAddModal';
import IngredientsKeywordSearch from '../components/ingredients/IngredientsKeywordSearch';
import IngredientsEntry from '../components/ingredients/IngredientsEntry';
import SKUFilters from '../components/ingredients/SKUFilters'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sortIngs } from '../actions/ingActions';

import {
  Container, Row, Col,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Ingredients extends Component {
  state = {
    dropdownOpen: false,
    sortby: 'name-asc'
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sortClick = type => {
    this.setState({
      sortby: type
    });
    switch(type) {
      case "name-asc":
        this.props.sortIngs('name', 'asc', this.props.ing.obj);
        break;
      case "name-desc":
        this.props.sortIngs('name', 'desc', this.props.ing.obj);
        break;
      case "number-asc":
        this.props.sortIngs('number', 'asc', this.props.ing.obj);
        break;
      case "number-desc":
        this.props.sortIngs('number', 'desc', this.props.ing.obj);
        break;
      case "vendor-asc":
        this.props.sortIngs('vendor_info', 'asc', this.props.ing.obj);
        break;
      case "vendor-desc":
        this.props.sortIngs('vendor_info', 'desc', this.props.ing.obj);
        break;
      case "package-asc":
        this.props.sortIngs('package_size', 'asc', this.props.ing.obj);
        break;
      case "package-desc":
        this.props.sortIngs('package_size', 'desc', this.props.ing.obj);
        break;
      case "cost-asc":
        this.props.sortIngs('cost_per_package', 'asc', this.props.ing.obj);
        break;
      case "cost-desc":
        this.props.sortIngs('cost_per_package', 'desc', this.props.ing.obj);
        break;
      default:
        break;
    }

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
                  <Col> <IngredientsKeywordSearch/> </Col>
                </Row>
                <Row>
                  <Col>
                    <SKUFilters/>
                  </Col>
                  <Col style={{'textAlign': 'right'}}>
                    <ButtonDropdown style={{'display': 'inline-block'}} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                      <DropdownToggle caret>
                        Sort by: {this.state.sortby}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>FIELDS</DropdownItem>
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "name-asc")}
                          className={this.state.sortby === 'name-asc'? "active" : ""}>
                          Name {' '}
                          <FontAwesomeIcon icon = "sort-alpha-down"/>
                        </DropdownItem>
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "name-desc")}
                          className={this.state.sortby === 'name-desc'? "active" : ""}>
                          Name {' '}
                          <FontAwesomeIcon icon = "sort-alpha-up"/>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "number-asc")}
                          className={this.state.sortby === 'number-asc'? "active" : ""}>
                          Number {' '}
                          <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "number-desc")}
                          className={this.state.sortby === 'number-desc'? "active" : ""}>
                          Number {' '}
                          <FontAwesomeIcon icon = "sort-numeric-up"/></DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "vendor-asc")}
                          className={this.state.sortby === 'vendor-asc'? "active" : ""}>
                          Vendor's Info {' '}
                          <FontAwesomeIcon icon = "sort-alpha-down"/>
                        </DropdownItem>
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "vendor-desc")}
                          className={this.state.sortby === 'vendor-desc'? "active" : ""}>
                          Vendor's Info {' '}
                          <FontAwesomeIcon icon = "sort-alpha-up"/>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "package-asc")}
                          className={this.state.sortby === 'package-asc'? "active" : ""}>
                          Package Size {' '}
                          <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "package-desc")}
                          className={this.state.sortby === 'package-desc'? "active" : ""}>
                          Package Size {' '}
                          <FontAwesomeIcon icon = "sort-numeric-up"/></DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "cost-asc")}
                          className={this.state.sortby === 'cost-asc'? "active" : ""}>
                          Cost per Package {' '}
                          <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                        <DropdownItem
                          onClick={this.sortClick.bind(this, "cost-desc")}
                          className={this.state.sortby === 'cost-desc'? "active" : ""}>
                          Cost per Package {' '}
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
Ingredients.propTypes = {
  sortIngs: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ing: state.ing
});

export default connect(mapStateToProps, {sortIngs})(Ingredients);
