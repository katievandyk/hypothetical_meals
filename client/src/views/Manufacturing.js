import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import GoalsEntry from '../components/GoalsEntry';
import CalculatorEntry from '../components/CalculatorEntry';
import GoalsCreateModal from '../components/GoalsCreateModal';
import GoalsExport from '../components/GoalsExport';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import { Container, Row, Col } from 'reactstrap';

class Manufacturing extends Component {
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
                        <Col> <h1>Manufacturing Goals</h1> </Col>
                    </Row>
                </Container>
                <GoalsEntry/>
                <Row>
                    <Col> <GoalsCreateModal buttonLabel="Create Goal"/> </Col>
                    <Col> <GoalsExport/> </Col>
                </Row>
                <Container className="my-3">
                    <Row>
                        <Col> <h1>Manufacturing Calculator</h1> </Col>
                    </Row>
                </Container>
                <CalculatorEntry/>
              </Container>
            </div>
          </Provider>
      );
   }
}

export default Manufacturing;
