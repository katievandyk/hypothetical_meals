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

class Manufacturing extends Component {

  constructor(props) {
    super(props);
        this.refresh = this.refresh.bind(this);
    }

  componentDidMount() {
      this.props.getGoals(this.props.auth.user_email);
  }

   refresh = () => {
       window.location.reload();
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
                      <GoalsCreateModal onEditCallback={this.edit} refresh={this.refresh} buttonLabel="Create Goal"/> &nbsp;
                      <GoalsExport goals={this.props.goals}/>
                   </Row>
                </Container>
                <GoalsEntry user_email={this.props.auth.user_email} />
              </Container>
              </div>
          </Provider>
      );
   }
}

GoalsEntry.propTypes = {
  getGoals: PropTypes.func,
  goals: PropTypes.object,
  auth: PropTypes.object
};

const mapStateToProps = (state) => ({
  goals: state.goals,
  auth: state.auth
});

export default connect(mapStateToProps, { getGoals })(Manufacturing);
