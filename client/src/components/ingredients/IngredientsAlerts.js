import React, { Component } from 'react';

import {
  Row, Col, UncontrolledAlert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class IngredientsAlerts extends Component {

  render(){
    const error_msg = this.props.ing.error_msg;
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

IngredientsAlerts.propTypes = {
  ing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ing: state.ing
});

export default connect(mapStateToProps)(IngredientsAlerts);
