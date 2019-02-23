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
  Input,
  ListGroup, ListGroupItem
 } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { sortFormulas, getFormulaSKUs, updateFormula, deleteFormula} from '../../actions/formulaActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SKUsFormIngTupleSelection from '../skus/SKUsFormIngTupleSelection'
import '../../styles.css'

class FormulasEntry extends React.Component {
  state = {
    modal: false,
    edit_id: '',
    edit_name: '',
    edit_number: '',
    edit_comment: '',
    edit_ingredients_list: [],
    sku_modal: false,
    validate: {},
    sku_info: {},
    sku_info_modal: false
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      validate: {}
    });
  }

  sku_toggle = () => {
    this.setState({
      sku_modal: !this.state.sku_modal
    });
  }

  sku_info_toggle = () => {
    this.setState({
      sku_info_modal: !this.state.sku_info_modal
    });
  }

  componentDidMount() {
    this.props.sortFormulas(this.props.formulas.sortby,
      this.props.formulas.sortdir, this.props.formulas.page,
      10, this.props.formulas.obj);
  }

  onDeleteClick = id => {
    this.props.deleteFormula(id);
  };

  onEditClick = (id, name, number, ingredients_list, comment) => {
    this.setState({
      modal: true,
      edit_id: id,
      edit_name: name,
      edit_number: number,
      edit_ingredients_list: ingredients_list,
      edit_comment: comment
    });
  };

  onSKUInfoClick = sku => {
    this.setState({
      sku_info: sku,
      sku_info_modal: true
    });
  }

  onChange = e => {
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

    const editedFormula = {
      _id: this.state.edit_id,
      name: this.state.edit_name,
      number: this.state.edit_number,
      ingredients_list: this.state.edit_ingredients_list,
      comment: this.state.edit_comment
    };
    var allRequiredFields = true;
    var newValidate = this.state.validate;
    if(newValidate.ingredients_list !== 'has-success'){
      newValidate.ingredients_list = 'not-selected';
      allRequiredFields = false;
    }

    if(allRequiredFields){
      this.props.updateFormula(editedFormula, this.props.formulas.sortby,
        this.props.formulas.sortdir, this.props.formulas.page, this.props.formulas.pagelimit,
        this.props.formulas.obj);
      this.toggle();
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

  onSKUListClick = id => {
    this.sku_toggle();
    this.props.getFormulaSKUs(id);
  };

  skuInfoModal = () => {
    var sku = this.state.sku_info;
    return (
      <Modal isOpen={this.state.sku_info_modal} toggle={this.sku_info_toggle}>
        <ModalHeader toggle={this.sku_info_toggle}>{sku.name}</ModalHeader>
        <ModalBody>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Name: </b> {sku.name}
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>SKU#: </b> {sku.number}
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Case UPC#: </b> {sku.case_number}
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Unit UPC#: </b> {sku.unit_number}
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Unit Size: </b> {sku.unit_size}
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Count per case: </b> {sku.count_per_case}
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Product Line: </b> {(sku.product_line && sku.product_line.name) ? (sku.product_line.name):('')}
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Formula: </b> {(sku.formula && sku.formula.name) ? (sku.formula.name):('')}
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Formula Scale Factor: </b> {sku.formula_scale_factor}
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Manufacturing Lines: </b>
              <div>
              {sku.manufacturing_lines && (sku.manufacturing_lines.map(({_id})=>(
                <div key={_id._id}>{_id.shortname}</div>
              )))}
              </div>
          </div>
          <div style={{paddingBottom: '1.5em'}}>
            <b>Manufacturing Rate: </b> {sku.manufacturing_rate}
          </div>
          <div style={{wordBreak:'break-all', paddingBottom: '1.5em'}}>
            <b>Comment: </b> {sku.comment}
          </div>
        </ModalBody>
      </Modal>
    );
  }

  getSortIcon = (field) =>{
    if(this.props.formulas.sortby === field && this.props.formulas.sortdir === 'desc'){
      return <FontAwesomeIcon className='main-green' icon = "sort-down"/>
    }
    else if(this.props.formulas.sortby === field && this.props.formulas.sortdir === 'asc'){
      return <FontAwesomeIcon className='main-green' icon = "sort-up"/>
    }
    else{
      return <FontAwesomeIcon icon = "sort"/>
    }
  }

  sortCol = (field, e) => {
    if(this.props.formulas.sortby === field){
      if(this.props.formulas.sortdir === 'asc'){
        this.props.sortFormulas(field, 'desc', 1, this.props.formulas.pagelimit, this.props.formulas.obj);
      }
      else{
        this.props.sortFormulas(field, 'asc', 1, this.props.formulas.pagelimit, this.props.formulas.obj);
      }
    }
    else{
      this.props.sortFormulas(field, 'asc', 1, this.props.formulas.pagelimit, this.props.formulas.obj);
    }
  }

  render() {
    const {formulas} = this.props.formulas;
    const loading = this.props.formulas.loading;

    if(loading){
      return (
        <div style={{'textAlign':'center'}}>
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
        </div>

      );
    }
    return (
      <div>
        <Table responsive size="sm">
          <thead>
            <tr>
              <th style={{cursor:'pointer'}} onClick={this.sortCol.bind(this, 'name')}>Name{' '}
                {this.getSortIcon('name')}
              </th>
              <th style={{cursor:'pointer'}} onClick={this.sortCol.bind(this, 'number')}>Number{' '}
                {this.getSortIcon('number')}
              </th>
              <th>Ingredients List</th>
              <th>SKUs</th>
              <th>Comment</th>
                {this.props.auth.isAdmin &&
                  <th>Edit</th>
                }
                {this.props.auth.isAdmin &&
                  <th>Delete</th>
                }
            </tr>
          </thead>
          <tbody is="transition-group" >
            <TransitionGroup className="ingredients-table" component={null}>
              {formulas.map(({_id, name, number, comment, ingredients_list }) => (
                <CSSTransition key={_id} timeout={500} classNames="fade">
                  <tr>
                    <td> {name} </td>
                    <td> {number} </td>
                    <td>
                    {
                      ingredients_list.map(({_id, quantity}) => (
                        <div key={_id._id}> {_id.name}, {quantity}</div>
                      ))
                    }
                    </td>
                    <td>
                      <Button size="sm" color="link"
                      onClick={this.onSKUListClick.bind(this, _id)}
                      style={{'color':'black'}}>
                      <FontAwesomeIcon icon="list"/>
                      </Button>
                    </td>
                    <td style={{wordBreak:'break-all'}}> {comment} </td>
                    {this.props.auth.isAdmin &&
                      <td>
                        <Button size="sm" color="link"
                          onClick={this.onEditClick.bind(this,
                            _id, name, number, ingredients_list, comment
                          )}
                          style={{'color':'black'}}>
                          <FontAwesomeIcon icon = "edit"/>
                        </Button>
                      </td> }
                    {this.props.auth.isAdmin &&
                      <td >
                        <Button size="sm" sm="2"color="link"
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
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}> Edit Formula </ModalHeader>
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
                  invalid={this.state.validate.edit_number === 'not-valid-num'}
                  type="text"
                  name="edit_number"
                  id="edit_number"
                  placeholder="Add Formula Number"
                  onChange={this.onChange}
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
                  onChange={this.onChange}
                  defaultValue={this.state.edit_comment}>
                </Input>
            </FormGroup>
              <div><p style={{'fontSize':'0.8em', marginBottom: '0px'}} className={this.allValidated() ? ('hidden'):('')}>There are fields with errors. Please go back and fix these fields to submit.</p>
              <Button color="dark" className={this.allValidated() ?(''): ('disabled')} onClick={this.onEditSubmit} block>
                    Submit Formula Edits
                  </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.sku_modal} toggle={this.sku_toggle}>
          <ModalHeader toggle={this.sku_toggle}>SKUs that use Formula: {this.props.formulas.formula_skus.length}</ModalHeader>
          <ModalBody>
            <ListGroup>
              {this.props.formulas.formula_skus.map((sku) => (
              <ListGroupItem key={sku._id}>
                 <div>
                   {sku.name + ": " + sku.unit_size + " * " + sku.count_per_case + " (SKU#: " + sku.number +")"}
                   <Button size="sm" color="link"
                     onClick={this.onSKUInfoClick.bind(this, sku)}
                     style={{'color':'black'}}>
                     <FontAwesomeIcon icon="info-circle"/>
                   </Button>
                 </div>
               </ListGroupItem>
              ))}
            </ListGroup>
          </ModalBody>
        </Modal>
        {this.skuInfoModal()}
        </div>

    );
  }
}

FormulasEntry.propTypes = {
  sortFormulas: PropTypes.func.isRequired,
  deleteFormula: PropTypes.func.isRequired,
  updateFormula: PropTypes.func.isRequired,
  getFormulaSKUs: PropTypes.func.isRequired,
  formulas: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  formulas: state.formulas,
  auth: state.auth
});

export default connect(mapStateToProps, { sortFormulas, getFormulaSKUs, deleteFormula, updateFormula })(FormulasEntry);
