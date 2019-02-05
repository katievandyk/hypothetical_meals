import React from 'react';
import {
  Table, Button, Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem
 } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getIngs, deleteIng, updateIng, getIngSKUs } from '../../actions/ingActions';
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
    sku_modal: false
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
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
    this.setState({
      [e.target.name]: e.target.value
    });
  };

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

    this.props.updateIng(editedIng);
    this.props.getIngs();
    this.toggle();
  };

  onSKUListClick = id => {
    this.sku_toggle();
    this.props.getIngSKUs(id);
  };

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
              <th>Name</th>
              <th>#</th>
              <th>Vendor's Info</th>
              <th>Package Size</th>
              <th>Cost/Package</th>
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
                    <td> {comment} </td>
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
        <Modal isOpen={this.state.sku_modal} toggle={this.sku_toggle}>
          <ModalHeader toggle={this.sku_toggle}>SKUs that use Ingredient: {this.props.ing.ing_skus.length}</ModalHeader>
          <ModalBody>
            <ListGroup>
              {this.props.ing.ing_skus.map(({_id, name}) => (
              <ListGroupItem key={_id}> <div>{name}</div> </ListGroupItem>
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
  deleteIng: PropTypes.func.isRequired,
  updateIng: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ing: state.ing,
  auth: state.auth
});

export default connect(mapStateToProps, { getIngs, deleteIng, updateIng, getIngSKUs })(IngredientsEntry);
