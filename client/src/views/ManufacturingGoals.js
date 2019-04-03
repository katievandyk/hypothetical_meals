import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { getGoals } from '../actions/goalsActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import GoalsEntry from '../components/goals/GoalsEntry';
import GoalsCreateModal from '../components/goals/GoalsCreateModal';
import GoalsExport from '../components/goals/GoalsExport';
import GoalAlerts from '../components/goals/GoalAlerts';

import { Provider } from 'react-redux';
import store from '../store';

import { Container, Row, Col} from 'reactstrap';

class ManufacturingGoals extends Component {

  componentDidMount() {
      this.props.getGoals(this.props.auth.user.id);
  }

   render() {
        return(
          <Provider store={store}>
            <div>
              <div>
                <AppNavbar />
                <GoalAlerts />
              </div>
              <Container>
                <Container className="mb-3">
                   <Row>
                        <Col> <h1>Manufacturing Goals</h1> </Col>
                   </Row>
                   <Row>
                      <Col> Click on a goal to view its ingredients. </Col>
                      <Col style={{'textAlign': 'right'}}> </Col>
                      <GoalsCreateModal buttonLabel="Create Goal"/> &nbsp;
                      <GoalsExport goals={this.props.goals}/>
                   </Row>
                </Container>
                <GoalsEntry/>
              </Container>
              </div>
          </Provider>
      );
   }
}

ManufacturingGoals.propTypes = {
  getGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  goals: state.goals,
  auth: state.auth
});

export default connect(mapStateToProps, { getGoals })(ManufacturingGoals);
