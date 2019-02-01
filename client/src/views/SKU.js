import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import SKUAddModal from '../components/skus/SKUAddModal';
import SKUsKeywordSearch from '../components/skus/SKUsKeywordSearch';
import SKUsEntry from '../components/skus/SKUsEntry';
import IngFilters from '../components/skus/IngFilters';
import PLineFilters from '../components/skus/PLineFilters';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sortSKUs } from '../actions/skuActions';

import {
  Container, Row, Col,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SKU extends Component {

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
        this.props.sortSKUs('name', 'asc', this.props.skus.obj);
        break;
      case "name-desc":
        this.props.sortSKUs('name', 'desc', this.props.skus.obj);
        break;
      case "number-asc":
        this.props.sortSKUs('number', 'asc', this.props.skus.obj);
        break;
      case "number-desc":
        this.props.sortSKUs('number', 'desc', this.props.skus.obj);
        break;
      case "case#-asc":
        this.props.sortSKUs('case_number', 'asc', this.props.skus.obj);
        break;
      case "case#-desc":
        this.props.sortSKUs('case_number', 'desc', this.props.skus.obj);
        break;
      case "unit#-asc":
        this.props.sortSKUs('unit_number', 'asc', this.props.skus.obj);
        break;
      case "unit#-desc":
        this.props.sortSKUs('unit_number', 'desc', this.props.skus.obj);
        break;
      case "unitsize-asc":
        this.props.sortSKUs('unit_size', 'asc', this.props.skus.obj);
        break;
      case "unitsize-desc":
        this.props.sortSKUs('unit_size', 'desc', this.props.skus.obj);
        break;
      case "count-asc":
        this.props.sortSKUs('count_per_case', 'asc', this.props.skus.obj);
        break;
      case "count-desc":
        this.props.sortSKUs('count_per_case', 'desc', this.props.skus.obj);
        break;
      case "productline-asc":
        this.props.sortSKUs('product_line', 'asc', this.props.skus.obj);
        break;
      case "productline-desc":
        this.props.sortSKUs('product_line', 'desc', this.props.skus.obj);
        break;
      case "ingredients-asc":
        this.props.sortSKUs('ingredients_list', 'asc', this.props.skus.obj);
        break;
      case "ingredients-desc":
        this.props.sortSKUs('ingredients_list', 'desc', this.props.skus.obj);
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
               <Col> <h1>SKUs</h1> </Col>
               <Col style={{'textAlign': 'right'}}> </Col>
               <Col> <SKUsKeywordSearch/> </Col>
             </Row>
             <Row>
               <Col>
                 <IngFilters/>
               </Col>
               <Col>
                 <PLineFilters/>
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
                       onClick={this.sortClick.bind(this, "case#-asc")}
                       className={this.state.sortby === 'case#-asc'? "active" : ""}>
                       Case # {' '}
                       <FontAwesomeIcon icon = "sort-alpha-down"/>
                     </DropdownItem>
                     <DropdownItem
                       onClick={this.sortClick.bind(this, "case#-desc")}
                       className={this.state.sortby === 'case#-desc'? "active" : ""}>
                       Case # {' '}
                       <FontAwesomeIcon icon = "sort-alpha-up"/>
                     </DropdownItem>
                     <DropdownItem divider />
                     <DropdownItem
                       onClick={this.sortClick.bind(this, "unit#-asc")}
                       className={this.state.sortby === 'unit#-asc'? "active" : ""}>
                       Unit # {' '}
                       <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                     <DropdownItem
                       onClick={this.sortClick.bind(this, "unit#-desc")}
                       className={this.state.sortby === 'unit#-desc'? "active" : ""}>
                       Unit # {' '}
                       <FontAwesomeIcon icon = "sort-numeric-up"/></DropdownItem>
                     <DropdownItem divider />
                     <DropdownItem
                       onClick={this.sortClick.bind(this, "unitsize-asc")}
                       className={this.state.sortby === 'unitsize-asc'? "active" : ""}>
                       Unit Size {' '}
                       <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                     <DropdownItem
                       onClick={this.sortClick.bind(this, "unitsize-desc")}
                       className={this.state.sortby === 'unitsize-desc'? "active" : ""}>
                       Unit Size {' '}
                       <FontAwesomeIcon icon = "sort-numeric-up"/></DropdownItem>
                     <DropdownItem divider />
                     <DropdownItem
                       onClick={this.sortClick.bind(this, "count-asc")}
                       className={this.state.sortby === 'count-asc'? "active" : ""}>
                       Count {' '}
                       <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                     <DropdownItem
                       onClick={this.sortClick.bind(this, "count-desc")}
                       className={this.state.sortby === 'count-desc'? "active" : ""}>
                       Count {' '}
                       <FontAwesomeIcon icon = "sort-numeric-up"/></DropdownItem>
                     <DropdownItem divider />
                     <DropdownItem
                       onClick={this.sortClick.bind(this, "productline-asc")}
                       className={this.state.sortby === 'productline-asc'? "active" : ""}>
                       Product Line {' '}
                       <FontAwesomeIcon icon = "sort-numeric-down"/></DropdownItem>
                     <DropdownItem
                       onClick={this.sortClick.bind(this, "productline-desc")}
                       className={this.state.sortby === 'productline-desc'? "active" : ""}>
                       Product Line {' '}
                       <FontAwesomeIcon icon = "sort-numeric-up"/></DropdownItem>
                   </DropdownMenu>
                 </ButtonDropdown> {' '}
                 <SKUAddModal/>
               </Col>
             </Row>
           </Container>
             <SKUsEntry/>
           </Container>
         </div>
       </Provider>
     );
   }
}

SKU.propTypes = {
  sortSKUs: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus
});

export default connect(mapStateToProps, {sortSKUs})(SKU);
