import React, { Component } from 'react';

import {
  Row, Col, UncontrolledAlert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { uploadCheck } from '../../actions/importActions';

class ImportAlerts extends Component {

  render(){
    const error_msg = this.props.import.error_msg;
    if(error_msg.length > 0){
      return (
        <Row>
        <Col></Col>
        <Col md={9}>
          <UncontrolledAlert color="danger">
          <h4>ERROR</h4>
          {error_msg}
          </UncontrolledAlert>
        </Col>
        <Col></Col>
        </Row>
      );
    }
    else{
      return null;
    }
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
