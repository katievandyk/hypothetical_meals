import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import PLinesAddModal from '../components/prod_lines/PLinesAddModal';
import PLinesEntry from '../components/prod_lines/PLinesEntry';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import PropTypes from 'prop-types';
import { getPLines } from '../actions/plineActions';
import { connect } from 'react-redux';
import {
  Container, Row, Col, Button
} from 'reactstrap';

class ProductLines extends Component {

  onNextPage = () => {
    this.props.getPLines(this.props.plines.page + 1);
  };

  onPrevPage = () => {
    this.props.getPLines(this.props.plines.page - 1);
  };
   render() {
     const results = Math.min(this.props.plines.page * this.props.plines.pagelimit, this.props.plines.count);
     const results_start = (this.props.plines.page - 1)*10 + 1;
     const isPrevPage = (this.props.plines.page) > 1;
     const isNextPage = results < this.props.plines.count;
     return(
       <Provider store={store}>
         <div>
           <div>
             <AppNavbar />
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
                 <PLinesAddModal/>
               </Col>
             </Row>
           </Container>
            <em>Results: {results_start}-{results} of {this.props.plines.count} total</em>
             <PLinesEntry/>
             <Button onClick={this.onPrevPage} disabled={!isPrevPage}> {' '}
               Previous Page
             </Button>
             Current Page: {this.props.plines.page}
             <Button onClick={this.onNextPage} disabled={!isNextPage}>
               Next Page
             </Button>
           </Container>
         </div>
       </Provider>
     );
   }
}

ProductLines.propTypes = {
  getPLines: PropTypes.func.isRequired,
  plines: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  plines: state.plines
});

export default connect(mapStateToProps, {getPLines})(ProductLines);
