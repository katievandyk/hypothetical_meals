import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addIng, sortIngs } from '../../actions/ingActions';

class IngredientsAddModal extends React.Component {
  state = {
    modal: false,
    name: '',
    number: '',
    vendor_info: '',
    package_size: '',
    cost_per_package: '',
    comment: '',
    validate: {}
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      validate: {}
    });
  }

  onChange = e => {
    this.validate(e);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  allValidated = () => {
    const validate_kv = Object.entries(this.state.validate);
    for(var i = 0; i < validate_kv.length; i++){
      if(validate_kv[i][1] !== 'has-success'){
        return false;
      }
    }
    return true;
  }

  validate = e => {
    const field_type = e.target.name;
    const { validate } = this.state
    if (e.target.value.length > 0) {
      if(field_type === 'name' || field_type === 'package_size'){
        validate[field_type] = 'has-success';
      }
      else if(field_type === 'number'){
        const numRex = /^(?!0\d)\d*(\.\d+)?$/mg
        if (numRex.test(e.target.value)) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid-num'
        }
      }
      else if(field_type === 'cost_per_package'){
        const numRex = /^[1-9]\d*(\.\d+)?$/mg
        if (numRex.test(e.target.value)) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid'
        }
      }
    } else if(field_type !== 'comment' && field_type !== 'vendor_info' && field_type !== 'number'){
      validate[e.target.name] = 'is-empty';
    }
    this.setState({ validate });
  }

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

    this.props.addIng(newIng,this.props.ing.sortby, this.props.ing.sortdir, 1, this.props.ing.pagelimit, this.props.ing.obj);
    this.toggle();
  }

  render() {
    return (
      <div style={{'display': 'inline-block'}}>
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
                  valid={ this.state.validate.name === 'has-success' }
                  invalid={ this.state.validate.name === 'is-empty' }
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Add Name of Ingredient"
                  onChange={this.onChange}>
                </Input>
                <FormFeedback>
                  Please input a name.
                </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="number">Number</Label>
                <Input
                  valid={this.state.validate.number === 'has-success' }
                  invalid={this.state.validate.number === 'not-valid-num'}
                  type="text"
                  name="number"
                  id="number"
                  placeholder="Add Ingredient Number"
                  onChange={this.onChange}>
                </Input>
                {this.state.validate.number === 'is-empty' ? (
                  <FormFeedback>
                    Please input a value.
                  </FormFeedback>
                ):(
                  <FormFeedback>
                    Please input a valid number.
                  </FormFeedback>
                )}
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
                  valid={ this.state.validate.package_size === 'has-success' }
                  invalid={ this.state.validate.package_size === 'is-empty' }
                  type="text"
                  name="package_size"
                  id="package_size"
                  placeholder="Add the Package Size"
                  onChange={this.onChange}>
                </Input>
                <FormFeedback>
                  Please input a value.
                </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="cost_per_package">Cost per Package</Label>
                <Input
                  valid={this.state.validate.cost_per_package === 'has-success' }
                  invalid={this.state.validate.cost_per_package === 'is-empty' || this.state.validate.cost_per_package === 'not-valid'}
                  type="text"
                  name="cost_per_package"
                  id="cost_per_package"
                  placeholder="Add the Cost Per Package"
                  onChange={this.onChange}>
                </Input>
                {this.state.validate.cost_per_package === 'is-empty' ? (
                  <FormFeedback>
                    Please input a value.
                  </FormFeedback>
                ):(
                  <FormFeedback>
                    Please input a valid cost value.
                  </FormFeedback>
                )}
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
            <div><p style={{'fontSize':'0.8em', marginBottom: '0px'}} className={this.allValidated() ? ('hidden'):('')}>There are fields with errors. Please go back and fix these fields to submit.</p>
            <Button color="dark" className={this.allValidated() ? (''):('disabled')} type="submit" block>
                  Add Ingredient
                </Button>
              </div>
          </Form>
        </ModalBody>
      </Modal>
      </div>
    );
  }
}

IngredientsAddModal.propTypes = {
  sortIngs: PropTypes.func.isRequired,
  addIng: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ing: state.ing
});
export default connect(mapStateToProps, {addIng, sortIngs})(IngredientsAddModal);
