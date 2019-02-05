import React, { Component } from 'react';

import {
  Row, Col, UncontrolledAlert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class PLinesAlerts extends Component {

  render(){
    const errors = this.props.plines.error_msgs;
    return (
      <Row>
      <Col></Col>
      <Col md={9}>
      {errors.map((value, i) => (
        <UncontrolledAlert key={i} color="danger">
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

PLinesAlerts.propTypes = {
  plines: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  plines: state.plines
});

export default connect(mapStateToProps)(PLinesAlerts);