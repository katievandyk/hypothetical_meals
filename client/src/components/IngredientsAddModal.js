import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from 'reactstrap';
import { connect } from 'react-redux';
import { addIng } from '../actions/ingActions';

class IngredientsAddModal extends React.Component {
  state = {
    modal: false,
    name: '',
    number: '',
    vendor_info: '',
    package_size: '',
    cost_per_package: '',
    comment: ''
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const newIng = {
      name: this.state.name,
      number: this.state.number,
      vendor_info: this.state.vendor_info,
      package_size: this.state.package_size,
      cost_per_package: this.state.cost_per_package,
      comment: this.state.comment
    };

    this.props.addIng(newIng);
    this.toggle();
  }

  render() {
    return (
      <div>
      <Button color="success" onClick={this.toggle}>
        Add Ingredient
      </Button>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}> Add Ingredient to Database </ModalHeader>
        <ModalBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Add Name of Ingredient"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="number">Number</Label>
                <Input
                  type="text"
                  name="number"
                  id="number"
                  placeholder="Add Ingredient Number"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="vendor_info">Vendor's Info</Label>
                <Input
                  type="textarea"
                  name="vendor_info"
                  id="vendor_info"
                  placeholder="Add Vendor's Information"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="package_size">Package Size</Label>
                <Input
                  type="text"
                  name="package_size"
                  id="package_size"
                  placeholder="Add the Package Size"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="cost_per_package">Cost per Package</Label>
                <Input
                  type="text"
                  name="cost_per_package"
                  id="cost_per_package"
                  placeholder="Add the Cost Per Package"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="comment">Comments</Label>
                <Input
                  type="textarea"
                  name="comment"
                  id="comment"
                  placeholder="Add any comments on the ingredient"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <Button color="dark" style={{ marginTop: '2rem' }} type="submit" block>
                  Add Ingredient
                </Button>
          </Form>
        </ModalBody>
      </Modal>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  item: state.item
});
export default connect(mapStateToProps, {addIng})(IngredientsAddModal);
