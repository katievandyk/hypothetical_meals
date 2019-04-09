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
import SKUsFormPLineSelection from './SKUsFormPLineSelection'
import SKUsFormFormula from './SKUsFormFormula';
import SKUsFormMLines from './SKUsFormMLines';
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
    formula: {},
    formula_scale_factor: '',
    manufacturing_lines: [],
    manufacturing_rate: '',
    setup_cost: '',
    run_cost: '',
    comment: '',
    validate: {},
    use_added_formula: false
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

  is_upca_standard = (code_str) => {
      if(code_str.length !== 12) {
          return false;
      }
      let code = parseInt(code_str);
      var i;
      var sum = 0;
      var code_temp = code;
      code /= 10;
      for(i = 1; i < 12; i++) {
          var digit = Math.floor(code % 10);
          if (i === 11 && !(digit === 0 | digit === 1 | digit >= 6 && digit <= 9)) {
              return false;
          }

          code /= 10;
          sum += i%2 === 0 ? digit : digit*3;
      }

      var check_digit = (10-sum%10)%10;
      if(check_digit !== code_temp % 10) {
          return false;
      }

      return true;
  };

  validate = e => {
    const field_type = e.target.name;
    const { validate } = this.state
    if (e.target.value.length > 0) {
      if(field_type === 'name' || field_type === 'unit_size'){
        validate[field_type] = 'has-success';
      }
      else if(field_type === 'number' || field_type === 'count_per_case'){
        const numRex = /^[0-9]+$/mg
        if (numRex.test(e.target.value)) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid-num'
        }
      }
      else if(field_type === 'formula_scale_factor' || field_type === 'manufacturing_rate'){
        const numRex = /^[1-9]\d*(\.\d+)?$/mg
        if (numRex.test(e.target.value)) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid'
        }
      }
      else if(field_type === 'case_number' || field_type === 'unit_number'){
        if(this.is_upca_standard(e.target.value)){
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid-upca'
        }
      }
      else if(field_type === 'run_cost' || field_type === 'setup_cost' ){
        const numRex = /^\s*\$?\s*([+-]?\d*\.?\d+)\D*$/;
        if (numRex.test(e.target.value) && parseFloat(numRex.exec(e.target.value)[1]) >= 0) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid'
        }
      }
    } else if(field_type !== 'comment' && field_type !== 'number'){
      validate[e.target.name] = 'is-empty';
    }
    this.setState({ validate });
  }

  allValidated = () => {
    const validate_kv = Object.entries(this.state.validate);
    for(var i = 0; i < validate_kv.length; i++){
      if(validate_kv[i][1] !== 'has-success'){
        if(validate_kv[i][0] !== 'manufacturing_lines')
          return false;
        else if(validate_kv[i][1] === 'not-selected')
          return false;
      }
    }
    return true;
  }

  onSubmit = e => {
    e.preventDefault();

    var newSKU = {
      name: this.state.name,
      number: this.state.number,
      case_number: this.state.case_number,
      unit_number: this.state.unit_number,
      unit_size: this.state.unit_size,
      product_line: this.state.product_line,
      count_per_case: this.state.count_per_case,
      formula: this.state.formula,
      formula_scale_factor: this.state.formula_scale_factor,
      manufacturing_lines: this.state.manufacturing_lines,
      manufacturing_rate: this.state.manufacturing_rate,
      setup_cost: this.state.setup_cost,
      run_cost: this.state.run_cost,
      comment: this.state.comment
    };

    var allRequiredFields = true;
    var newValidate = this.state.validate;

    if(this.state.use_added_formula){
      newSKU.formula = this.props.formulas.added_formula;
      newValidate.formula = 'has-success';
    }

    if(newValidate.name !== 'has-success'){
      newValidate.name = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.case_number !== 'has-success'){
      newValidate.case_number = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.unit_number !== 'has-success'){
      newValidate.unit_number = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.unit_size !== 'has-success'){
      newValidate.unit_size = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.product_line !== 'has-success'){
      newValidate.product_line = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.count_per_case !== 'has-success'){
      newValidate.count_per_case = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.formula !== 'has-success'){
      newValidate.formula = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.formula_scale_factor !== 'has-success'){
      newValidate.formula_scale_factor = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.manufacturing_lines !== 'has-success'){
      newValidate.manufacturing_lines = 'not-selected';
      allRequiredFields = false;
    }
    if(newValidate.manufacturing_rate !== 'has-success'){
      newValidate.manufacturing_rate = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.setup_cost !== 'has-success'){
      newValidate.setup_cost = 'is-empty';
      allRequiredFields = false;
    }
    if(newValidate.run_cost !== 'has-success'){
      newValidate.run_cost = 'is-empty';
      allRequiredFields = false;
    }
    this.setState({
      validate: newValidate
    });

    if(allRequiredFields && this.allValidated()){
      this.props.addSKU(newSKU, this.props.skus.sortby, this.props.skus.sortdir, 1, this.props.skus.pagelimit, this.props.skus.obj);
      this.toggle();
    }

  }

  onProductLineChange = (prod_line, valid) => {
    var val_obj = this.state.validate;
    if(valid){
      val_obj.product_line = 'has-success'
    }
    else{
      val_obj.product_line = 'is-empty'
    }
    this.setState({
      product_line: prod_line,
      validate: val_obj
    });
  }

  onFormulaChange = (formula, valid) => {
    var val_obj = this.state.validate;
    if(valid){
      val_obj.formula = 'has-success'
    }
    else{
      val_obj.formula = 'is-empty'
    }
    this.setState({
      formula: formula,
      validate: val_obj
    });
  }

  onLinesChange = (lines, valid) => {
    var val_obj = this.state.validate;
    if(valid){
      val_obj.manufacturing_lines = 'has-success';
    }
    else{
      val_obj.manufacturing_lines = 'has-danger';
    }
    var newLines = [];
    for(var i = 0; i < lines.length; i ++){
      if(lines[i]._id.length > 0 ){
        newLines = [...newLines, lines[i]];
      }
    }
    this.setState({
      manufacturing_lines: newLines,
      validate: val_obj
    });
  }

  onUseAddedFormula = (use_added) => {
    this.setState({use_added_formula: use_added});
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
                  valid={ this.state.validate.name === 'has-success' }
                  invalid={ this.state.validate.name === 'is-empty' }
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Add Name of SKU"
                  onChange={this.onChange}>
                </Input>
                <FormFeedback valid>
                </FormFeedback>
                <FormFeedback>
                  Please input a name.
                </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="number">Number</Label>
                <Input
                  valid={this.state.validate.number === 'has-success' }
                  invalid={this.state.validate.number === 'is-empty' || this.state.validate.number === 'not-valid-num'}
                  type="text"
                  name="number"
                  id="number"
                  placeholder="Add SKU Number"
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
              <Label for="case_number">Case UPC Number</Label>
                <Input
                  valid={this.state.validate.case_number === 'has-success' }
                  invalid={this.state.validate.case_number === 'is-empty' || this.state.validate.case_number === 'not-valid-upca'}
                  type="text"
                  name="case_number"
                  id="case_number"
                  placeholder="Add Case Number"
                  onChange={this.onChange}>
                </Input>
                {this.state.validate.case_number === 'is-empty' ? (
                  <FormFeedback>
                    Please input a value.
                  </FormFeedback>
                ):(
                  <FormFeedback>
                    Please input a valid UPC-A number.
                  </FormFeedback>
                )}
            </FormGroup>
            <FormGroup>
              <Label for="unit_number">Unit UPC Number</Label>
                <Input
                  valid={this.state.validate.unit_number === 'has-success' }
                  invalid={this.state.validate.unit_number === 'is-empty' || this.state.validate.unit_number === 'not-valid-upca'}
                  type="text"
                  name="unit_number"
                  id="unit_number"
                  placeholder="Add the Unit UPC Number"
                  onChange={this.onChange}>
                </Input>
                {this.state.validate.unit_number === 'is-empty' ? (
                  <FormFeedback>
                    Please input a value.
                  </FormFeedback>
                ):(
                  <FormFeedback>
                    Please input a valid UPC-A number.
                  </FormFeedback>
                )}
            </FormGroup>
            <FormGroup>
              <Label for="unit_size">Unit Size</Label>
                <Input
                  valid={this.state.validate.unit_size === 'has-success' }
                  invalid={this.state.validate.unit_size === 'is-empty' }
                  type="text"
                  name="unit_size"
                  id="unit_size"
                  placeholder="Add the Unit Size"
                  onChange={this.onChange}>
                </Input>
                <FormFeedback>
                  Please input a value.
                </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="count_per_case">Count Per Case</Label>
                <Input
                  valid={this.state.validate.count_per_case === 'has-success' }
                  invalid={this.state.validate.count_per_case === 'is-empty' || this.state.validate.count_per_case === 'not-valid-num'}
                  type="text"
                  name="count_per_case"
                  id="count_per_case"
                  placeholder="Add the Count per Case"
                  onChange={this.onChange}>
                </Input>
                {this.state.validate.count_per_case === 'is-empty' ? (
                  <FormFeedback>
                    Please input a value.
                  </FormFeedback>
                ):(
                  <FormFeedback>
                    Please input a valid number.
                  </FormFeedback>
                )}
            </FormGroup>
            <SKUsFormPLineSelection onProductLineChange={this.onProductLineChange} validate={this.state.validate.product_line}/>
            <SKUsFormFormula onFormulaChange={this.onFormulaChange} onUseAddedFormula={this.onUseAddedFormula} validate={this.state.validate.formula}/>
              <FormGroup>
                <Label for="formula_scale_factor">Formula Scale Factor</Label>
                  <Input
                    valid={this.state.validate.formula_scale_factor === 'has-success' }
                    invalid={this.state.validate.formula_scale_factor === 'is-empty' || this.state.validate.formula_scale_factor === 'not-valid'}
                    type="text"
                    name="formula_scale_factor"
                    id="formula_scale_factor"
                    placeholder="Add the Formula Scale Factor"
                    onChange={this.onChange}>
                  </Input>
                  {this.state.validate.formula_scale_factor === 'is-empty' ? (
                    <FormFeedback>
                      Please input a value.
                    </FormFeedback>
                  ):(
                    <FormFeedback>
                      Please input a valid scale factor.
                    </FormFeedback>
                  )}
              </FormGroup>
              <SKUsFormMLines onLinesChange={this.onLinesChange} validate={this.state.validate.manufacturing_lines}/>
              <FormGroup>
                <Label for="manufacturing_rate">Manufacturing Rate</Label>
                  <Input
                    valid={this.state.validate.manufacturing_rate === 'has-success' }
                    invalid={this.state.validate.manufacturing_rate === 'is-empty' || this.state.validate.manufacturing_rate === 'not-valid'}
                    type="text"
                    name="manufacturing_rate"
                    id="manufacturing_rate"
                    placeholder="Add the Manufacturing Rate"
                    onChange={this.onChange}>
                  </Input>
                  {this.state.validate.manufacturing_rate === 'is-empty' ? (
                    <FormFeedback>
                      Please input a value.
                    </FormFeedback>
                  ):(
                    <FormFeedback>
                      Please input a valid manufacturing rate.
                    </FormFeedback>
                  )}
              </FormGroup>
              <FormGroup>
                <Label for="setup_cost">Manufacturing Setup Cost</Label>
                  <Input
                    valid={this.state.validate.setup_cost === 'has-success' }
                    invalid={this.state.validate.setup_cost === 'is-empty' || this.state.validate.setup_cost === 'not-valid'}
                    type="text"
                    name="setup_cost"
                    id="setup_cost"
                    placeholder="Add the Manufacturing Setup Cost"
                    onChange={this.onChange}>
                  </Input>
                  {this.state.validate.setup_cost === 'is-empty' ? (
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
                <Label for="run_cost">Manufacturing Run Cost</Label>
                  <Input
                    valid={this.state.validate.run_cost === 'has-success' }
                    invalid={this.state.validate.run_cost === 'is-empty' || this.state.validate.run_cost === 'not-valid'}
                    type="text"
                    name="run_cost"
                    id="run_cost"
                    placeholder="Add the Manufacturing Run Cost"
                    onChange={this.onChange}>
                  </Input>
                  {this.state.validate.run_cost === 'is-empty' ? (
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
            <Button disabled={!this.allValidated()} className={this.allValidated() ? (''):('disabled')} color="dark" onClick={this.onSubmit.bind(this)} block>
                  Add SKU
                </Button>
              </div>
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
  skus: PropTypes.object.isRequired,
  formulas: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus,
  formulas: state.formulas
});
export default connect(mapStateToProps, {addSKU, sortSKUs})(SKUAddModal);
