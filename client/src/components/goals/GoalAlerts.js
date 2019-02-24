import React, { Component } from 'react';

import {
  Row, Col, UncontrolledAlert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class GoalAlerts extends Component {

  render(){
    const errors = this.props.goals.error_msgs;
      return (
        <Row>
        <Col></Col>
        <Col md={9}>
        {errors.map((value, i) => (
          <UncontrolledAlert key={i} className={(i !== errors.length - 1) ? ("hidden"):("")} color="danger">
          <h4>ERROR</h4>
          {value}
          </UncontrolledAlert>
        ))}
        </Col>
        <Col></Col>
        </Row>
      );
  }
}

GoalAlerts.propTypes = {
  goals: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  goals: state.goals
});

export default connect(mapStateToProps)(GoalAlerts);
