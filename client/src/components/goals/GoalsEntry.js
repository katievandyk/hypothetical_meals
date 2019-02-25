import React from 'react';
import {  Col, Row, Input,
          Modal, ModalHeader, ModalBody, ModalFooter,
          Button, Table, Form, FormGroup, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CalculatorEntry from './CalculatorEntry';
import CalculatorExport from './CalculatorExport';
import GoalsSKUDropdown from '../../components/goals/GoalsSKUDropdown';
import GoalsProductLineFilter from '../../components/goals/GoalsProductLineFilter';

import 'jspdf-autotable';
import * as jsPDF from 'jspdf';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGoals, updateGoal, getGoalsIngQuantity, deleteGoal } from '../../actions/goalsActions';
import { getSKUs } from '../../actions/skuActions';

class GoalsEntry extends React.Component {
    constructor(props) {
      super(props);
      this.exportPDF = this.exportPDF.bind(this);
      this.state = {
        sku_modal: false,
        calculator_modal: false,
        curr_list: [],
        curr_goal: {},
        edit_modal: false,
        edit_id: '',
        edit_name: '',
        edit_date: '',
        edit_skus_list: [],
        skulist_modal: false,
        quantity: '',
        skuSel: '',
        validNum: '',
        validName: '',
        validDate: '',
        sku_valid: ''
      };
    }

  componentDidMount() {
    this.props.getGoals(this.props.auth.user_username);
    this.props.getSKUs();
  }

  sku_toggle = () => {
      this.setState({
        sku_modal: !this.state.sku_modal,
      });
  }

  edit_toggle = () => {
      this.setState({
        edit_modal: !this.state.edit_modal,
      });
  }

  calculator_toggle = () => {
      this.setState({
        calculator_modal: !this.state.calculator_modal,
         });
     }

   exportPDF = () => {
     const input = document.getElementById("toPDF")
     var doc = new jsPDF('l', 'pt');
     doc.text(20, 40, this.state.curr_goal.name);
     var res = doc.autoTableHtmlToJson(input);
     doc.autoTable(res.columns, res.data, { margin: { top: 50, left: 20, right: 20, bottom: 0 }});
     doc.save(this.state.curr_goal.name + '_calculator.pdf'); //Download the rendered PDF.
   }

  sku_clicked = (list, goal_id) => {
      const {goals} = this.props.goals
      const selGoal = goals.find(g => g._id === goal_id )
      this.setState({
        curr_list: list,
        curr_goal: selGoal
      });
      this.sku_toggle();
  }

  calculator_clicked = goal_id => {
    const {goals} = this.props.goals
    const selGoal = goals.find(g => g._id === goal_id )
    this.setState({
        curr_goal : selGoal
    })
    this.props.getGoalsIngQuantity(goal_id);
    this.calculator_toggle();
   }

  onDeleteClick = goal_id => {
    this.props.deleteGoal(goal_id);
   }

  onEditClick = (_id, name, date, skus_list) => {
    this.setState({
      edit_id: _id,
      edit_modal: true,
      edit_name: name,
      edit_date: date.split('T')[0],
      edit_skus_list: skus_list,
      validDate: 'success',
      validName: 'success'
    });
  };

