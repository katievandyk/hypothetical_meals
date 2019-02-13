import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

import GoalsSKUDropdown from '../../components/goals/GoalsSKUDropdown';
import GoalsSKUSearch from '../../components/goals/GoalsSKUSearch';
import GoalsProductLineFilter from '../../components/goals/GoalsProductLineFilter';

import { addGoal }  from '../../actions/goalsActions';
import { getSKUs } from '../../actions/skuActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Col, Row, Input,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Table, Form, FormGroup, Label
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class GoalsEditModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skulist_modal: false,
      quantity: '',
      skuSel: '',
      validNum: '',
      validName: '',
    };

    this.toggle = this.toggle.bind(this);
    this.skulist_toggle = this.skulist_toggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAddSKU = this.onAddSKU.bind(this);
    this.skuCallback = this.skuCallback.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onNumberChange = this.onNumberChange.bind(this);
  }

   componentDidMount() {
       this.props.getSKUs();
   }

   onSubmit = e => {
     var goals  = this.props.goals.goals
     if(this.props.name.length === 0 || goals.find(elem => elem.name === this.props.name) != null) alert("Please enter a unique name for your goal.")
     else {
         const newGoal = {
           name: this.props.name,
           skus_list: this.props.skus_list,
           user_email: this.props.auth.user_email
         };
         this.props.addGoal(newGoal);
         this.toggle();
     }
   }

   onAddSKU = e => {
       var skus  = this.props.skus_list
       if(this.state.validNum === 'failure' || this.state.quantity.length === 0) alert("Please enter a valid numeric quantity.")
       else if(this.state.skuSel.length === 0 || skus.find(elem => elem.sku._id === this.state.skuSel._id) != null) alert("Please use a unique SKU.")
       else {
           skus.push({sku: this.state.skuSel, quantity: this.state.quantity});
           this.props.skus_list = skus
           this.skulist_toggle()
       }
   }

   onNumberChange = e => {
        this.setState({ quantity: e.target.value })
        const numRex = /^(?!0\d)\d*(\.\d+)?$/mg
        var valid = '';
        if (numRex.test(e.target.value) && e.target.value.length > 0) {
          valid = 'success'
        } else {
          valid = 'failure'
        }
        this.setState({ validNum: valid })
   }

   onNameChange = e => {
        var goals  = this.props.goals.goals
        this.setState({ name: e.target.value })
        var valid = '';
        if (e.target.value.length > 0 && goals.find(elem => elem.name === e.target.value) == null) {
          valid = 'success'
        } else {
          valid = 'failure'
        }
        this.setState({ validName: valid })
   }

   onCancel  = e => {
       this.props.name = ''
       this.props.skus_list = ''
       this.props.toggle();
   }

   skuCallback = (dataFromChild) => {
       this.setState({
            skuSel: dataFromChild
          });
   }

  onDeleteClick = sku => {
       var skus  = this.state.skus_list
       skus.splice(skus.indexOf(sku), 1)
       this.setState({
            skus_list: skus
          });
   }

  toggle() {
    this.props.modal = !this.props.modal
  }

  skulist_toggle() {
     this.setState({
       skulist_modal: !this.state.skulist_modal,
       quantity: '',
       validNum: ''
     });
  }

  render() {
    return (
      <div>
        <Button onClick={this.toggle} color="success" style={{'display': 'inline-block'}}>{this.props.buttonLabel}</Button>
        <Modal size="lg" isOpen={this.props.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader>Create Goal</ModalHeader>
          <ModalBody>
               <Form>
                 <FormGroup>
                     <Label for="goal_name">Manufacturing Goal Name</Label>
                     <Input id="goal_name" valid={this.state.validName === 'success'} invalid={this.state.validName === 'failure'} value={this.props.name} onChange={this.onNameChange}/>
                 </FormGroup>
                 <Label>Create SKU List</Label>
                 <FormGroup>
                          <Table>
                            <thead>
                              <tr>
                                <th>SKU</th>
                                <th>Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                               {this.props.skus_list.map(({sku, quantity}) => (
                                   <tr key={sku._id}>
                                      <td> {sku.name}: {sku.unit_size} * {sku.count_per_case} </td>
                                      <td> {quantity} </td>
                                      <td>
                                        <Button size="sm" color="link"
                                        onClick={this.onDeleteClick.bind(this, sku)}
                                        style={{'color':'black'}}>
                                        <FontAwesomeIcon style={{verticalAlign:'bottom'}} icon = "times"/>
                                        </Button>
                                      </td>
                                   </tr>
                               ))}
                            </tbody>
                          </Table>
                 </FormGroup>
                 <FormGroup>
                    <Col style={{'textAlign':'center'}}>
                        <Button onClick={this.skulist_toggle}>Add SKU, Quantity Tuple </Button>
                    </Col>
                 </FormGroup>
               </Form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.onSubmit} color="success">Save</Button> &nbsp;
            <Button color="secondary" onClick={this.onCancel}>Clear</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.skulist_modal} size="lg">
             <ModalHeader>Add a SKU, Quantity Tuple</ModalHeader>
               <ModalBody>
                <Form>
                    <FormGroup>
                        <Label><h5>1. Select a SKU.</h5></Label>
                        <Row>
                            <Col md={6}><GoalsProductLineFilter/></Col>
                            <Col style={{'textAlign': 'right'}}/>
                            <Col md={4}> <GoalsSKUSearch/> </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <GoalsSKUDropdown skus_list={this.props.skus_list} skus={this.props.skus} callbackFromParent={this.skuCallback}/>
                    </FormGroup>
                    <FormGroup>
                        <Label><h5>2. Select a quantity.</h5></Label>
                        <Input valid={this.state.validNum === 'success'} invalid={this.state.validNum === 'failure'} value={this.state.quantity} placeholder="Qty." onChange={this.onNumberChange}/>
                    </FormGroup>
                </Form>
             </ModalBody>
             <ModalFooter>
                <Button onClick={this.onAddSKU}>Save</Button>
                <Button onClick={this.skulist_toggle}>Cancel</Button>
             </ModalFooter>
        </Modal>
      </div>
    );
  }
  }

    GoalsEditModal.propTypes = {
      addGoal: PropTypes.func.isRequired,
      skus: PropTypes.object.isRequired,
      auth: PropTypes.object.auth,
      goals: PropTypes.object.isRequired
    };

    const mapStateToProps = state => ({
      goals: state.goals,
      auth: state.auth,
      skus: state.skus
    });


    export default connect(mapStateToProps, {getSKUs, addGoal})(GoalsEditModal);
