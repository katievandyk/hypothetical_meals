import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import LinesEntry from '../components/lines/LinesEntry'
import LinesAlerts from '../components/lines/LinesAlerts'
import LinesCreateModal from '../components/lines/LinesCreateModal'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Row, Col} from 'reactstrap';

class ManufacturingLines extends Component {

   render() {
        return(
          <Provider store={store}>
            <div>
                <div>
                    <AppNavbar />
                    <LinesAlerts />
                </div>
                <Container>
                    <Container className="mb-3">
                       <Row>
                            <Col> <h1>Manufacturing Lines</h1> </Col>
                       </Row>
                       {(this.props.auth.user.product || this.props.auth.isAdmin) &&
                       <Row>
                            <Col style={{'textAlign': 'right'}}> </Col>
                            <LinesCreateModal />
                       </Row>
                       }
                   </Container>
                   <LinesEntry/>
                </Container>
            </div>

          </Provider>
      );
   }
}

ManufacturingLines.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(ManufacturingLines);
