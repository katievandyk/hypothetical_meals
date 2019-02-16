import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import LinesEntry from '../components/lines/LinesEntry'
import LinesCreateModal from '../components/lines/LinesCreateModal'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import { Container, Row, Col} from 'reactstrap';

class ManufacturingLines extends Component {

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
                            <Col> <h1>Manufacturing Lines</h1> </Col>
                       </Row>
                       <Row>
                            <Col style={{'textAlign': 'right'}}> </Col>
                            <LinesCreateModal />
                       </Row>
                   </Container>
                   <LinesEntry/>
                </Container>
            </div>

          </Provider>
      );
   }
}


export default ManufacturingLines;
