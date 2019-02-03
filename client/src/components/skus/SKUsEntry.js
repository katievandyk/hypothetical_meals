import React from 'react';
import {
  Table, Button, Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input, ListGroup, ListGroupItem
 } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getSKUs, deleteSKU, updateSKU } from '../../actions/skuActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SKUsFormPLineSelection from './SKUsFormPLineSelection'
import SKUsFormIngTupleSelection from './SKUsFormIngTupleSelection'
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
    edit_ingredients_list: [],
    edit_comment: '',
    ing_modal: false,
    ing_tuples: [],
    group_by_pl: false
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  ing_toggle = () => {
    this.setState({
      ing_modal: !this.state.ing_modal
    });
  }

  componentDidMount() {
    this.props.getSKUs();
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
  ingredients_list, comment) => {
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
      edit_ingredients_list: ingredients_list,
      edit_comment: comment
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

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
      ingredients_list: this.state.edit_ingredients_list,
      comment: this.state.edit_comment
    };
    this.props.updateSKU(editedSKU);
    this.props.getSKUs();
    this.toggle();
  };

  onIngListClick = ingredients_list => {
    var newIngTuples = [];
    for(var i = 0; i < ingredients_list.length; i++){
      if(ingredients_list[i]._id){
        newIngTuples = [...newIngTuples, ingredients_list[i]];
      }
    }
    this.setState({
      ing_tuples: newIngTuples
    });
    this.ing_toggle();
  };

  onProductLineChange = (prod_line) => {
    this.setState({
      edit_product_line: prod_line
    });
  };

  onIngListChange = (ing_list) => {
    this.setState({
      edit_ingredients_list: ing_list
    });
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
                  <th>Name</th>
                  <th>#</th>
                  <th>Case UPC#</th>
                  <th>Unit UPC#</th>
                  <th>Unit Size</th>
                  <th>Count/Case</th>
                  <th>Product Line</th>
                  <th>Ingredients</th>
                  <th>Comments</th>
                  {this.props.auth.isAdmin && <th>Edit</th>}
                  {this.props.auth.isAdmin && <th>Delete</th>}
                </tr>
              </thead>
              <tbody is="transition-group" >
                <TransitionGroup className="ingredients-table" component={null}>
                  {value.map(({_id, name, number, case_number, unit_number, unit_size,
                    count_per_case, product_line, ingredients_list, comment }) => (
                    <CSSTransition key={_id} timeout={500} classNames="fade">
                      <tr>
                        <td> {name} </td>
                        <td> {number} </td>
                        <td> {case_number} </td>
                        <td> {unit_number} </td>
                        <td> {unit_size} </td>
                        <td> {count_per_case}</td>
                        <td> {product_line.name}</td>
                        <td>
                          <Button size="sm" color="link"
                          onClick={this.onIngListClick.bind(this, ingredients_list)}
                          style={{'color':'black'}}>
                          <FontAwesomeIcon icon="list"/>
                          </Button>
                        </td>
                        <td> {comment} </td>
                        {this.props.auth.isAdmin &&
                          <td>
                            <Button size="sm" color="link"
                              onClick={this.onEditClick.bind(this,
                                _id, name, number, case_number, unit_number, unit_size,
                                  count_per_case, product_line, ingredients_list, comment
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
                <th>Name</th>
                <th>#</th>
                <th>Case UPC#</th>
                <th>Unit UPC#</th>
                <th>Unit Size</th>
                <th>Count/Case</th>
                <th>Product Line</th>
                <th>Ingredients</th>
                <th>Comments</th>
                {this.props.auth.isAdmin && <th>Edit</th> }
                {this.props.auth.isAdmin && <th>Delete</th>}
              </tr>
            </thead>
            <tbody is="transition-group" >
              <TransitionGroup className="ingredients-table" component={null}>
                {skus.map(({_id, name, number, case_number, unit_number, unit_size,
                  count_per_case, product_line, ingredients_list, comment }) => (
                  <CSSTransition key={_id} timeout={500} classNames="fade">
                    <tr>
                      <td> {name} </td>
                      <td> {number} </td>
                      <td> {case_number} </td>
                      <td> {unit_number} </td>
                      <td> {unit_size} </td>
                      <td> {count_per_case}</td>
                      <td> {product_line.name}</td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={this.onIngListClick.bind(this, ingredients_list)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="list"/>
                        </Button>
                      </td>
                      <td> {comment} </td>
                      {this.props.auth.isAdmin &&
                        <td>
                          <Button size="sm" color="link"
                            onClick={this.onEditClick.bind(this,
                              _id, name, number, case_number, unit_number, unit_size,
                                count_per_case, product_line, ingredients_list, comment
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
                      type="text"
                      name="edit_name"
                      id="edit_name"
                      onChange={this.onChange}
                      defaultValue={this.state.edit_name}>
                    </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="edit_number">Number</Label>
                    <Input
                      type="text"
                      name="edit_number"
                      id="edit_number"
                      placeholder="Add Ingredient Number"
                      onChange={this.onChange}
                      defaultValue={this.state.edit_number}>
                    </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="edit_case_number">Case UPC#</Label>
                    <Input
                      type="textarea"
                      name="edit_case_number"
                      id="edit_case_number"
                      placeholder="Add Case UPC#"
                      onChange={this.onChange}
                      defaultValue={this.state.edit_case_number}>
                    </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="edit_unit_number">Unit UPC#</Label>
                    <Input
                      type="text"
                      name="edit_unit_number"
                      id="edit_unit_number"
                      placeholder="Add the Unit UPC#"
                      onChange={this.onChange}
                      defaultValue={this.state.edit_unit_number}>
                    </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="edit_unit_size">Unit Size</Label>
                    <Input
                      type="text"
                      name="edit_unit_size"
                      id="edit_unit_size"
                      placeholder="Add the Unit Size"
                      onChange={this.onChange}
                      defaultValue={this.state.edit_unit_size}>
                    </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="edit_count_per_case">Count per Case</Label>
                    <Input
                      type="text"
                      name="edit_count_per_case"
                      id="edit_count_per_case"
                      placeholder="Add the Count per Case"
                      onChange={this.onChange}
                      defaultValue={this.state.edit_count_per_case}>
                    </Input>
                </FormGroup>
                <SKUsFormPLineSelection onProductLineChange={this.onProductLineChange} defaultValue={this.state.edit_product_line}/>
                <SKUsFormIngTupleSelection onIngListChange={this.onIngListChange} defaultValue={this.state.edit_ingredients_list}/>
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
                <Button color="dark" style={{ marginTop: '2rem' }} type="submit" block>
                      Submit SKU Edits
                    </Button>
              </Form>
            </ModalBody>
          </Modal>
          {<Modal isOpen={this.state.ing_modal} toggle={this.ing_toggle}>
            <ModalHeader toggle={this.ing_toggle}>Ingredients in this SKU:</ModalHeader>
            <ModalBody>
              <ListGroup>
                {this.state.ing_tuples.map(({_id, quantity}) => (
                <ListGroupItem key={_id._id}> <div>{_id.name}, Quantity: {quantity}</div> </ListGroupItem>
                ))}
              </ListGroup>
            </ModalBody>
          </Modal>}
          </div>

      );
    }
  }
}

SKUsEntry.propTypes = {
  getSKUs: PropTypes.func.isRequired,
  deleteSKU: PropTypes.func.isRequired,
  updateSKU: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  skus: state.skus,
  auth: state.auth
});

export default connect(mapStateToProps, { getSKUs, deleteSKU, updateSKU })(SKUsEntry);
