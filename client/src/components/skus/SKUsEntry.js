import React from 'react';
import {
  Table, Button, Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
 } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getSKUs, deleteSKU, updateSKU } from '../../actions/skuActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    ing_modal: false
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  /*ing_toggle = () => {
    this.setState({
      ing_modal: !this.state.ing_modal
    });
  }*/

  componentDidMount() {
    this.props.getSKUs();
  }

  onDeleteClick = id => {
    this.props.deleteSKU(id);
  };

  onEditClick = (id, name, number, case_number, unit_number, unit_size, product_line, count_per_case,
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
/**
  onIngListClick = id => {
    this.ing_toggle();
    this.props.getIngSKUs(id);
  };
  **/

  render() {
    const { skus } = this.props.skus;
    const loading = this.props.skus.loading;

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
              <th>Name</th>
              <th>#</th>
              <th>Case #</th>
              <th>Unit #</th>
              <th>Unit Size</th>
              <th>Count/Case</th>
              <th>Product Line</th>
              <th>Ingredients</th>
              <th>Comments</th>
              <th>Edit</th>
              <th>Delete</th>
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
                    <td> {/**{product_line}**/}</td>
                    <td>
                      {/*{ingredients_list}*/}
                    </td>
                    <td> {comment} </td>
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
                    <td >
                      <Button size="sm" color="link"
                        onClick={this.onDeleteClick.bind(this, _id)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="trash"/>
                      </Button>
                    </td>
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
                    type="text"
                    name="edit_package_size"
                    id="edit_package_size"
                    placeholder="Add the Package Size"
                    onChange={this.onChange}
                    defaultValue={this.state.edit_package_size}>
                  </Input>
              </FormGroup>
              <FormGroup>
                <Label for="edit_cost_per_package">Cost per Package</Label>
                  <Input
                    type="text"
                    name="edit_cost_per_package"
                    id="edit_cost_per_package"
                    placeholder="Add the Cost Per Package"
                    onChange={this.onChange}
                    defaultValue={this.state.edit_cost_per_package}>
                  </Input>
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
              <Button color="dark" style={{ marginTop: '2rem' }} type="submit" block>
                    Submit Ingredient Edits
                  </Button>
            </Form>
          </ModalBody>
        </Modal>
        {/*<Modal isOpen={this.state.sku_modal} toggle={this.sku_toggle}>
          <ModalHeader toggle={this.sku_toggle}>SKUs that use Ingredient: {this.props.ing.ing_skus.length}</ModalHeader>
          <ModalBody>
            <ListGroup>
              {this.props.ing.ing_skus.map(({_id, name}) => (
              <ListGroupItem key={_id}> <div>{name}</div> </ListGroupItem>
              ))}
            </ListGroup>
          </ModalBody>
        </Modal>*/}
        </div>

    );
  }
}

SKUsEntry.propTypes = {
  getSKUs: PropTypes.func.isRequired,
  deleteSKU: PropTypes.func.isRequired,
  updateSKU: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  skus: state.skus
});

export default connect(mapStateToProps, { getSKUs, deleteSKU, updateSKU })(SKUsEntry);
