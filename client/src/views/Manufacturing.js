import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

import { getGoals } from '../actions/goalsActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import GoalsEntry from '../components/goals/GoalsEntry';
import CalculatorEntry from '../components/goals/CalculatorEntry';
import CalculatorDropdown from '../components/goals/CalculatorDropdown';
import GoalsCreateModal from '../components/goals/GoalsCreateModal';
import GoalsExport from '../components/goals/GoalsExport';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';

import { Container, Row, Col} from 'reactstrap';

class Manufacturing extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
      this.props.getGoals();
  }

  calculatorCallback = e => {

  }

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
                    <Col> <GoalsExport goals={this.props.goals}/> </Col>
                </Row>
              </Container>
              <Container className="mt-5">
                <Container className="my-3">
                    <Row>
                        <Col> <h1>Manufacturing Calculator</h1> </Col>
                    </Row>
                </Container>
                <CalculatorEntry/>
                <Row>
                    <Col> <CalculatorDropdown goals={this.props.goals} calculatorCallback={this.calculatorCallback}/> &nbsp; </Col>
                </Row>
              </Container>
            </div>
          </Provider>
      );
   }
}

Manufacturing.propTypes = {
  getGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  goals: state.goals
});

export default connect(mapStateToProps, { getGoals })(Manufacturing);
