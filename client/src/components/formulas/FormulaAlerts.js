import React, { Component } from 'react';

import {
  Row, Col, UncontrolledAlert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class FormulaAlerts extends Component {

  render(){
    const error_msg = this.props.formulas.error_msg;
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

FormulaAlerts.propTypes = {
  formulas: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  formulas: state.formulas
});

export default connect(mapStateToProps)(FormulaAlerts);