   onAddSKU = e => {
       var skus  = this.state.edit_skus_list;
       if(this.state.validNum === 'failure' || this.state.quantity.length === 0) alert("Please enter a valid numeric quantity.")
       else if(this.state.skuSel.length === 0 || skus.find(elem => elem.sku._id === this.state.skuSel._id) != null) alert("Please use a unique SKU.")
       else {
           skus.push({sku: this.state.skuSel, quantity: this.state.quantity});
           this.setState({ edit_skus_list: skus, sku_valid: '' });
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
        this.setState({ edit_name: e.target.value })
        var valid = '';
        if (e.target.value.length > 0 && goals.find(elem => elem.name === e.target.value && elem._id !== this.state.edit_id) == null) {
          valid = 'success'
        } else {
          valid = 'failure'
        }
        this.setState({ validName: valid })
   }

   onDateChange = e => {
        var currentTime = new Date();
        var enteredDate = new Date(e.target.value)
        this.setState({ edit_date: e.target.value })
        var valid = '';
        if (enteredDate >= currentTime) {
          valid = 'success'
        } else {
          valid = 'failure'
        }
        this.setState({ validDate: valid })
   }

   skuCallback = (dataFromChild) => {
       this.setState({
            skuSel: dataFromChild,
            sku_valid: 'success'
          });
   }

  onDeleteClickSKU = sku => {
       var skus  = this.state.edit_skus_list;
       skus.splice(skus.indexOf(sku), 1)
       this.setState({
            edit_skus_list: skus
          });
   }

  edit_submit = () => {
    const editedGoal = {
      id: this.state.edit_id,
      name: this.state.edit_name,
      deadline: this.state.edit_date,
      skus_list: this.state.edit_skus_list,
    };

    this.props.updateGoal(editedGoal, this.props.auth.user_username);
    this.edit_toggle();
  }

  skulist_toggle = () => {
     this.setState({
       skulist_modal: !this.state.skulist_modal,
       quantity: '',
       validNum: ''
     });
  }

  render() {
    const { goals } = this.props.goals;
    return (
        <div>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Deadline</th>
                  <th>SKU List</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {goals.map(({ _id, name, deadline, skus_list}) => (
                    <tr key={_id}>
                      <td>
                        <Button color="link"
                        onClick={this.calculator_clicked.bind(this, _id)}
                        style={{'color':'black'}}>
                        {name}
                        </Button>
                      </td>
                      <td>
                        {new Date(deadline).toUTCString().split(" 0")[0]}
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={this.sku_clicked.bind(this, skus_list, _id)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="list"/>
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={e => this.onEditClick(_id, name, deadline, skus_list)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="edit"/>
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={this.onDeleteClick.bind(this, _id)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="trash"/>
                        </Button>
                      </td>
                    </tr>
              ))}
              </tbody>
            </Table>
             <Modal isOpen={this.state.sku_modal} toggle={this.sku_toggle} size="lg">
                      <ModalHeader toggle={this.sku_toggle}>SKU List for {this.state.curr_goal.name}</ModalHeader>
                      <ModalBody>
                        <Table>
                          <thead>
                            <tr>
                              <th>SKU</th>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                        {this.state.curr_list.map(({_id, sku, quantity}) => (
                            <tr key={_id}>
                                <td> {sku.name}: {sku.unit_size} * {sku.count_per_case}</td>
                                <td> {quantity} </td>
                            </tr>
                          ))}
                          </tbody>
                        </Table>
                      </ModalBody>
           </Modal>
           <Modal isOpen={this.state.calculator_modal} toggle={this.calculator_toggle} size="lg">
                      <ModalHeader toggle={this.calculator_toggle}> Calculator Results for {this.state.curr_goal.name}</ModalHeader>
                      <ModalBody>
                          <CalculatorEntry ingredients={this.props.goals.ing_quantities}/>
                      </ModalBody>
                      <ModalFooter>
                          <CalculatorExport goal={this.state.curr_goal}/> &nbsp;
                          <Button disabled={this.state.disableExport} color="success" onClick={this.exportPDF}>PDF</Button>
                      </ModalFooter>
           </Modal>
        <Modal size="lg" isOpen={this.state.edit_modal} toggle={this.edit_toggle}>
          <ModalHeader>Edit Goal</ModalHeader>
          <ModalBody>
               <Form>
                 <FormGroup>
                     <Label for="goal_name">Edit Manufacturing Goal Name</Label>
                     <Input id="goal_name" valid={this.state.validName === 'success'} invalid={this.state.validName === 'failure'} value={this.state.edit_name} onChange={this.onNameChange}/>
                 </FormGroup>
                 <FormGroup>
                      <Label>Edit Manufacturing Goal Deadline</Label>
                      <Input valid={this.state.validDate === 'success'} invalid={this.state.validDate === 'failure'} value={this.state.edit_date} onChange={this.onDateChange} type="date" />
                 </FormGroup>
                 <Label>Edit SKU List</Label>
                 <FormGroup>
                          <Table>
                            <thead>
                              <tr>
                                <th>SKU</th>
                                <th>Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                               {this.state.edit_skus_list.map(({sku, quantity}) => (
                                   <tr key={sku._id}>
                                      <td> {sku.name}: {sku.unit_size} * {sku.count_per_case} </td>
                                      <td> {quantity} </td>
                                      <td>
                                        <Button size="sm" color="link"
                                        onClick={this.onDeleteClickSKU.bind(this, sku)}
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
            <Button onClick={this.edit_submit} color="success">Save</Button> &nbsp;
            <Button color="secondary" onClick={this.edit_toggle}>Clear</Button>
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
                        <GoalsSKUDropdown skus_list={this.state.edit_skus_list} skus={this.props.skus} callbackFromParent={this.skuCallback}/>
                    </FormGroup>
                    <FormGroup>
                        <Label><h5>2. Select a quantity.</h5></Label>
                        <Input valid={this.state.validNum === 'success'} invalid={this.state.validNum === 'failure'} value={this.state.quantity} placeholder="Qty." onChange={this.onNumberChange}/>
                    </FormGroup>
                </Form>
             </ModalBody>
             <ModalFooter>
                <Button disabled={this.state.validNum === 'failure' || this.state.sku_valid !== 'success'} onClick={this.onAddSKU}>Save</Button>
              <Button onClick={this.skulist_toggle}>Cancel</Button>
             </ModalFooter>
        </Modal>
       </div>

    );
  }
}

GoalsEntry.propTypes = {
  getGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  skus: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getGoalsIngQuantity: PropTypes.func.isRequired,
  deleteGoal: PropTypes.func.isRequired,
  updateGoal: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  goals: state.goals,
  auth: state.auth,
  skus: state.skus
});

export default connect(mapStateToProps, { getSKUs, getGoals, updateGoal, deleteGoal, getGoalsIngQuantity })(GoalsEntry);
