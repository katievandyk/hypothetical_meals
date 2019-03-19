import React from 'react';
import {
  Row, Col,
  ModalBody,
  Label,
  Input, InputGroupAddon, InputGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class SKUDrilldownModal extends React.Component {
  state = {
    modal: false,
  };

  toggle = () => {
    const { plines } = this.props.plines;
    this.setState({
      modal: !this.state.modal,
      selected_plines: plines
    });
  }

  render() {
    return (
      <div>
        <ModalBody>
            Placeholder for SKU drilldown.
        </ModalBody>
      </div>
    );
  }
 }

export default SKUDrilldownModal;