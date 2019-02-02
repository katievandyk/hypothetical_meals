import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css' // TODO change css file
import GoalCreateEntry from '../../components/goals/GoalCreateEntry';
import GoalsSKUDropdown from '../../components/goals/GoalsSKUDropdown';
import GoalsProductLineDropdown from '../../components/goals/GoalsProductLineDropdown';

import { addGoal }  from '../../actions/goalsActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Table, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

class GoalsCreateForm extends React.Component {

   constructor(props) {
       super(props);
       this.onFormSave = this.onFormSave.bind(this);
       this.onAdd = this.onAdd.bind(this);
       this.plineCallback = this.plineCallback.bind(this);
       this.skuCallback = this.skuCallback.bind(this);
       this.state = {
          name: '',
          quantity: '',
          plineSel: '',
          skuSel: '',
          skus_list: []
       };
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


    onFormSave = e => {
       this.props.addGoal({"name": this.state.name, "skus_list": this.state.skus_list, "user_email": this.props.auth.user_email})
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

    plineCallback = (dataFromChild) => {
        this.setState({
             plineSel: dataFromChild
           });
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
        <Row>
                <Col md={4}><GoalsProductLineDropdown callbackFromParent={this.plineCallback}/></Col>
                <Col md={3.5}><GoalsSKUDropdown pline={this.state.plineSel} callbackFromParent={this.skuCallback}/></Col>
                <Col md={4}><Input value={this.state.quantity} placeholder="Qty." onChange={e => this.setState({ quantity: e.target.value })}/> </Col>
                <Col><Button color="success" onClick={this.onAdd}>Add</Button>{' '}</Col>
        </Row>
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
  addGoal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  goals: state.goals,
  auth: state.auth
});


export default connect(mapStateToProps, {addGoal})(GoalsCreateForm);
