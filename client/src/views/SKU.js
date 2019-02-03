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
import { exportSKUs, exportFormulas } from '../actions/exportActions';
import { sortSKUs, groupByPL } from '../actions/skuActions';

import {
  Container, Row, Col, Button,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SKU extends Component {

  state = {
    dropdownOpen: false,
    sortby: 'name-asc',
    group_pl: false,
    origLimit: 10
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onNextPage = () => {
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page + 1, this.props.skus.pagelimit, this.props.skus.obj);
  };

  onPrevPage = () => {
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page - 1, this.props.skus.pagelimit, this.props.skus.obj);
  };
  showAll = () => {
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page, -1, this.props.skus.obj);
  }

  haveLimit = () => {
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page, 10, this.props.skus.obj);
  }

  onGBPLClick = () => {
    const boolstr = !this.state.group_pl ? 'True' : 'False';
    this.setState({
      group_pl: !this.state.group_pl
    });
    this.props.groupByPL(boolstr);
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page, this.props.skus.pagelimit, this.props.skus.obj);
  }

  sortClick = type => {
    this.setState({
      sortby: type
    });
    switch(type) {
      case "name-asc":
        this.props.sortSKUs('name', 'asc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "name-desc":
        this.props.sortSKUs('name', 'desc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "number-asc":
        this.props.sortSKUs('number', 'asc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "number-desc":
        this.props.sortSKUs('number', 'desc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "case#-asc":
        this.props.sortSKUs('case_number', 'asc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "case#-desc":
        this.props.sortSKUs('case_number', 'desc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "unit#-asc":
        this.props.sortSKUs('unit_number', 'asc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "unit#-desc":
        this.props.sortSKUs('unit_number', 'desc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "unitsize-asc":
        this.props.sortSKUs('unit_size', 'asc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "unitsize-desc":
        this.props.sortSKUs('unit_size', 'desc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "count-asc":
        this.props.sortSKUs('count_per_case', 'asc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "count-desc":
        this.props.sortSKUs('count_per_case', 'desc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "productline-asc":
        this.props.sortSKUs('product_line', 'asc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "productline-desc":
        this.props.sortSKUs('product_line', 'desc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "ingredients-asc":
        this.props.sortSKUs('ingredients_list', 'asc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      case "ingredients-desc":
        this.props.sortSKUs('ingredients_list', 'desc', this.props.skus.page, this.props.pagelimit, this.props.skus.obj);
        break;
      default:
        break;
    }

  }
   render() {
     var results = 0;
     var results_start = 0;
     var isPrevPage = false;
     var isNextPage = false;
     if(this.props.skus.pagelimit === -1){
       results = this.props.skus.count;
       results_start = 1;
     }
     else{
       results = Math.min(this.props.skus.page * this.props.skus.pagelimit, this.props.skus.count);
       results_start = (this.props.skus.page - 1)*10 + 1;
       isPrevPage = (this.props.skus.page) > 1;
       isNextPage = results < this.props.skus.count;
     }
     const groupByMsg = this.props.skus.obj && this.props.skus.obj.group_pl && this.props.skus.obj.group_pl === "True" ? 'Undo Group by Product Line': 'Group by Product Line';
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
               <Col> <Button onClick={this.onGBPLClick}> {groupByMsg}</Button> </Col>
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
                 {this.props.auth.isAdmin && <SKUAddModal/>}
               </Col>
             </Row>
           </Container>
           <Row>
             {this.props.skus.count === 0 ? (
               <em>Results: 0 total</em>
             ): (<em>Results: {results_start}-{results} of {this.props.skus.count} total</em>)}

               {this.props.skus.pagelimit === -1 ? (
                 <Button onClick={this.haveLimit} color="link" size="sm"> (Show 10 per page) </Button>
               ):
               (
                 <Button onClick={this.showAll} color="link" size="sm"> (Show all) </Button>
               )}
          </Row>
           <SKUsEntry/>
             <Row>
                 <Col style={{'textAlign':'center'}}>
                 <Button color="link" onClick={this.onPrevPage} disabled={!isPrevPage}> {' '}
                   <FontAwesomeIcon icon = "chevron-left"/>{' '}Prev
                 </Button>
                 Page: {this.props.skus.page}
                 <Button color="link" onClick={this.onNextPage} disabled={!isNextPage}>
                   Next{' '}<FontAwesomeIcon icon = "chevron-right"/>
                 </Button>
               </Col>
               </Row>
            <Row>
               <Col style={{'textAlign': 'right'}}/>
             <Button onClick={() =>  this.props.exportSKUs(this.props.skus.obj)}>Export SKUs</Button> &nbsp;
             <Button onClick={() =>  this.props.exportFormulas(this.props.skus.obj)}>Export Formulas</Button>
             </Row>
           </Container>
         </div>
       </Provider>
     );
   }
}

SKU.propTypes = {
  sortSKUs: PropTypes.func.isRequired,
  exportSKUs: PropTypes.func.isRequired,
  exportFormulas: PropTypes.func.isRequired,
  groupByPL: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus,
  auth: state.auth
});


export default connect(mapStateToProps, {sortSKUs, groupByPL, exportSKUs, exportFormulas})(SKU);
