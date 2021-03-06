import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import PLinesAddModal from '../components/prod_lines/PLinesAddModal';
import PLinesEntry from '../components/prod_lines/PLinesEntry';
import PLinesAlerts from '../components/prod_lines/PLinesAlerts';
import { exportPLines } from '../actions/exportActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Provider } from 'react-redux';
import store from '../store';
import { getPLines } from '../actions/plineActions';

import {
  Container, Row, Col, Button
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ProductLines extends Component {
  state={
    origLimit: 10
  }
  componentDidMount() {
    this.props.getPLines(1, 10);
  }

  onNextPage = () => {
    this.props.getPLines(this.props.plines.page + 1, this.props.plines.pagelimit);
  };

  onPrevPage = () => {
    this.props.getPLines(this.props.plines.page - 1, this.props.plines.pagelimit);
  };

  showAll = () => {
    this.props.getPLines(this.props.plines.page, -1);
  }

  haveLimit = () => {
    this.props.getPLines(this.props.plines.page, 10);
  }
   render() {
     var results = 0;
     var results_start = 0;
     var isPrevPage = false;
     var isNextPage = false;
     if(this.props.plines.pagelimit === -1){
       results = this.props.plines.count;
       results_start = 1;
     }
     else{
       results = Math.min(this.props.plines.page * this.props.plines.pagelimit, this.props.plines.count);
       results_start = (this.props.plines.page - 1)*10 + 1;
       isPrevPage = (this.props.plines.page) > 1;
       isNextPage = results < this.props.plines.count;
     }
     return(
       <Provider store={store}>
         <div>
           <div>
             <AppNavbar />
             <PLinesAlerts />
           </div>
           <Container>
           <Container className="mb-3">
             <Row>
               <Col> <h1>Product Lines</h1> </Col>
               <Col> </Col>
             </Row>
             <Row>
               <Col>
               </Col>
               <Col style={{'textAlign': 'right'}}>
                 {(this.props.auth.isAdmin || this.props.auth.user.product) && <PLinesAddModal/>}
               </Col>
             </Row>
           </Container>
           <Row>
             {this.props.plines.count === 0 ? (
               <em>Results: 0 total</em>
             ): (<em>Results: {results_start}-{results} of {this.props.plines.count} total</em>)}
              {this.props.plines.pagelimit === -1 ? (
                <Button onClick={this.haveLimit} color="link" size="sm"> (Show 10 per page) </Button>
              ):
              (
                <Button onClick={this.showAll} color="link" size="sm"> (Show all) </Button>
              )}
         </Row>
           <PLinesEntry/>
             <Row >
               <Col style={{'textAlign':'center'}}>
               <Button color="link" onClick={this.onPrevPage} disabled={!isPrevPage}> {' '}
                 <FontAwesomeIcon icon = "chevron-left"/>{' '}Prev
               </Button>
               Page: {this.props.plines.page}
               <Button color="link" onClick={this.onNextPage} disabled={!isNextPage}>
                 Next{' '}<FontAwesomeIcon icon = "chevron-right"/>
               </Button>
             </Col>
             </Row>
             <Row>
             <Col style={{'textAlign': 'right'}}/>
             <Button onClick={() => { this.props.exportPLines() }}>Export Product Lines</Button>
             </Row>
           </Container>
         </div>
       </Provider>
     );
   }
}

const mapStateToProps = state => ({
  getPLines: PropTypes.func.isRequired,
  exportPLines: PropTypes.func.isRequired,
  plines: state.plines,
  auth: state.auth
});

export default connect(mapStateToProps, {exportPLines, getPLines})(ProductLines);
