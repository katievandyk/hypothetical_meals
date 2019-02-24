import React, { Component } from 'react';

import {
  Row, Col, UncontrolledAlert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { uploadCheck } from '../../actions/importActions';

class ImportAlerts extends Component {

  render(){
    const errors = this.props.import.error_msgs;
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

ImportAlerts.propTypes = {
  uploadCheck: PropTypes.func.isRequired,
  import: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  import: state.import
});

export default connect(mapStateToProps, {uploadCheck})(ImportAlerts);
