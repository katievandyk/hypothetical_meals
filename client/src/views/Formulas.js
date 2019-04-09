import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import FormulasAddModal from '../components/formulas/FormulasAddModal';
import FormulasEntry from '../components/formulas/FormulasEntry';
import FormulaAlerts from '../components/formulas/FormulaAlerts';
import FormulasKeywordSearch from '../components/formulas/FormulasKeywordSearch';
import IngFilters from '../components/formulas/IngFilters'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Provider } from 'react-redux';
import store from '../store';
import { sortFormulas } from '../actions/formulaActions';
import { exportFormulas} from '../actions/exportActions';

import {
  Container, Row, Col, Button
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Formulas extends Component {
  state={
    origLimit: 10
  }

  onNextPage = () => {
    this.props.sortFormulas(this.props.formulas.sortby,
      this.props.formulas.sortdir, this.props.formulas.page + 1,
      this.props.formulas.pagelimit, this.props.formulas.obj);
  };

  onPrevPage = () => {
    this.props.sortFormulas(this.props.formulas.sortby,
      this.props.formulas.sortdir, this.props.formulas.page - 1,
      this.props.formulas.pagelimit, this.props.formulas.obj);
  };

  showAll = () => {
    this.props.sortFormulas(this.props.formulas.sortby,
      this.props.formulas.sortdir, this.props.formulas.page,
      -1, this.props.formulas.obj);
  }

  haveLimit = () => {
    this.props.sortFormulas(this.props.formulas.sortby,
      this.props.formulas.sortdir, this.props.formulas.page,
      10, this.props.formulas.obj);
  }
   render() {
     var results = 0;
     var results_start = 0;
     var isPrevPage = false;
     var isNextPage = false;
     if(this.props.formulas.pagelimit === -1){
       results = this.props.formulas.count;
       results_start = 1;
     }
     else{
       results = Math.min(this.props.formulas.page * this.props.formulas.pagelimit, this.props.formulas.count);
       results_start = (this.props.formulas.page - 1)*10 + 1;
       isPrevPage = (this.props.formulas.page) > 1;
       isNextPage = results < this.props.formulas.count;
     }
     return(
       <Provider store={store}>
         <div>
           <div>
             <AppNavbar />
             <FormulaAlerts />
           </div>
           <Container>
           <Container className="mb-3">
             <Row>
               <Col> <h1>Formulas</h1> </Col>
               <Col> </Col>
               <Col> <FormulasKeywordSearch/> </Col>
             </Row>
             <Row>
               <Col>
                 <IngFilters/>
               </Col>
               <Col></Col>
               <Col style={{'textAlign': 'right'}}>
                 {(this.props.auth.isAdmin || this.props.auth.user.product) && <FormulasAddModal/>}
               </Col>
             </Row>
           </Container>
           <Row>
             {this.props.formulas.count === 0 ? (
               <em>Results: 0 total</em>
             ): (<em>Results: {results_start}-{results} of {this.props.formulas.count} total</em>)}
              {this.props.formulas.pagelimit === -1 ? (
                <Button onClick={this.haveLimit} color="link" size="sm"> (Show 10 per page) </Button>
              ):
              (
                <Button onClick={this.showAll} color="link" size="sm"> (Show all) </Button>
              )}
         </Row>
           <FormulasEntry/>
             <Row >
               <Col style={{'textAlign':'center'}}>
               <Button color="link" onClick={this.onPrevPage} disabled={!isPrevPage}> {' '}
                 <FontAwesomeIcon icon = "chevron-left"/>{' '}Prev
               </Button>
               Page: {this.props.formulas.page}
               <Button color="link" onClick={this.onNextPage} disabled={!isNextPage}>
                 Next{' '}<FontAwesomeIcon icon = "chevron-right"/>
               </Button>
             </Col>
             </Row>
             <Row>
             <Col style={{'textAlign': 'right'}}/>
               <Button onClick={() =>  this.props.exportFormulas(this.props.formulas.obj)}>Export Formulas</Button>
             </Row>
           </Container>
         </div>
       </Provider>
     );
   }
}

const mapStateToProps = state => ({
  sortFormulas: PropTypes.func.isRequired,
  exportFormulas: PropTypes.func.isRequired,
  formulas: state.formulas,
  auth: state.auth
});

export default connect(mapStateToProps, {sortFormulas, exportFormulas})(Formulas);
