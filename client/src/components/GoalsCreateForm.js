import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css' // TODO change css file
import GoalCreateEntry from '../components/GoalCreateEntry';
import GoalsSKUDropdown from '../components/GoalsSKUDropdown';
import GoalsProductLineDropdown from '../components/GoalsProductLineDropdown';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

class GoalsCreateForm extends React.Component {

   constructor() {
       super();
       this.onFormSave = this.onFormSave.bind(this);
        this.state = {
          name: ''
        };
    }

    onFormSave() {
        alert(JSON.stringify(this.state, null, ''));
    }

  render() {
    return (
      <Form onSubmit={this.onFormSave}>
        <FormGroup>
            <Label for="goal_name">Manufacturing Goal Name</Label>
            <Input id="goal_name" value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>
        </FormGroup>
        <Row>
            <Col> <GoalCreateEntry/> </Col>
        </Row>
        <Row form className="my-3">
                <Col md={3.5}><GoalsProductLineDropdown/></Col>
                <Col md={2.5}><GoalsSKUDropdown/></Col>
                <Col md={2}><Input id="goal_name" placeholder="Qty."/> </Col>
                <Col><Button color="primary">Add</Button>{' '}</Col>
        </Row>
        <Button type="submit" color="primary" onClick={this.toggle}>Save</Button>{' '}
        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
      </Form>
    );
  }
}

export default GoalsCreateForm;