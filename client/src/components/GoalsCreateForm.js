import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css' // TODO change css file
import GoalCreateEntry from '../components/GoalCreateEntry';
import GoalsSKUDropdown from '../components/GoalsSKUDropdown';
import GoalsProductLineDropdown from '../components/GoalsProductLineDropdown';

import { addGoal }  from '../actions/goalsActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Table, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

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

      onSubmit = e => {

        const newGoal = {
          name: this.state.name,
          skus_list: this.state.skus_list
        };

        this.props.addGoal(newGoal);
        this.toggle();
      }


    onFormSave() {
        this.props.addGoal({"name": this.state.name, "skus_list": this.state.skus_list})
    }

    onAdd() {
        var skus  = this.state.skus_list
        skus.push({sku: this.state.skuSel, quantity: this.state.quantity});
        this.setState({
            skus_list: skus
        })
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
        <Row>
                 <Table>
                   <thead>
                     <tr>
                       <th>SKU</th>
                       <th>Quantity</th>
                     </tr>
                   </thead>
                   <tbody>
                      {this.state.skus_list.map(({sku, quantity}) => (
                          <tr>
                             <th> {sku.name} </th>
                             <th> {quantity} </th>
                          </tr>
                      ))}
                   </tbody>
                 </Table>
        </Row>
        <Row form className="my-3">
                <Col md={3.5}><GoalsProductLineDropdown callbackFromParent={this.plineCallback}/></Col>
                <Col md={2.5}><GoalsSKUDropdown pline={this.state.plineSel} callbackFromParent={this.skuCallback}/></Col>
                <Col md={2}><Input value={this.state.quantity} placeholder="Qty." onChange={e => this.setState({ quantity: e.target.value })}/> </Col>
                <Col><Button color="primary" onClick={this.onAdd}>Add</Button>{' '}</Col>
        </Row>
        <Button type="submit" color="primary">Save</Button>{' '}
        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
      </Form>
    );
  }
}

GoalsCreateForm.propTypes = {
  addGoal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  goals: state.goals
});


export default connect(mapStateToProps, {addGoal})(GoalsCreateForm);
