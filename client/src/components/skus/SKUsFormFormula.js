import React from 'react';
import {
  Form, FormGroup, FormFeedback, Input, Label,
  Row, Col, Modal, Button, ModalHeader, ModalBody
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sortFormulas, updateFormula } from '../../actions/formulaActions';
import SKUsFormIngTupleSelection from './SKUsFormIngTupleSelection';
import FormulasAddModal from '../formulas/FormulasAddModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

class SKUsFormFormula extends React.Component {
  state = {
    validate: {},
    selected_value: '',
    validateFormula: '',
    ing_list: [],
    edit_id: '',
    edit_name: '',
    edit_number: '',
    edit_comment: '',
    edit_ingredients_list: [],
    edit_modal: false,
    formula_id: '',
    add_error: false,
    use_added: false
  }
  componentDidMount() {
    this.props.sortFormulas('name', 'asc', 1, -1, {});
    if(this.props.defaultValue){
      this.setState({
        formula_id: this.props.defaultValue._id,
        selected_value: {value: this.props.defaultValue._id, label: this.props.defaultValue.name}
      });
    }
  }

  edit_toggle = () => {
    this.setState({
      edit_modal: !this.state.edit_modal,
      validate: {}
    });
  }

  onEditClick = () => {
    var selectedFormula={};
    if(this.state.formula_id.length > 0){
      [selectedFormula] = this.props.formulas.formulas.filter(({_id}) => _id === this.state.formula_id);
      this.setState({
        edit_modal: true,
        edit_id: selectedFormula._id,
        edit_name: selectedFormula.name,
        edit_number: selectedFormula.number,
        edit_ingredients_list: selectedFormula.ingredients_list,
        edit_comment: selectedFormula.comment
      });
    }
    else if(this.state.use_added){
      [selectedFormula] = this.props.formulas.formulas.filter(({_id}) => _id === this.props.formulas.added_formula._id);
      this.setState({
        edit_modal: true,
        edit_id: selectedFormula._id,
        edit_name: selectedFormula.name,
        edit_number: selectedFormula.number,
        edit_ingredients_list: selectedFormula.ingredients_list,
        edit_comment: selectedFormula.comment
      });
    }
  };

  onChangeEdit = e => {
    this.validate(e);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  validate = e => {
    const field_type = e.target.name;
    const { validate } = this.state
    if (e.target.value.length > 0) {
      if(field_type === 'edit_name'){
        validate[field_type] = 'has-success';
      }
      else if(field_type === 'edit_number'){
        const numRex = /^[0-9]+$/mg
        if (numRex.test(e.target.value)) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid-num'
        }
      }
    } else if(field_type !== 'edit_comment' ){
      validate[e.target.name] = 'is-empty';
    }
    this.setState({ validate });
  }

  allValidated = () => {
    const validate_kv = Object.entries(this.state.validate);
    for(var i=0; i < validate_kv.length; i++){
      if(validate_kv[i][1] !== 'has-success'){
        if(validate_kv[i][0] !== 'ingredients_list')
          return false;
        else if(validate_kv[i][1] === 'not-selected')
          return false;
      }
    }
    return true;
  }

