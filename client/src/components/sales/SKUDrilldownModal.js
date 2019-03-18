import React from 'react';
import {
  Row, Col,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  CustomInput,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input, InputGroupAddon, InputGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class SalesReportGenerate extends React.Component {
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
      <div style={{'display': 'inline-block'}}>
      <Button color="success" onClick={this.toggle}>
        Generate Summary Report
      </Button>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader>SKU Drilldown for </ModalHeader>
        <ModalBody>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.toggle}>Export</Button>{' '}
          <Button color="secondary" onClick={this.toggle}>Close</Button>
        </ModalFooter>
      </Modal>
      </div>
    );
  }
 }

export default connect(mapStateToProps, {getPLines})(SKUDrilldownModal);