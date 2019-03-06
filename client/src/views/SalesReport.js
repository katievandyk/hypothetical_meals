import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import {
  Container, Row, Col, Button,
  Modal, ModalBody, ModalHeader, ModalFooter
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SalesReport extends Component {
  state = {
    reportGen: false,
  };

   render() {
     if(this.state.reportGen){
        return(
          <Provider store={store}>
            <div>
              <div>
                <AppNavbar />
              </div>
              <Container>
              <Container className="mb-3">
                <Row>
                  <Col> <h1>Sales Report</h1> </Col>
                </Row>
                <Row>No report generated.</Row>
              </Container>
              </Container>
            </div>
          </Provider>
      );
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
                  <Col> <h1>Sales Report</h1> </Col>
                </Row>
              </Container>
              </Container>
            </div>
          </Provider>
      );
   }
}

export default SalesReport;
