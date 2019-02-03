import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SKUsFormPLineSelection from './SKUsFormPLineSelection'
import SKUsFormIngTupleSelection from './SKUsFormIngTupleSelection'
import { addSKU, sortSKUs } from '../../actions/skuActions';

class SKUAddModal extends React.Component {
  state = {
    modal: false,
    name: '',
    number: '',
    case_number: '',
    unit_number: '',
    unit_size: '',
    product_line: '',
    count_per_case: '',
    ingredients_list: [],
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

    const newSKU = {
      name: this.state.name,
      number: this.state.number,
      case_number: this.state.case_number,
      unit_number: this.state.unit_number,
      unit_size: this.state.unit_size,
      product_line: this.state.product_line,
      count_per_case: this.state.count_per_case,
      ingredients_list: this.state.ingredients_list,
      comment: this.state.comment
    };
    this.props.addSKU(newSKU);
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir, 1, this.props.skus.pagelimit, this.props.skus.obj);
    this.toggle();
  }

  onIngListChange = (ing_list) => {
    this.setState({
      ingredients_list: ing_list
    });
  }

  onProductLineChange = (prod_line) => {
    this.setState({
      product_line: prod_line
    });
  }

  render() {
    return (
      <div style={{'display': 'inline-block'}}>
      <Button color="success" onClick={this.toggle}>
        Add SKU
      </Button>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}> Add SKU to Database </ModalHeader>
        <ModalBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Add Name of SKU"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="number">Number</Label>
                <Input
                  type="text"
                  name="number"
                  id="number"
                  placeholder="Add SKU Number"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="case_number">Case UPC Number</Label>
                <Input
                  type="text"
                  name="case_number"
                  id="case_number"
                  placeholder="Add Case Number"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="unit_number">Unit UPC Number</Label>
                <Input
                  type="text"
                  name="unit_number"
                  id="unit_number"
                  placeholder="Add the Unit UPC Number"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="unit_size">Unit Size</Label>
                <Input
                  type="text"
                  name="unit_size"
                  id="unit_size"
                  placeholder="Add the Unit Size"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="count_per_case">Count Per Case</Label>
                <Input
                  type="text"
                  name="count_per_case"
                  id="count_per_case"
                  placeholder="Add the Count per Case"
                  onChange={this.onChange}>
                </Input>
            </FormGroup>
            <SKUsFormPLineSelection onProductLineChange={this.onProductLineChange}/>
            <SKUsFormIngTupleSelection onIngListChange={this.onIngListChange}/>
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
                  Add SKU
                </Button>
          </Form>
        </ModalBody>
      </Modal>
      </div>
    );
  }
}

SKUAddModal.propTypes = {
  sortSKUs: PropTypes.func.isRequired,
  addSKU: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus
});
export default connect(mapStateToProps, {addSKU, sortSKUs})(SKUAddModal);
