import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import IngredientsAddModal from '../components/ingredients/IngredientsAddModal';
import IngredientsKeywordSearch from '../components/ingredients/IngredientsKeywordSearch';
import IngredientsEntry from '../components/ingredients/IngredientsEntry';
import SKUFilters from '../components/ingredients/SKUFilters'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import { exportIngs } from '../actions/exportActions';

import { Provider } from 'react-redux';
import store from '../store';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router';
import { sortIngs, genIngDepReport } from '../actions/ingActions';

import {
  Container, Row, Col, Button,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Modal, ModalBody, ModalHeader, ModalFooter
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Ingredients extends Component {
  state = {
    dropdownOpen: false,
    sortby: 'name-asc',
    modal: false,
    navigate: false,
    origLimit: 10
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  onNextPage = () => {
    this.props.sortIngs(this.props.ing.sortby, this.props.ing.sortdir,
       this.props.ing.page + 1, this.props.ing.pagelimit, this.props.ing.obj);
  };

  onPrevPage = () => {
    this.props.sortIngs(this.props.ing.sortby, this.props.ing.sortdir,
       this.props.ing.page - 1, this.props.ing.pagelimit, this.props.ing.obj);
  };

  genReportClick = () => {
    this.props.genIngDepReport(this.props.ing.obj);
    this.setState({
      modal: true
    });
  }

  modal_toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  redirectReports = () => {
    this.setState({
      navigate: true
    })
  }

  showAll = () => {
    this.props.sortIngs(this.props.ing.sortby, this.props.ing.sortdir,
       this.props.ing.page, -1, this.props.ing.obj);
  }

  haveLimit = () => {
    this.props.sortIngs(this.props.ing.sortby, this.props.ing.sortdir,
       this.props.ing.page, 10, this.props.ing.obj);
  }

  sortClick = type => {
    this.setState({
      sortby: type
    });
    switch(type) {
      case "name-asc":
        this.props.sortIngs('name', 'asc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
        break;
      case "name-desc":
        this.props.sortIngs('name', 'desc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
        break;
      case "number-asc":
        this.props.sortIngs('number', 'asc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
        break;
      case "number-desc":
        this.props.sortIngs('number', 'desc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
        break;
      case "vendor-asc":
        this.props.sortIngs('vendor_info', 'asc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
        break;
      case "vendor-desc":
        this.props.sortIngs('vendor_info', 'desc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
        break;
      case "package-asc":
        this.props.sortIngs('package_size', 'asc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
        break;
      case "package-desc":
        this.props.sortIngs('package_size', 'desc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
        break;
      case "cost-asc":
        this.props.sortIngs('cost_per_package', 'asc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
        break;
      case "cost-desc":
        this.props.sortIngs('cost_per_package', 'desc', this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
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
     if(this.props.ing.pagelimit === -1){
       results = this.props.ing.count;
       results_start = 1;
     }
     else{
       results = Math.min(this.props.ing.page * this.props.ing.pagelimit, this.props.ing.count);
       results_start = (this.props.ing.page - 1)*10 + 1;
       isPrevPage = (this.props.ing.page) > 1;
       isNextPage = results < this.props.ing.count;
     }


     if(this.state.navigate){
       return(<Redirect to="/reports" push={true} />);
     }
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
                    {this.props.auth.isAdmin ? (<IngredientsAddModal/>): (<div></div>)}
                  </Col>
                </Row>
              </Container>
              <Row><em>Results: {results_start}-{results} of {this.props.ing.count} total</em>
              {this.props.ing.pagelimit === -1 ? (
                <Button onClick={this.haveLimit} color="link" size="sm"> (Show 10 per page) </Button>
              ):
              (
                <Button onClick={this.showAll} color="link" size="sm"> (Show all) </Button>
              )}

              </Row>
                <IngredientsEntry/>
                <Row >
                  <Col style={{'textAlign':'center'}}>
                  <Button color="link" onClick={this.onPrevPage} disabled={!isPrevPage}> {' '}
                    <FontAwesomeIcon icon = "chevron-left"/>{' '}Prev
                  </Button>
                  Page: {this.props.ing.page}
                  <Button color="link" onClick={this.onNextPage} disabled={!isNextPage}>
                    Next{' '}<FontAwesomeIcon icon = "chevron-right"/>
                  </Button>
                </Col>
                </Row>
                <Row>
                  <Col style={{'textAlign': 'right'}}/>
                    <div style={{paddingRight:'10px'}}><Button color="success" onClick={this.genReportClick}>Generate Ingredients Dependency Report</Button>{' '}</div>
                    <Modal isOpen={this.state.modal} toggle={this.modal_toggle}>
                      <ModalHeader toggle={this.modal_toggle}> Report Generated </ModalHeader>
                      <ModalBody style={{textAlign:'center'}}>
                        Ingredients Dependency Report Generated! <br></br>You can view or export it on the reports page
                      </ModalBody>
                      <ModalFooter><Button onClick={this.redirectReports}>View Ingredients Dependency Report</Button></ModalFooter>
                    </Modal>{' '}
                  <Button onClick={() =>  this.props.exportIngs(this.props.ing.obj)}>Export Ingredients</Button>
                  </Row>
              </Container>
            </div>
          </Provider>
      );
   }
}
Ingredients.propTypes = {
  genIngDepReport: PropTypes.func.isRequired,
  sortIngs: PropTypes.func.isRequired,
  exportIngs: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ing: state.ing,
  auth: state.auth
});

export default connect(mapStateToProps, {sortIngs, exportIngs, genIngDepReport})(Ingredients);
