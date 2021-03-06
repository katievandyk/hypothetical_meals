import React, { Component } from 'react';

import {
  Row, Col, Alert, UncontrolledAlert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ScheduleAlerts extends Component {

  render(){
    const errors = this.props.schedule.error_msgs;
    var warnings = this.props.schedule.warning_msgs;
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
        {(warnings.length > 0 )?(
          <Alert color="warning">
          <h4>WARNING</h4>
          {warnings.map((value, i) => (
          <div key={i}>
            {value}
          </div>
            ))}
          </Alert>):("")
        }
        </Col>
        <Col></Col>
        </Row>
      );
  }
}

ScheduleAlerts.propTypes = {
  schedule: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  schedule: state.schedule
});

export default connect(mapStateToProps)(ScheduleAlerts);
