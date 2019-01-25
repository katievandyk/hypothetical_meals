import React from 'react';
import {
  Badge, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, CustomInput
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class SKUFilters extends React.Component {
  state={
    modal: false,
    selected_skus: {}
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>SKU Filters:  {'  '}
      <Badge href="#" color="light"><FontAwesomeIcon icon = "times"/>{' '}None</Badge> {' '}
      <Badge href="#" onClick={this.toggle} color="success">+ Add SKU Filter</Badge>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Select SKU Filters to Add</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <div>
                <CustomInput type="checkbox" id="customSwitch" name="customSwitch" label="test"/>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
      </div>
    );
  }
}

SKUFilters.propTypes = {
  ing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ing: state.ing
});
export default connect(mapStateToProps, {})(SKUFilters);
