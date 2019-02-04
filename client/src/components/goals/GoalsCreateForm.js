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
  InputGroup, InputGroupAddon, Input, Button,
  Container, Table, Row, Col, Form, FormGroup, Label, FormFeedback
} from 'reactstrap';

class GoalsCreateForm extends React.Component {

   constructor(props) {
       super(props);
       this.onSubmit = this.onSubmit.bind(this);
       this.onAddSKU = this.onAddSKU.bind(this);
       this.skuCallback = this.skuCallback.bind(this);
       this.onNameChange = this.onNameChange.bind(this);
       this.onNumberChange = this.onNumberChange.bind(this);
       this.state = {
          name: '',
          quantity: '',
          skuSel: '',
          skus_list: [],
          validNum: '',
          validName: '',
       };
    }

   componentDidMount() {
       this.props.getSKUs();
   }

   onSubmit = e => {
     if(this.state.name.length === 0) alert("Please enter a name for your goal.")
     else {
         const newGoal = {
           name: this.state.name,
           skus_list: this.state.skus_list,
           user_email: this.props.auth.user_email
         };
         this.props.addGoal(newGoal);
         this.props.toggle();
     }
   }

   onAddSKU = e => {
       const numRex = /^(?!0\d)\d*(\.\d+)?$/mg
       var skus  = this.state.skus_list
       if(this.state.validNum === 'failure' || this.state.quantity.length === 0) alert("Please enter a valid numeric quantity.")
       else if(this.state.skuSel.length === 0 || skus.find(elem => elem.sku._id === this.state.skuSel._id) != null) alert("Please use a unique SKU.")
       else {
           skus.push({sku: this.state.skuSel, quantity: this.state.quantity});
           this.setState({
               skus_list: skus
           })
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
        this.setState({ name: e.target.value })
        var valid = '';
        if (e.target.value.length > 0) {
          valid = 'success'
        } else {
          valid = 'failure'
        }
        this.setState({ validName: valid })
   }

   onCancel  = e => {
       this.setState({
           name: '',
           skus_list: []
       })
       this.props.toggle();
   }

   skuCallback = (dataFromChild) => {
       this.setState({
            skuSel: dataFromChild
          });
   }

   render() {
     return (
       <Form>
         <FormGroup>
             <Label for="goal_name">Manufacturing Goal Name</Label>
             <Input id="goal_name" valid={this.state.validName === 'success'} invalid={this.state.validName === 'failure'} value={this.state.name} onChange={this.onNameChange}/>
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
                       {this.state.skus_list.map(({sku, quantity}) => (
                           <tr key={sku._id}>
                              <td> {sku.name} </td>
                              <td> {quantity} </td>
                           </tr>
                       ))}
                    </tbody>
                  </Table>
         </FormGroup>
         <Container>
            <Row style={{ marginBottom: 6, marginTop: 20 }}>
                <GoalsProductLineFilter/>
                <Col style={{'textAlign': 'right'}}/>
                <GoalsSKUSearch/>
            </Row>
            <Row>
            <InputGroup>
                <GoalsSKUDropdown skus={this.props.skus} callbackFromParent={this.skuCallback}/>
                <Col md={2} style={{"padding-right": 0 }}>
                    <Input valid={this.state.validNum === 'success'} invalid={this.state.validNum === 'failure'} value={this.state.quantity} placeholder="Qty." onChange={this.onNumberChange}/>
                </Col>
                <InputGroupAddon addonType="append"><Button onClick={this.onAddSKU}>+</Button></InputGroupAddon>
            </InputGroup>
            </Row>
         </Container>
         <Container className="my-3">
            <Row>
                 <Col style={{'textAlign': 'right'}}>
                    <Button onClick={this.onSubmit} color="success">Save</Button> &nbsp;
                    <Button color="secondary" onClick={this.onCancel}>Clear</Button>
                 </Col>
             </Row>
         </Container>
       </Form>
    );
  }
}

GoalsCreateForm.propTypes = {
  addGoal: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  goals: state.goals,
  auth: state.auth,
  skus: state.skus
});


export default connect(mapStateToProps, {getSKUs, addGoal})(GoalsCreateForm);