  onEditSubmit = e => {
    e.preventDefault();

    var editedFormula = {
      _id: this.state.edit_id,
      name: this.state.edit_name,
      number: this.state.edit_number,
      ingredients_list: this.state.edit_ingredients_list,
      comment: this.state.edit_comment
    };

    var allRequiredFields = true;
    var newValidate = this.state.validate;
    if(newValidate.ingredients_list && newValidate.ingredients_list !== 'has-success'){
      newValidate.ingredients_list = 'not-selected';
      allRequiredFields = false;
    }
    if(allRequiredFields){
      this.props.updateFormula(editedFormula, this.props.formulas.sortby,
        this.props.formulas.sortdir, this.props.formulas.page, this.props.formulas.pagelimit,
        this.props.formulas.obj);
        this.setState({
          selected_value: {value: this.state.selected_value.value, label: editedFormula.name}
        });
      this.edit_toggle();
    }
    else{
      this.setState({
        validate: newValidate
      });
    }
  };

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
      edit_ingredients_list: newIngList,
      validate: val_obj
    });
  }

  onChange = (e) => {
    var isValid = true;
    this.setState({
      formula_id: e.value,
      add_error: false,
      use_added: false,
      selected_value: e
    });
    this.props.onUseAddedFormula(false);
    this.props.onFormulaChange(e.value, isValid);
  }

  getAddedFormula = () => {
      this.setState({
        use_added: true,
        add_error: true
      });

      this.props.onUseAddedFormula(true);
    }

  classNameValue = () => {
    if(this.props.validate === 'is-empty'){
      return "isInvalid";
    }
    else if(this.props.validate === 'has-success' || this.state.use_added){
      return "isValid";
    }
    else
      return "";
  }

  genOptions = (formulas) => {
    var newOptions = [];
    formulas.forEach(function(formula){
      var newOption = {value: formula._id, label: formula.name};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  render() {
    var addedFormula = this.props.formulas.added_formula;
    var add_error = this.props.formulas.error_msg;
    var validate = this.props.validate;
    return(
      <div>
      <FormGroup>
        <Label for="formula">Formula</Label>
        <Row>
          <Col md={6} style={{paddingRight: 0}}>
          <Select
            className={this.classNameValue()}
            classNamePrefix="react-select"
            options={this.genOptions(this.props.formulas.formulas)}
            onChange={this.onChange}
            name="formula"
            placeholder="Select Formula"
            value={(this.state.use_added && addedFormula._id)? ({value: addedFormula._id, label: addedFormula.name}):(this.state.selected_value)}/>
          <div style={{display:'block'}} className={validate === 'is-empty'? ("invalid-feedback"):("hidden")}>
            Select a valid formula from the dropdown list.
          </div>
          </Col>
          <Col md={1} style={{paddingLeft: 0}}>
          {(this.state.formula_id.length > 0 || this.state.use_added) &&
            (<Button size="sm" color="link"
              onClick={this.onEditClick}
              style={{'color':'black'}}>
              <FontAwesomeIcon icon = "edit"/>
            </Button>)
          }
          </Col>
          <Col md={1.5}>
          or
          </Col>
          <Col md={4}>
          <FormulasAddModal getAddedFormula={this.getAddedFormula}/>
          </Col>
        </Row>
        <Row>
        <Col><div style={{color: 'red'}}>
          {(this.state.add_error && this.state.add_error.length > 0) ? ('ADD ERROR: ' + add_error):('')}
        </div>
        </Col>
        </Row>
      </FormGroup>
      <Modal isOpen={this.state.edit_modal} toggle={this.edit_toggle}>
        <ModalHeader toggle={this.edit_toggle}> Edit Formula </ModalHeader>
        <ModalBody>
          <Form onSubmit={this.onEditSubmit}>
          <FormGroup>
            <Label for="edit_name">Name</Label>
              <Input
                valid={ this.state.validate.edit_name === 'has-success' }
                invalid={ this.state.validate.edit_name === 'is-empty' }
                type="text"
                name="edit_name"
                id="edit_name"
                onChange={this.onChangeEdit}
                defaultValue={this.state.edit_name}>
              </Input>
              <FormFeedback>
                Please input a name.
              </FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="edit_number">Number</Label>
              <Input
                valid={this.state.validate.edit_number === 'has-success' }
                invalid={this.state.validate.edit_number === 'not-valid-num'}
                type="text"
                name="edit_number"
                id="edit_number"
                placeholder="Add Formula Number"
                onChange={this.onChangeEdit}
                defaultValue={this.state.edit_number}>
              </Input>
                <FormFeedback>
                  Please input a valid number.
                </FormFeedback>
          </FormGroup>
          <SKUsFormIngTupleSelection onIngListChange={this.onIngListChange} defaultValue={this.state.edit_ingredients_list} validate={this.state.validate.ingredients_list}/>
          <FormGroup>
            <Label for="edit_comment">Comments</Label>
              <Input
                type="textarea"
                name="edit_comment"
                id="edit_comment"
                placeholder="Add any comments on the formula"
                onChange={this.onChangeEdit}
                defaultValue={this.state.edit_comment}>
              </Input>
          </FormGroup>
            <div><p style={{'fontSize':'0.8em', marginBottom: '0px'}} className={this.allValidated() ? ('hidden'):('')}>There are fields with errors. Please go back and fix these fields to submit.</p>
            <Button color="dark" disabled={!this.allValidated()} className={this.allValidated() ?(''): ('disabled')} onClick={this.onEditSubmit} block>
                  Submit Formula Edits
                </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      </div>
  );
  }
}


SKUsFormFormula.propTypes = {
  sortFormulas: PropTypes.func.isRequired,
  updateFormula: PropTypes.func.isRequired,
  formulas: PropTypes.object.isRequired,
  onFormulaChange: PropTypes.func.isRequired,
  onUseAddedFormula: PropTypes.func.isRequired,
  defaultValue: PropTypes.object,
  validate: PropTypes.string
};

const mapStateToProps = state => ({
  formulas: state.formulas
});
export default connect(mapStateToProps, {sortFormulas, updateFormula})(SKUsFormFormula);
