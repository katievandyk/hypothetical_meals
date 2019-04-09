import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import IngredientsAddModal from '../components/ingredients/IngredientsAddModal';
import IngredientsKeywordSearch from '../components/ingredients/IngredientsKeywordSearch';
import IngredientsEntry from '../components/ingredients/IngredientsEntry';
import IngredientsAlerts from '../components/ingredients/IngredientsAlerts';
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
  Container, Row, Col, Button
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
      modal: true,
      navigate: true
    });
  }

  modal_toggle = () => {
    this.setState({
      modal: !this.state.modal
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
       return(<Redirect to="/ingredients-dependency-report" push={true} />);
     }
        return(
          <Provider store={store}>
            <div>
              <div>
                <AppNavbar />
                <IngredientsAlerts />
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
                    {(this.props.auth.isAdmin || this.props.auth.user.product) ? (<IngredientsAddModal/>): (<div></div>)}
                  </Col>
                </Row>
              </Container>
              <Row>
              {this.props.ing.count === 0 ? (
                <em>Results: 0 total</em>
              ): (<em>Results: {results_start}-{results} of {this.props.ing.count} total</em>)}
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
                  <Col style={{'textAlign': 'left'}}>
                  { (this.props.auth.isAdmin || this.props.auth.user.analyst || this.props.auth.user.business || this.props.auth.user.plant || this.props.auth.user.product) &&
                    <div style={{paddingRight:'10px'}}><Button color="success" onClick={this.genReportClick}>Generate Ingredients Dependency Report</Button>{' '}</div>
                  }
                  </Col>
                  <Col style={{textAlign: 'right'}}>
                  <Button onClick={() =>  this.props.exportIngs(this.props.ing.obj)}>Export Ingredients</Button>
                  </Col>
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
