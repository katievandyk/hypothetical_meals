import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import ScheduleWindow from '../components/schedule/ScheduleWindow';

import { Provider } from 'react-redux';
import store from '../store';

import { Container, Row, Col} from 'reactstrap';

class ManufacturingSchedule extends Component {

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
                            <Col> <h1>Manufacturing Schedule</h1> </Col>
                       </Row>
                </Container>
                <ScheduleWindow/>
                </Container>
            </div>

          </Provider>
      );
   }
}


export default ManufacturingSchedule;
