import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css' // TODO change css file
import GoalCreateEntry from '../components/GoalCreateEntry';
import GoalsSKUDropdown from '../components/GoalsSKUDropdown';
import GoalsProductLineDropdown from '../components/GoalsProductLineDropdown';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';

class GoalsCreateModal extends React.Component {

  render() {
    return (
      <div>
        <FormGroup>
            <Label for="goal_name">Manufacturing Goal Name</Label>
            <Input id="goal_name"/>
        </FormGroup>
        <Row>
            <GoalCreateEntry/>
        </Row>
        <Row form className="my-3">
                <Col md={3.5}><GoalsProductLineDropdown/></Col>
                <Col md={2.5}><GoalsSKUDropdown/></Col>
                <Col md={2}><Input id="goal_name" placeholder="Qty."/> </Col>
                <Col><Button color="primary">Add</Button>{' '}</Col>
        </Row>
      </div>
    );
  }
}

export default GoalsCreateModal;
