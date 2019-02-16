import React from 'react';
import {
  Table, Button, Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input, ListGroup, ListGroupItem
 } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getSKUs, sortSKUs, deleteSKU, updateSKU } from '../../actions/skuActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SKUsFormPLineSelection from './SKUsFormPLineSelection'
import SKUsFormFormula from './SKUsFormFormula'
import '../../styles.css'

class SKUsEntry extends React.Component {
  state = {
    modal: false,
    edit_id: '',
    edit_name: '',
    edit_number: '',
    edit_case_number: '',
    edit_unit_number: '',
    edit_unit_size: '',
    edit_product_line: '',
    edit_count_per_case: '',
    edit_formula: {},
    edit_formula_scale_factor: '',
    edit_manufacturing_lines: [],
    edit_manufacturing_rate: '',
    edit_comment: '',
    ml_modal: false,
    mlines: [],
    group_by_pl: false,
    validate: {}
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      validate: {}
    });
  }

  ml_toggle = () => {
    this.setState({
      ml_modal: !this.state.ml_modal
    });
  }

  componentDidMount() {
    this.props.sortSKUs('name', 'asc', 1, 10, {});
    if(this.props.skus.obj && this.props.skus.obj.group_pl && this.props.skus.obj.group_pl === "True"){
      this.setState({
        group_by_pl: true
      });
    }
  }

  onDeleteClick = id => {
    this.props.deleteSKU(id);
  };

  onEditClick = (id, name, number, case_number, unit_number, unit_size, count_per_case, product_line,
  formula, formula_scale_factor, manufacturing_lines, manufacturing_rate, comment) => {
    this.setState({
      modal: true,
      edit_id: id,
      edit_name: name,
      edit_number: number,
      edit_case_number: case_number,
      edit_unit_number: unit_number,
      edit_unit_size: unit_size,
      edit_product_line: product_line,
      edit_count_per_case: count_per_case,
      edit_formula: formula,
      edit_formula_scale_factor: formula_scale_factor,
      edit_manufacturing_lines: manufacturing_lines,
      edit_manufacturing_rate: manufacturing_rate,
      edit_comment: comment
    });
  };

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
      if(field_type === 'edit_name' || field_type === 'edit_unit_size'){
        validate[field_type] = 'has-success';
      }
      else if(field_type === 'edit_number' || field_type === 'edit_count_per_case'){
        const numRex = /^[0-9]+$/mg
        if (numRex.test(e.target.value)) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid-num'
        }
      }
      else if(field_type === 'edit_formula_scale_factor' || field_type === 'edit_manufacturing_rate'){
        const numRex = /^[1-9]\d*(\.\d+)?$/mg
        if (numRex.test(e.target.value)) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid'
        }
      }
      else if(field_type === 'edit_case_number' || field_type === 'edit_unit_number'){
        if(this.is_upca_standard(e.target.value)){
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid-upca'
        }
      }
    } else if(field_type !== 'edit_comment' && field_type !== 'edit_number'){
      validate[e.target.name] = 'is-empty';
    }
    this.setState({ validate });
  }

  allValidated = () => {
    const validate_kv = Object.entries(this.state.validate);
    for(var i=0; i < validate_kv.length; i++){
      if(validate_kv[i][1] !== 'has-success'){
        return false;
      }
    }
    return true;
  }

  onEditSubmit = e => {
    e.preventDefault();

    const editedSKU = {
      id: this.state.edit_id,
      name: this.state.edit_name,
      number: this.state.edit_number,
      case_number: this.state.edit_case_number,
      unit_number: this.state.edit_unit_number,
      unit_size: this.state.edit_unit_size,
      product_line: this.state.edit_product_line,
      count_per_case: this.state.edit_count_per_case,
      formula: this.state.edit_formula,
      formula_scale_factor: this.state.edit_formula_scale_factor,
      manufacturing_lines: this.state.edit_manufacturing_lines,
      manufacturing_rate: this.state.edit_manufacturing_rate,
      comment: this.state.edit_comment
    };
    this.props.updateSKU(editedSKU,this.props.skus.sortby, this.props.skus.sortdir, this.props.skus.page, this.props.skus.pagelimit, this.props.skus.obj);
    this.toggle();
  };

  onMLinesListClick = newMlines => {
    this.setState({
      mlines: newMlines
    });
    this.ml_toggle();
  }

  onProductLineChange = (prod_line, valid) => {
    var val_obj = this.state.validate;
    if(valid){
      val_obj.product_line = 'has-success';
    }
    else{
      val_obj.product_line = 'has-danger';
    }
    this.setState({
      edit_product_line: prod_line,
      validate: val_obj
    });
  };

  onFormulaChange = (formula, valid) => {
    var val_obj = this.state.validate;
    if(valid){
      val_obj.formula = 'has-success'
    }
    else{
      val_obj.formula = 'has-danger'
    }
    this.setState({
      edit_formula: formula,
      validate: val_obj
    });
  }

  getSortIcon = (field) =>{
    if(this.props.skus.sortby === field && this.props.skus.sortdir === 'desc'){
      return <FontAwesomeIcon className='main-green' icon = "sort-down"/>
    }
    else if(this.props.skus.sortby === field && this.props.skus.sortdir === 'asc'){
      return <FontAwesomeIcon className='main-green' icon = "sort-up"/>
    }
    else{
      return <FontAwesomeIcon icon = "sort"/>
    }
  }

  sortCol = (field, e) => {
    if(this.props.skus.sortby === field){
      if(this.props.skus.sortdir === 'asc'){
        this.props.sortSKUs(field, 'desc', 1, this.props.skus.pagelimit, this.props.skus.obj);
      }
      else{
        this.props.sortSKUs(field, 'asc', 1, this.props.skus.pagelimit, this.props.skus.obj);
      }
    }
    else{
      this.props.sortSKUs(field, 'asc', 1, this.props.skus.pagelimit, this.props.skus.obj);
    }
  }

  editForm = () => {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}> Edit SKU </ModalHeader>
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
                  onChange={this.onChange}
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
                  invalid={this.state.validate.edit_number === 'is-empty' || this.state.validate.edit_number === 'not-valid-num'}
                  type="text"
                  name="edit_number"
                  id="edit_number"
                  placeholder="Add SKU Number"
                  onChange={this.onChange}
                  defaultValue={this.state.edit_number}>
                </Input>
                {this.state.validate.edit_number === 'is-empty' ? (
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
              <Label for="edit_case_number">Case UPC#</Label>
                <Input
                  valid={this.state.validate.edit_case_number === 'has-success' }
                  invalid={this.state.validate.edit_case_number === 'is-empty' || this.state.validate.edit_case_number === 'not-valid-upca'}
                  type="text"
                  name="edit_case_number"
                  id="edit_case_number"
                  placeholder="Add Case UPC#"
                  onChange={this.onChange}
                  defaultValue={this.state.edit_case_number}>
                </Input>
                {this.state.validate.edit_case_number === 'is-empty' ? (
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
              <Label for="edit_unit_number">Unit UPC#</Label>
                <Input
                  valid={this.state.validate.edit_unit_number === 'has-success' }
                  invalid={this.state.validate.edit_unit_number === 'is-empty' || this.state.validate.edit_unit_number === 'not-valid-upca'}
                  type="text"
                  name="edit_unit_number"
                  id="edit_unit_number"
                  placeholder="Add the Unit UPC#"
                  onChange={this.onChange}
                  defaultValue={this.state.edit_unit_number}>
                </Input>
                {this.state.validate.edit_unit_number === 'is-empty' ? (
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
              <Label for="edit_unit_size">Unit Size</Label>
                <Input
                  valid={this.state.validate.edit_unit_size === 'has-success' }
                  invalid={this.state.validate.edit_unit_size === 'is-empty'}
                  type="text"
                  name="edit_unit_size"
                  id="edit_unit_size"
                  placeholder="Add the Unit Size"
                  onChange={this.onChange}
                  defaultValue={this.state.edit_unit_size}>
                </Input>
                <FormFeedback>
                  Please input a value.
                </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="edit_count_per_case">Count per Case</Label>
                <Input
                  valid={this.state.validate.edit_count_per_case === 'has-success' }
                  invalid={this.state.validate.edit_count_per_case === 'is-empty' || this.state.validate.edit_count_per_case === 'not-valid-num'}
                  type="text"
                  name="edit_count_per_case"
                  id="edit_count_per_case"
                  placeholder="Add the Count per Case"
                  onChange={this.onChange}
                  defaultValue={this.state.edit_count_per_case}>
                </Input>
                {this.state.validate.edit_count_per_case === 'is-empty' ? (
                  <FormFeedback>
                    Please input a value.
                  </FormFeedback>
                ):(
                  <FormFeedback>
                    Please input a valid number.
                  </FormFeedback>
                )}
            </FormGroup>
            <SKUsFormPLineSelection onProductLineChange={this.onProductLineChange} defaultValue={this.state.edit_product_line._id}/>
            <SKUsFormFormula onFormulaChange={this.onFormulaChange} defaultValue={this.state.edit_formula._id}/>
            <FormGroup>
                <Label for="edit_formula_scale_factor">Formula Scale Factor</Label>
                  <Input
                    valid={this.state.validate.edit_formula_scale_factor === 'has-success' }
                    invalid={this.state.validate.edit_formula_scale_factor === 'is-empty' || this.state.validate.edit_formula_scale_factor === 'not-valid'}
                    type="text"
                    name="edit_formula_scale_factor"
                    id="edit_formula_scale_factor"
                    placeholder="Add the Formula Scale Factor"
                    onChange={this.onChange}
                    defaultValue={this.state.edit_formula_scale_factor}>
                  </Input>
                  {this.state.validate.edit_formula_scale_factor === 'is-empty' ? (
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
                <Label for="edit_manufacturing_rate">Manufacturing Rate</Label>
                  <Input
                    valid={this.state.validate.edit_manufacturing_rate === 'has-success' }
                    invalid={this.state.validate.edit_manufacturing_rate === 'is-empty' || this.state.validate.edit_manufacturing_rate === 'not-valid'}
                    type="text"
                    name="edit_manufacturing_rate"
                    id="edit_manufacturing_rate"
                    placeholder="Add the Manufacturing Rate"
                    onChange={this.onChange}
                    defaultValue={this.state.edit_manufacturing_rate}>
                  </Input>
                  {this.state.validate.edit_manufacturing_rate === 'is-empty' ? (
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
              <Label for="edit_comment">Comments</Label>
                <Input
                  type="textarea"
                  name="edit_comment"
                  id="edit_comment"
                  placeholder="Add any comments on the ingredient"
                  onChange={this.onChange}
                  defaultValue={this.state.edit_comment}>
                </Input>
            </FormGroup>
            <div><p style={{'fontSize':'0.8em', marginBottom: '0px'}} className={this.allValidated() ? ('hidden'):('')}>There are fields with errors. Please go back and fix these fields to submit.</p>
            <Button color="dark" className={this.allValidated() ?(''): ('disabled')} type="submit" block>
                  Submit SKU Edits
                </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    );
  }

  mlModal = () => {
    return (
      <Modal isOpen={this.state.ml_modal} toggle={this.ml_toggle}>
        <ModalHeader toggle={this.ml_toggle}>Manufacturing Lines for SKU:</ModalHeader>
        <ModalBody>
          <ListGroup>
            {this.state.mlines.map(({_id}) => (
            <ListGroupItem key={_id._id}> <div>{_id.shortname}</div> </ListGroupItem>
            ))}
          </ListGroup>
        </ModalBody>
      </Modal>
    );
  }

  render() {
    const { skus } = this.props.skus;
    const loading = this.props.skus.loading;
    if(loading || skus === 0){
      return (
        <div style={{'textAlign':'center'}}>
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
        </div>

      );
    }
    else if (this.props.skus.obj && this.props.skus.obj.group_pl && this.props.skus.obj.group_pl === "True") {
      return (
        <div>
          {Object.entries(skus).map(([key, value]) => (
          <div key={key}>
            <h3>{key}</h3>
            <Table responsive size="sm">
              <thead>
                <tr>
                  <th style={{cursor:'pointer'}}
                    onClick={this.sortCol.bind(this, 'name')}>
                    Name{' '}
                    {this.getSortIcon('name')}
                  </th>
                  <th style={{cursor:'pointer'}}
                    onClick={this.sortCol.bind(this, 'number')}>
                    SKU#{' '}
                      {this.getSortIcon('number')}
                  </th>
                  <th style={{cursor:'pointer'}}
                    onClick={this.sortCol.bind(this, 'case_number')}>
                    Case UPC#{' '}
                      {this.getSortIcon('case_number')}
                  </th>
                  <th style={{cursor:'pointer'}}
                    onClick={this.sortCol.bind(this, 'unit_number')}>
                    Unit UPC#{' '}
                      {this.getSortIcon('unit_number')}
                  </th>
                  <th style={{cursor:'pointer'}}
                    onClick={this.sortCol.bind(this, 'unit_size')}>
                    Unit Size{' '}
                      {this.getSortIcon('unit_size')}
                  </th>
                  <th style={{cursor:'pointer'}}
                    onClick={this.sortCol.bind(this, 'count_per_case')}>
                    Count/Case{' '}
                      {this.getSortIcon('count_per_case')}
                  </th>
                  <th style={{cursor:'pointer'}}
                    onClick={this.sortCol.bind(this, 'product_line')}>
                    Product Line{' '}
                      {this.getSortIcon('product_line')}
                  </th>
                  <th>Formula</th>
                    <th style={{cursor:'pointer'}}
                      onClick={this.sortCol.bind(this, 'formula_scale_factor')}>
                      Formula Scale Factor{' '}
                        {this.getSortIcon('formula_scale_factor')}
                    </th>
                  <th>Mfg. Lines</th>
                  <th style={{cursor:'pointer'}}
                    onClick={this.sortCol.bind(this, 'manufacturing_rate')}>
                    Mfg. Rate{' '}
                      {this.getSortIcon('manufacturing_rate')}
                  </th>
                  <th>Comments</th>
                  {this.props.auth.isAdmin && <th>Edit</th>}
                  {this.props.auth.isAdmin && <th>Delete</th>}
                </tr>
              </thead>
              <tbody is="transition-group" >
                <TransitionGroup className="ingredients-table" component={null}>
                  {value.map(({_id, name, number, case_number, unit_number, unit_size,
                    count_per_case, product_line, formula, formula_scale_factor,
                    manufacturing_lines, manufacturing_rate, comment }) => (
                    <CSSTransition key={_id} timeout={500} classNames="fade">
                      <tr>
                        <td> {name} </td>
                        <td> {number} </td>
                        <td> {case_number} </td>
                        <td> {unit_number} </td>
                        <td> {unit_size} </td>
                        <td> {count_per_case}</td>
                        {product_line ? (<td> {product_line.name}</td>):(<td></td>)}
                        {formula ? (<td> {formula.name}</td>):(<td></td>)}
                        <td> {formula_scale_factor} </td>
                        <td>
                          <Button size="sm" color="link"
                          onClick={this.onMLinesListClick.bind(this, manufacturing_lines)}
                          style={{'color':'black'}}>
                            <FontAwesomeIcon icon="list"/>
                          </Button>
                        </td>
                        <td> {manufacturing_rate} </td>
                        <td style={{wordBreak:'break-all'}}> {comment} </td>
                        {this.props.auth.isAdmin &&
                          <td>
                            <Button size="sm" color="link"
                              onClick={this.onEditClick.bind(this,
                                _id, name, number, case_number, unit_number, unit_size,
                                  count_per_case, product_line, formula, formula_scale_factor,
                                  manufacturing_lines, manufacturing_rate, comment
                              )}
                              style={{'color':'black'}}>
                              <FontAwesomeIcon icon = "edit"/>
                            </Button>
                          </td>
                        }
                        {this.props.auth.isAdmin &&
                          <td >
                            <Button size="sm" color="link"
                              onClick={this.onDeleteClick.bind(this, _id)}
                              style={{'color':'black'}}>
                              <FontAwesomeIcon icon="trash"/>
                            </Button>
                          </td>
                        }
                      </tr>
                    </CSSTransition>
                ))}
              </TransitionGroup>
              </tbody>
            </Table>
            {this.editForm()}
            {this.mlModal()}
          </div>
          ))}
        </div>
      )
    }
    else {
      return (
        <div>
          <Table responsive size="sm">
            <thead>
              <tr>
                <th style={{cursor:'pointer'}}
                  onClick={this.sortCol.bind(this, 'name')}>
                  Name{' '}
                  {this.getSortIcon('name')}
                </th>
                <th style={{cursor:'pointer'}}
                  onClick={this.sortCol.bind(this, 'number')}>
                  SKU#{' '}
                    {this.getSortIcon('number')}
                </th>
                <th style={{cursor:'pointer'}}
                  onClick={this.sortCol.bind(this, 'case_number')}>
                  Case UPC#{' '}
                    {this.getSortIcon('case_number')}
                </th>
                <th style={{cursor:'pointer'}}
                  onClick={this.sortCol.bind(this, 'unit_number')}>
                  Unit UPC#{' '}
                    {this.getSortIcon('unit_number')}
                </th>
                <th style={{cursor:'pointer'}}
                  onClick={this.sortCol.bind(this, 'unit_size')}>
                  Unit Size{' '}
                    {this.getSortIcon('unit_size')}
                </th>
                <th style={{cursor:'pointer'}}
                  onClick={this.sortCol.bind(this, 'count_per_case')}>
                  Count/Case{' '}
                    {this.getSortIcon('count_per_case')}
                </th>
                <th style={{cursor:'pointer'}}
                  onClick={this.sortCol.bind(this, 'product_line')}>
                  Product Line{' '}
                    {this.getSortIcon('product_line')}
                </th>
                <th>Formula</th>
                  <th style={{cursor:'pointer'}}
                    onClick={this.sortCol.bind(this, 'formula_scale_factor')}>
                    Formula Scale Factor{' '}
                      {this.getSortIcon('formula_scale_factor')}
                  </th>
                <th>Mfg. Lines</th>
                <th style={{cursor:'pointer'}}
                  onClick={this.sortCol.bind(this, 'manufacturing_rate')}>
                  Mfg. Rate{' '}
                    {this.getSortIcon('manufacturing_rate')}
                </th>
                <th>Comments</th>
                {this.props.auth.isAdmin && <th>Edit</th> }
                {this.props.auth.isAdmin && <th>Delete</th>}
              </tr>
            </thead>
            <tbody is="transition-group" >
              <TransitionGroup className="ingredients-table" component={null}>
                {skus.map(({_id, name, number, case_number, unit_number, unit_size,
                  count_per_case, product_line, formula, formula_scale_factor,
                  manufacturing_lines, manufacturing_rate, comment }) => (
                  <CSSTransition key={_id} timeout={500} classNames="fade">
                    <tr>
                      <td> {name} </td>
                      <td> {number} </td>
                      <td> {case_number} </td>
                      <td> {unit_number} </td>
                      <td> {unit_size} </td>
                      <td> {count_per_case}</td>
                      {product_line ? (<td> {product_line.name}</td>):(<td></td>)}
                      {formula ? (<td> {formula.name}</td>):(<td></td>)}
                      <td> {formula_scale_factor} </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={this.onMLinesListClick.bind(this, manufacturing_lines)}
                        style={{'color':'black'}}>
                          <FontAwesomeIcon icon="list"/>
                        </Button>
                      </td>
                      <td> {manufacturing_rate} </td>
                      <td style={{wordBreak:'break-all'}}> {comment} </td>
                      {this.props.auth.isAdmin &&
                        <td>
                          <Button size="sm" color="link"
                            onClick={this.onEditClick.bind(this,
                              _id, name, number, case_number, unit_number, unit_size,
                                count_per_case, product_line, formula, formula_scale_factor,
                                manufacturing_lines, manufacturing_rate, comment
                            )}
                            style={{'color':'black'}}>
                            <FontAwesomeIcon icon = "edit"/>
                          </Button>
                        </td>
                      }
                      {this.props.auth.isAdmin &&
                        <td >
                          <Button size="sm" color="link"
                            onClick={this.onDeleteClick.bind(this, _id)}
                            style={{'color':'black'}}>
                            <FontAwesomeIcon icon="trash"/>
                          </Button>
                        </td>
                      }
                    </tr>
                  </CSSTransition>
              ))}
            </TransitionGroup>
            </tbody>
          </Table>
          {this.editForm()}
          {this.mlModal()}
          </div>

      );
    }
  }
}

SKUsEntry.propTypes = {
  getSKUs: PropTypes.func.isRequired,
  sortSKUs: PropTypes.func.isRequired,
  deleteSKU: PropTypes.func.isRequired,
  updateSKU: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  skus: state.skus,
  auth: state.auth
});

export default connect(mapStateToProps, { getSKUs, sortSKUs, deleteSKU, updateSKU })(SKUsEntry);
