import React, { Component } from 'react';

import {
  Row, Col, UncontrolledAlert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class IngredientsAlerts extends Component {
  render(){
    const errors = this.props.ing.error_msgs;
    return (
      <Row>
      <Col></Col>
      <Col md={9}>
      {errors.map((value, i) => (
        <UncontrolledAlert className={(i !== errors.length - 1) ? ("hidden"):("")} key={i} color="danger">
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

IngredientsAlerts.propTypes = {
  ing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ing: state.ing
});

export default connect(mapStateToProps)(IngredientsAlerts);
