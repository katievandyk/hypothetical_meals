import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

import GoalsSKUDropdown from '../../components/goals/GoalsSKUDropdown';
import GoalsSKUSearch from '../../components/goals/GoalsSKUSearch';
import GoalsProductLineFilter from '../../components/goals/GoalsProductLineFilter';

import { addGoal, getAllGoals }  from '../../actions/goalsActions';
import { getSKUs } from '../../actions/skuActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Col, Row, Input, FormFeedback,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Table, Form, FormGroup, Label
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class GoalsCreateModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      skulist_modal: false,
      name: '',
      quantity: '',
      skuSel: '',
      skus_list: [],
      date: '',
      validNum: '',
      validName: '',
      validDate: ''
    };

    this.toggle = this.toggle.bind(this);
    this.skulist_toggle = this.skulist_toggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAddSKU = this.onAddSKU.bind(this);
    this.skuCallback = this.skuCallback.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

   componentDidMount() {
       this.props.getSKUs();
       this.props.getAllGoals();
   }

   onSubmit = e => {
     var goals  = this.props.goals.goals
     if(this.state.name.length === 0 || goals.find(elem => elem.name === this.state.name) != null) alert("Please enter a unique name for your goal.")
     else if(this.state.validDate !== 'success') alert("Please enter a valid date.")
     else {
         const newGoal = {
           name: this.state.name,
           skus_list: this.state.skus_list,
           user_username: this.props.auth.user_username,
           deadline: this.state.date
         };
         this.props.addGoal(newGoal);
         this.setState({name: '', quantity: '', skuSel: '',
         skus_list: [],
         date: '',
         validNum: '',
         validName: '',
         validDate: ''});
         this.toggle();
     }
   }

   onAddSKU = e => {
       var skus  = this.state.skus_list
       if(this.state.validNum === 'failure' || this.state.quantity.length === 0) alert("Please enter a valid numeric quantity.")
       else if(this.state.skuSel.length === 0 || skus.find(elem => elem.sku._id === this.state.skuSel._id) != null) alert("Please use a unique SKU.")
       else {
           skus.push({sku: this.state.skuSel, quantity: this.state.quantity});
           this.setState({
               skus_list: skus
           })
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
        var goals  = this.props.goals.all_goals;
        this.setState({ name: e.target.value })
        var valid = '';
        if (e.target.value.length > 0 && goals.find(elem => elem.name === e.target.value) == null) {
          valid = 'success'
        } else if(e.target.value.length > 0){
          valid = 'failure'
        }
        else {
          valid = 'empty'
        }
        this.setState({ validName: valid })
   }

   onDateChange = e => {
        var currentTime = new Date();
        var enteredDate = new Date(e.target.value)
        this.setState({ date: e.target.value })
        var valid = '';
        if (enteredDate >= currentTime) {
          valid = 'success'
        } else {
          valid = 'failure'
        }
        this.setState({ validDate: valid })
   }

   onCancel  = e => {
       this.setState({
           name: '',
           skus_list: []
       })
       this.toggle();
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
    this.setState({
      modal: !this.state.modal
    });
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
        <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader>Create Goal</ModalHeader>
          <ModalBody>
               <Form>
                 <FormGroup>
                     <Label>Manufacturing Goal Name</Label>
                     <Input valid={this.state.validName === 'success'}
                       invalid={this.state.validName === 'failure' || this.state.validName === 'empty'} value={this.state.name}
                       onChange={this.onNameChange}
                       placeholder="Add Manufacturing Goal Name"/>
                     {this.state.validName === 'failure' ? (<FormFeedback>This goal name has already been used (by you or another user)</FormFeedback>):('')}
                 </FormGroup>
                 <FormGroup>
                      <Label>Manufacturing Goal Deadline</Label>
                      <Input valid={this.state.validDate === 'success'} invalid={this.state.validDate === 'failure'} onChange={this.onDateChange} type="date" />
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
                               {this.state.skus_list.map(({sku, quantity}, i) => (
                                   <tr key={sku._id}>
                                      <td> {sku.name}: {sku.unit_size} * {sku.count_per_case} ({sku.number})</td>
                                      <td> {quantity} </td>
                                      <td>
                                        <Button size="sm" color="link"
                                        onClick={this.onDeleteClick.bind(this, this.state.skus_list[i])}
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
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <GoalsSKUDropdown skus_list={this.state.skus_list} skus={this.props.skus} callbackFromParent={this.skuCallback}/>
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

    GoalsCreateModal.propTypes = {
      addGoal: PropTypes.func.isRequired,
      getAllGoals: PropTypes.func.isRequired,
      skus: PropTypes.object.isRequired,
      auth: PropTypes.object.isRequired,
      goals: PropTypes.object.isRequired
    };

    const mapStateToProps = state => ({
      goals: state.goals,
      auth: state.auth,
      skus: state.skus
    });


    export default connect(mapStateToProps, {getSKUs, addGoal, getAllGoals})(GoalsCreateModal);
