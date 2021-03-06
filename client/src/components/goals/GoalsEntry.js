import React from 'react';
import {  Col, Row, Input,
          Modal, ModalHeader, ModalBody, ModalFooter,
          Button, Table, Form, FormGroup, FormFeedback, Label,
          Tooltip, CustomInput } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CalculatorEntry from './CalculatorEntry';
import CalculatorExport from './CalculatorExport';
import GoalsSKUDropdown from '../../components/goals/GoalsSKUDropdown';
import GoalsProductLineFilter from '../../components/goals/GoalsProductLineFilter';
import SKUProjectionModal from '../../components/goals/SKUProjectionModal';

import 'jspdf-autotable';
import * as jsPDF from 'jspdf';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGoals, getAllGoals, updateGoal, enableGoal, sortGoals, getGoalsIngQuantity, deleteGoal } from '../../actions/goalsActions';
import { getSKUs } from '../../actions/skuActions';
import moment from 'moment';

class GoalsEntry extends React.Component {
    constructor(props) {
      super(props);
      this.exportPDF = this.exportPDF.bind(this);
      this.skuproj_toggle = this.skuproj_toggle.bind(this);
      this.tooltip_toggle = this.tooltip_toggle.bind(this);
      this.state = {
        sku_modal: false,
        calculator_modal: false,
        skuproj_modal: false,
        tooltipOpen: false,
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
    this.props.sortGoals('name', 'asc');
    this.props.getAllGoals();
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
           skus = [...skus, {sku: this.state.skuSel, quantity: this.state.quantity}];
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
        var goals  = this.props.goals.all_goals
        this.setState({ edit_name: e.target.value })
        var valid = '';
        if (e.target.value.length > 0 && goals.find(elem => elem.name === e.target.value && elem._id !== this.state.edit_id) == null) {
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
       skus = skus.filter(function(sku_in_skus){return sku_in_skus !== sku});
       this.setState({
            edit_skus_list: skus
          });
   }

  edit_submit = () => {
    var goals  = this.props.goals.goals
    if(this.state.edit_name.length === 0 || goals.find(elem => ((elem.name === this.state.edit_name) && (elem._id !== this.state.edit_id))) != null) alert("Please enter a unique name for your goal.")
    else if(this.state.validDate !== 'success') alert("Please enter a valid date.")
    else {
        const goal = goals.find(goal => goal._id === this.state.edit_id)
        const editedGoal = {
          id: this.state.edit_id,
          name: this.state.edit_name,
          skus_list: this.state.edit_skus_list,
          deadline: this.state.edit_date,
          enabled: goal.enabled,
          user_id: goal.user_id
        };
        this.props.updateGoal(editedGoal, this.props.goals.sortby, this.props.goals.sortdir);
        this.setState({name: '', quantity: '', skuSel: '',
        skus_list: [],
        date: '',
        validNum: '',
        validName: '',
        validDate: ''});
        this.edit_toggle();
    }
  }

  skulist_toggle = () => {
     this.setState({
       skulist_modal: !this.state.skulist_modal,
       quantity: '',
       validNum: ''
     });
  }

  skuproj_toggle() {
     this.setState({
       skuproj_modal: !this.state.skuproj_modal,
     });
  }

  tooltip_toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  copyQuantity = (quant) => {
    this.setState({
        quantity: parseInt(quant),
        validNum: 'success'
    })
  }

  getSortIcon = (field) =>{
    if(this.props.goals.sortby === field && this.props.goals.sortdir === 'desc'){
      return <FontAwesomeIcon className='main-green' icon = "sort-down"/>
    }
    else if(this.props.goals.sortby === field && this.props.goals.sortdir === 'asc'){
      return <FontAwesomeIcon className='main-green' icon = "sort-up"/>
    }
    else{
      return <FontAwesomeIcon icon = "sort"/>
    }
  }

  sortCol = (field, e) => {
    if(this.props.goals.sortby === field){
      if(this.props.goals.sortdir === 'asc'){
        this.props.sortGoals(field, 'desc');
      }
      else{
        this.props.sortGoals(field, 'asc');
      }
    }
    else{
      this.props.sortGoals(field, 'asc');
    }
  }

  render() {
    const { goals } = this.props.goals;
    console.log(goals);
    return (
        <div>
            <Table>
              <thead>
                <tr>
                  <th onClick={this.sortCol.bind(this, 'name')}>Name {this.getSortIcon('name')}</th>
                  <th onClick={this.sortCol.bind(this, 'user')}>Author {this.getSortIcon('user')}</th>
                  <th onClick={this.sortCol.bind(this, 'edit_timestamp')}>Timestamp of Last Edit {this.getSortIcon('edit_timestamp')}</th>
                  <th>Deadline</th>
                  <th>SKU List</th>
                  {(this.props.auth.isAdmin || this.props.auth.user.business) &&
                  <div>
                      <th>Enable</th>
                      <th>Edit</th>
                      <th>Delete</th>
                  </div>
                  }
                </tr>
              </thead>
              <tbody>
                {goals.map((goal) => (
                    <tr key={goal._id}>
                      <td>
                        <Button color="link"
                        onClick={this.calculator_clicked.bind(this, goal._id)}
                        >
                        {goal.name}
                        </Button>
                      </td>
                      <td>
                        {goal.user_id ? (goal.user_id.name):('deleted user')}
                      </td>
                      <td>
                        {moment(new Date(goal.edit_timestamp)).format('llll')}
                      </td>
                      <td>
                        {moment(new Date(goal.deadline)).utc().format('ddd, DD MMM YYYY')}
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={this.sku_clicked.bind(this, goal.skus_list, goal._id)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="list"/>
                        </Button>
                      </td>
                      {(this.props.auth.isAdmin || this.props.auth.user.business) && <div>
                       <td>
                        <CustomInput id={"enable_" + goal._id} type="switch" onClick={() => {
                        goal.enabled = !goal.enabled
                        this.props.enableGoal(goal)}} checked={goal.enabled}/>
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={e => this.onEditClick(goal._id, goal.name, goal.deadline, goal.skus_list)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="edit"/>
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={this.onDeleteClick.bind(this, goal._id)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="trash"/>
                        </Button>
                      </td>
                      </div>}
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
                                <td> {sku.name}: {sku.unit_size} * {sku.count_per_case} ({sku.number})</td>
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
                     <Input id="goal_name" valid={this.state.validName === 'success'} invalid={this.state.validName === 'failure' || this.state.validName === 'empty'} value={this.state.edit_name} onChange={this.onNameChange}/>
                     {this.state.validName === 'failure' ? (<FormFeedback>This goal name has already been used (by you or another user)</FormFeedback>):('')}
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
                               {this.state.edit_skus_list.map(({sku, quantity}, i) => (
                                   <tr key={sku._id}>
                                      <td> {sku.name}: {sku.unit_size} * {sku.count_per_case} ({sku.number}) </td>
                                      <td> {quantity} </td>
                                      <td>
                                        <Button size="sm" color="link"
                                        onClick={this.onDeleteClickSKU.bind(this, this.state.edit_skus_list[i])}
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
                        <Row>
                        <Col md={6} style={{'paddingRight': '0em'}}><Input valid={this.state.validNum === 'success'} invalid={this.state.validNum === 'failure'} value={this.state.quantity} placeholder="Qty." onChange={this.onNumberChange}/></Col>
                        <Col>
                            <Button disabled={this.state.skuSel.length === 0} id="toolButton" color="success" onClick={this.skuproj_toggle}><FontAwesomeIcon style={{verticalAlign:'bottom'}} icon = "chart-line"/></Button>
                            <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="toolButton" toggle={this.tooltip_toggle}>SKU Projection Tool</Tooltip>
                        </Col>
                        </Row>
                    </FormGroup>
                </Form>
             </ModalBody>
             <ModalFooter>
                <Button disabled={this.state.validNum === 'failure' || this.state.sku_valid !== 'success'} onClick={this.onAddSKU}>Save</Button>
              <Button onClick={this.skulist_toggle}>Cancel</Button>
             </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.skuproj_modal} size="lg" toggle={this.skuproj_toggle} >
            <SKUProjectionModal copyQuantity={this.copyQuantity} toggle={this.skuproj_toggle} sku={this.state.skuSel}/>
        </Modal>
       </div>

    );
  }
}

GoalsEntry.propTypes = {
  getAllGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  skus: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getGoalsIngQuantity: PropTypes.func.isRequired,
  deleteGoal: PropTypes.func.isRequired,
  updateGoal: PropTypes.func.isRequired,
  sortGoals: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  goals: state.goals,
  auth: state.auth,
  skus: state.skus
});

export default connect(mapStateToProps, { getSKUs, getAllGoals, updateGoal, enableGoal, deleteGoal, sortGoals, getGoalsIngQuantity })(GoalsEntry);
