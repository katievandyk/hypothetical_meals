import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import PLinesAddModal from '../components/prod_lines/PLinesAddModal';
import PLinesEntry from '../components/prod_lines/PLinesEntry';
import { exportPLines } from '../actions/exportActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Provider } from 'react-redux';
import store from '../store';

import { Button } from 'reactstrap';

import {
  Container, Row, Col
} from 'reactstrap';

class ProductLines extends Component {
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
               <Col> <h1>Product Lines</h1> </Col>
               <Col> </Col>
             </Row>
             <Row>
               <Col>
               </Col>
               <Col style={{'textAlign': 'right'}}>
                 <PLinesAddModal/> &nbsp;
                 <Button onClick={() => { this.props.exportPLines() }}>Export</Button>
               </Col>
             </Row>
           </Container>
             <PLinesEntry/>
           </Container>
         </div>
       </Provider>
     );
   }
}

ProductLines.propTypes = {
  exportPLines: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { exportPLines })(ProductLines);
