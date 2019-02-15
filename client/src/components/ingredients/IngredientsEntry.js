import React from 'react';
import {
  Table, Button, Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup, FormFeedback,
  Label,
  Input,
  ListGroup,
  ListGroupItem
 } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getIngs, sortIngs, deleteIng, updateIng, getIngSKUs } from '../../actions/ingActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles.css'

class IngredientsEntry extends React.Component {
  state = {
    modal: false,
    edit_id: '',
    edit_name: '',
    edit_number: '',
    edit_vendor_info: '',
    edit_package_size: '',
    edit_cost_per_package: '',
    edit_comment: '',
    sku_modal: false,
    validate: {}
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

  componentDidMount() {
    this.props.getIngs();
  }

  onDeleteClick = id => {
    this.props.deleteIng(id);
  };

  onEditClick = (id, name, number, vendor_info,
  package_size, cost_per_package, comment) => {
    this.setState({
      modal: true,
      edit_id: id,
      edit_name: name,
      edit_number: number,
      edit_vendor_info: vendor_info,
      edit_package_size: package_size,
      edit_cost_per_package: cost_per_package,
      edit_comment: comment
    });
  };

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
      if(field_type === 'edit_name' || field_type === 'edit_package_size'){
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
      else if(field_type === 'edit_cost_per_package'){
        const numRex = /^[1-9]\d*(\.\d+)?$/mg
        if (numRex.test(e.target.value)) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid'
        }
      }
    } else if(field_type !== 'edit_comment' && field_type !== 'edit_vendor_info' && field_type !== 'edit_number'){
      validate[e.target.name] = 'is-empty';
    }
    this.setState({ validate });
  }

  onEditSubmit = e => {
    e.preventDefault();

    const editedIng = {
      id: this.state.edit_id,
      name: this.state.edit_name,
      number: this.state.edit_number,
      vendor_info: this.state.edit_vendor_info,
      package_size: this.state.edit_package_size,
      cost_per_package: this.state.edit_cost_per_package,
      comment: this.state.edit_comment
    };

    this.props.updateIng(editedIng, this.props.ing.sortby, this.props.ing.sortdir, this.props.ing.page, this.props.ing.pagelimit, this.props.ing.obj);
    this.toggle();
  };

  onSKUListClick = id => {
    this.sku_toggle();
    this.props.getIngSKUs(id);
  };

  getSortIcon = (field) =>{
    if(this.props.ing.sortby === field && this.props.ing.sortdir === 'desc'){
      return <FontAwesomeIcon className='main-green' icon = "sort-down"/>
    }
    else if(this.props.ing.sortby === field && this.props.ing.sortdir === 'asc'){
      return <FontAwesomeIcon className='main-green' icon = "sort-up"/>
    }
    else{
      return <FontAwesomeIcon icon = "sort"/>
    }
  }

  sortCol = (field, e) => {
    if(this.props.ing.sortby === field){
      if(this.props.ing.sortdir === 'asc'){
        this.props.sortIngs(field, 'desc', 1, this.props.ing.pagelimit, this.props.ing.obj);
      }
      else{
        this.props.sortIngs(field, 'asc', 1, this.props.ing.pagelimit, this.props.ing.obj);
      }
    }
    else{
      this.props.sortIngs(field, 'asc', 1, this.props.ing.pagelimit, this.props.ing.obj);
    }
  }

  render() {
    const { ings } = this.props.ing;
    const loading = this.props.ing.loading;
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
              <th style={{cursor:'pointer'}}
                onClick={this.sortCol.bind(this, 'name')}>
                Name{' '}
                {this.getSortIcon('name')}
              </th>
              <th style={{cursor:'pointer'}}
                onClick={this.sortCol.bind(this, 'number')}>
                Ingr#{' '}
                  {this.getSortIcon('number')}
              </th>
              <th style={{cursor:'pointer'}}
                onClick={this.sortCol.bind(this, 'vendor_info')}>
                Vendor's Info{' '}
                  {this.getSortIcon('vendor_info')}
              </th>
              <th style={{cursor:'pointer'}}
                onClick={this.sortCol.bind(this, 'package_size')}>
                Package Size{' '}
                  {this.getSortIcon('package_size')}
              </th>
              <th style={{cursor:'pointer'}}
                onClick={this.sortCol.bind(this, 'cost_per_package')}>
                Cost/Package{' '}
                  {this.getSortIcon('cost_per_package')}
              </th>
              <th>SKUs</th>
              <th>Comments</th>
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
              {ings.map(({_id, name, number, vendor_info, package_size,
                cost_per_package, comment }) => (
                <CSSTransition key={_id} timeout={500} classNames="fade">
                  <tr>
                    <td> {name} </td>
                    <td> {number} </td>
                    <td> {vendor_info} </td>
                    <td> {package_size} </td>
                    <td> {cost_per_package} </td>
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
                            _id, name, number, vendor_info, package_size,
                            cost_per_package, comment
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
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}> Edit Ingredient </ModalHeader>
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
                    Please input a value.
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
                    placeholder="Add Ingredient Number"
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
                <Label for="edit_vendor_info">Vendor's Info</Label>
                  <Input
                    type="textarea"
                    name="edit_vendor_info"
                    id="edit_vendor_info"
                    placeholder="Add Vendor's Information"
                    onChange={this.onChange}
                    defaultValue={this.state.edit_vendor_info}>
                  </Input>
              </FormGroup>
              <FormGroup>
                <Label for="edit_package_size">Package Size</Label>
                  <Input
                    valid={ this.state.validate.edit_package_size === 'has-success' }
                    invalid={ this.state.validate.edit_package_size === 'is-empty' }
                    type="text"
                    name="edit_package_size"
                    id="edit_package_size"
                    placeholder="Add the Package Size"
                    onChange={this.onChange}
                    defaultValue={this.state.edit_package_size}>
                  </Input>
                  <FormFeedback>
                    Please input a value.
                  </FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="edit_cost_per_package">Cost per Package</Label>
                  <Input
                    valid={this.state.validate.edit_cost_per_package === 'has-success' }
                    invalid={this.state.validate.edit_cost_per_package === 'is-empty' || this.state.validate.edit_cost_per_package === 'not-valid'}
                    type="text"
                    name="edit_cost_per_package"
                    id="edit_cost_per_package"
                    placeholder="Add the Cost Per Package"
                    onChange={this.onChange}
                    defaultValue={this.state.edit_cost_per_package}>
                  </Input>
                  {this.state.validate.edit_cost_per_package === 'is-empty' ? (
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
              <Button color="dark" className={this.allValidated() ? (''):('disabled')} type="submit" block>
                    Submit Ingredient Edits
                  </Button>
                </div>
            </Form>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.sku_modal} toggle={this.sku_toggle}>
          <ModalHeader toggle={this.sku_toggle}>SKUs that use Ingredient: {this.props.ing.ing_skus.length}</ModalHeader>
          <ModalBody>
            <ListGroup>
              {this.props.ing.ing_skus.map(({_id, name, number, unit_size, count_per_case}) => (
              <ListGroupItem key={_id}> <div>{name + ": " + unit_size + " * " + count_per_case + " (SKU#: " + number +")"}</div> </ListGroupItem>
              ))}
            </ListGroup>
          </ModalBody>
        </Modal>
        </div>

    );
  }
}

IngredientsEntry.propTypes = {
  getIngs: PropTypes.func.isRequired,
  sortIngs: PropTypes.func.isRequired,
  deleteIng: PropTypes.func.isRequired,
  updateIng: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ing: state.ing,
  auth: state.auth
});

export default connect(mapStateToProps, { getIngs, sortIngs, deleteIng, updateIng, getIngSKUs })(IngredientsEntry);
