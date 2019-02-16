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
import SKUsFormFormula from './SKUsFormFormula'
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
    } else if(field_type !== 'comment' && field_type !== 'number'){
      validate[e.target.name] = 'is-empty';
    }
    this.setState({ validate });
  }

  allValidated = () => {
    const validate_kv = Object.entries(this.state.validate);
    for(var i = 0; i < validate_kv.length; i++){
      if(validate_kv[i][1] !== 'has-success'){
        return false;
      }
    }
    return true;
  }

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
      formula: this.state.formula,
      formula_scale_factor: this.state.formula_scale_factor,
      manufacturing_lines: this.state.manufacturing_lines,
      manufacturing_rate: this.state.manufacturing_rate,
      comment: this.state.comment
    };

    this.props.addSKU(newSKU, this.props.skus.sortby, this.props.skus.sortdir, 1, this.props.skus.pagelimit, this.props.skus.obj);
    this.toggle();
  }

  onProductLineChange = (prod_line, valid) => {
    var val_obj = this.state.validate;
    if(valid){
      val_obj.product_line = 'has-success'
    }
    else{
      val_obj.product_line = 'has-danger'
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
      val_obj.formula = 'has-danger'
    }
    this.setState({
      formula: formula,
      validate: val_obj
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
            <SKUsFormPLineSelection onProductLineChange={this.onProductLineChange}/>
            <SKUsFormFormula onFormulaChange={this.onFormulaChange}/>
              <FormGroup>
                <Label for="formula_scale_factor">Formula Scale Factor</Label>
                  <Input
                    valid={this.state.validate.formula_scale_factor === 'has-success' }
                    invalid={this.state.validate.formula_scale_factor === 'is-empty' || this.state.validate.formula_scale_factor === 'not-valid'}
                    type="text"
                    name="formula_scale_factor"
                    id="formula_scale_factor"
                    placeholder="Add the Formula Scale Factor"
                    onChange={this.onChange}
                    defaultValue={this.state.formula_scale_factor}>
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
              <FormGroup>
                <Label for="manufacturing_rate">Manufacturing Rate</Label>
                  <Input
                    valid={this.state.validate.manufacturing_rate === 'has-success' }
                    invalid={this.state.validate.manufacturing_rate === 'is-empty' || this.state.validate.manufacturing_rate === 'not-valid'}
                    type="text"
                    name="manufacturing_rate"
                    id="manufacturing_rate"
                    placeholder="Add the Manufacturing Rate"
                    onChange={this.onChange}
                    defaultValue={this.state.manufacturing_rate}>
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
            <Button className={this.allValidated() ? (''):('disabled')} color="dark" onClick={this.onSubmit.bind(this)} block>
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
  skus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus
});
export default connect(mapStateToProps, {addSKU, sortSKUs})(SKUAddModal);
