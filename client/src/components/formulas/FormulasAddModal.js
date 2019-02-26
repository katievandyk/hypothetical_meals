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
import SKUsFormIngTupleSelection from '../skus/SKUsFormIngTupleSelection';
import { addFormula, sortFormulas } from '../../actions/formulaActions';

class FormulasAddModal extends React.Component {
  state = {
    modal: false,
    name: '',
    number: '',
    ingredients_list: [],
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
        if(validate_kv[i][0] !== 'ingredients_list')
          return false;
        else if(validate_kv[i][1] === 'not-selected')
          return false;
      }
    }
    return true;
  }

  validate = e => {
    const field_type = e.target.name;
    const { validate } = this.state
    if (e.target.value.length > 0) {
      if(field_type === 'name'){
        validate[field_type] = 'has-success';
      }
      else if(field_type === 'number'){
        const numRex = /^[0-9]+$/mg
        if (numRex.test(e.target.value)) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid-num'
        }
      }
    } else if(field_type !== 'comment' ){
      validate[e.target.name] = 'is-empty';
    }
    this.setState({ validate });
  }

  onSubmit = e => {
    e.preventDefault();

    const newFormula = {
      name: this.state.name,
      number: this.state.number,
      ingredients_list: this.state.ingredients_list,
      comment: this.state.comment
    };
    var allRequiredFields = true;
    var newValidate = this.state.validate;
    if(newValidate.name !== 'has-success'){
      newValidate.name = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.ingredients_list !== 'has-success'){
      newValidate.ingredients_list = 'not-selected';
      allRequiredFields = false;
    }
    if(allRequiredFields && this.allValidated()){
      this.props.addFormula(newFormula,this.props.formulas.sortby,
        this.props.formulas.sortdir, 1, this.props.formulas.pagelimit,
        this.props.formulas.obj);
      if(this.props.getAddedFormula){
        this.props.getAddedFormula();
      }
      this.toggle();
    }
    else{
      this.setState({
        validate: newValidate
      });
    }

  }

  onIngListChange = (ing_list, valid) => {
    var val_obj = this.state.validate;
    if(valid){
      val_obj.ingredients_list = 'has-success';
    }
    else{
      val_obj.ingredients_list = 'has-danger';
    }
    var newIngList = [];
    for(var i = 0; i < ing_list.length; i ++){
      if(ing_list[i]._id.length > 0 && ing_list[i].quantity.length > 0){
        newIngList = [...newIngList, ing_list[i]];
      }
    }
    this.setState({
      ingredients_list: newIngList,
      validate: val_obj
    });
  }

  render() {
    return (
      <div style={{'display': 'inline-block'}}>
      <Button color="success" onClick={this.toggle}>
        Add Formula
      </Button>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}> Add Formula to Database </ModalHeader>
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
                  placeholder="Add Name of Formula"
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
                  placeholder="Add Formula Number"
                  onChange={this.onChange}>
                </Input>
                  <FormFeedback>
                    Please input a valid number.
                  </FormFeedback>
            </FormGroup>
            <SKUsFormIngTupleSelection onIngListChange={this.onIngListChange} defaultValue={this.state.edit_ingredients_list} validate={this.state.validate.ingredients_list}/>
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
            <Button disabled={!this.allValidated()} color="dark" className={this.allValidated() ? (''):('disabled')} onClick={this.onSubmit} block>
                  Add Formula
                </Button>
              </div>
          </Form>
        </ModalBody>
      </Modal>
      </div>
    );
  }
}

FormulasAddModal.propTypes = {
  sortFormulas: PropTypes.func.isRequired,
  addFormula: PropTypes.func.isRequired,
  formulas: PropTypes.object.isRequired,
  getAddedFormula: PropTypes.func
};

const mapStateToProps = state => ({
  formulas: state.formulas
});
export default connect(mapStateToProps, {addFormula, sortFormulas})(FormulasAddModal);
