import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import GoalCreateEntry from '../../components/goals/GoalCreateEntry';
import GoalsSKUDropdown from '../../components/goals/GoalsSKUDropdown';
import GoalsProductLineDropdown from '../../components/goals/GoalsProductLineDropdown';
import GoalsProductLineSearch from '../../components/goals/GoalsProductLineSearch';

import { addGoal }  from '../../actions/goalsActions';
import { getSKUs, getSKUsByPLine } from '../../actions/skuActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Table, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

class GoalsCreateForm extends React.Component {

   constructor(props) {
       super(props);
       this.onAdd = this.onAdd.bind(this);
       this.plineCallback = this.plineCallback.bind(this);
       this.skuCallback = this.skuCallback.bind(this);
       this.state = {
          name: '',
          quantity: '',
          plineSel: [],
          skuSel: '',
          skus_list: []
       };
    }

   componentDidMount() {
       this.props.getSKUs();
   }

   toggle = () => {
     this.setState({
       modal: !this.state.modal
     });
   }

   onSubmit = e => {
         const newGoal = {
           name: this.state.name,
           skus_list: this.state.skus_list,
           user_email: this.props.auth.user_email
         };

         this.props.addGoal(newGoal);
         this.toggle();
   }

   onAdd = e => {
       var skus  = this.state.skus_list
       if(isNaN(this.state.quantity)) alert("Please enter a numeric quantity.")
       else if(skus.find(elem => elem.sku._id === this.state.skuSel._id) != null) alert("Please use a unique SKU.")
       else {
           skus.push({sku: this.state.skuSel, quantity: this.state.quantity});
           this.setState({
               skus_list: skus
           })
       }
   }

   onCancel  = e => {
       this.setState({
           name: '',
           skus_list: []
       })
       this.toggle();
   }

   plineCallback = (plines) => {
           const ids = [];
           plines.forEach(pline => ids.push(pline._id))
           this.props.getSKUsByPLine(ids)
       }

   plineCallback2 = (ids) => {
       this.props.getSKUsByPLine(ids)
   }

   skuCallback = (dataFromChild) => {
       this.setState({
            skuSel: dataFromChild
          });
   }

   render() {
     return (
       <Form onSubmit={this.onSubmit}>
         <FormGroup>
             <Label for="goal_name">Manufacturing Goal Name</Label>
             <Input id="goal_name" value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>
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
             <Row>
                 <GoalsProductLineSearch callbackFromParent={this.plineCallback}/>
                 <Col style={{'textAlign': 'left'}}/>
                 <Col style={{'textAlign': 'right'}}/>
                 <Col><GoalsSKUDropdown skus={this.props.skus} callbackFromParent={this.skuCallback}/></Col>
                 <Col md={2}><Input value={this.state.quantity} placeholder="Qty." onChange={e => this.setState({ quantity: e.target.value })}/> </Col>
                 <Col><Button color="success" onClick={this.onAdd}>Add</Button>{' '}</Col>
             </Row>
              <Row>
                <GoalsProductLineDropdown callbackFromParent={this.plineCallback2}/>
            </Row>
         </Container>
         <Container className="my-3">
            <Row>
                 <Col style={{'textAlign': 'right'}}>
                    <Button type="submit"  color="success">Save</Button> &nbsp;
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
  getSKUsByPLine: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  goals: state.goals,
  auth: state.auth,
  skus: state.skus
});


export default connect(mapStateToProps, {getSKUsByPLine, getSKUs, addGoal})(GoalsCreateForm);

/**
            <Row>
                <GoalsProductLineDropdown callbackFromParent={this.plineCallback}/>
            </Row> **/
