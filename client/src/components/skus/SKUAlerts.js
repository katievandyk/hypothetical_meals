import React, { Component } from 'react';

import {
  Row, Col, UncontrolledAlert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class SKUAlerts extends Component {
  render(){
    const errors = this.props.skus.error_msgs;
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

SKUAlerts.propTypes = {
  skus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus
});

export default connect(mapStateToProps)(SKUAlerts);
