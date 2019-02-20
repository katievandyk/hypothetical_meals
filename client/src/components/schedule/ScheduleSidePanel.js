import React  from 'react'
import { Col, Row, Modal, ModalHeader, Card, CardHeader, CardBody, ListGroup, ListGroupItem, Input, Label } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getGoals } from '../../actions/goalsActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ScheduleSidePanel extends React.Component {
  constructor(props) {
    super(props)

    this.toggleActive.bind(this);
    this.state = {
      selectedGoals: [],
    }
  }

  componentDidMount() {
    this.props.getGoals(this.props.auth.user_username);
  }

  modal_toggle = () => {
      this.setState({
        modal: !this.state.modal,
      });
  }

  toggleActive = (id) => {
    const { goals } = this.props.goals;
    const selGoal = goals.find(goal => goal._id === id)
    const index = this.state.selectedGoals.indexOf(selGoal);
    if (index < 0) {
      this.state.selectedGoals.push(selGoal);
    } else {
      this.state.selectedGoals.splice(index, 1);
    }
    this.setState({ selectedGoals: [...this.state.selectedGoals] });
  }

  render() {
    const { goals } = this.props.goals;
    return (
      <div>
                <Card>
                    <CardHeader onClick={this.modal_toggle}>
                        <Row>&nbsp; &nbsp;
                            Active Goals
                            <Col style={{textAlign: 'right'}}/>
                            <FontAwesomeIcon icon = "edit"/>
                        </Row>
                    </CardHeader>
                </Card> &nbsp;
                <Modal isOpen={this.state.modal} toggle={this.modal_toggle} >
                    <ModalHeader>Set Active Manufacturing Lines</ModalHeader>
                    <CardBody>
                        <Label>Goals Search</Label>
                        <Input placeholder="Enter goal or creator..."/> &nbsp;
                        <ListGroup>
                            {goals.map(({_id, name})=> (
                                <ListGroupItem key={_id} action active={this.state.selectedGoals.some(goal => goal._id === _id)} tag="button" onClick={() => this.toggleActive(_id)} md={2} >
                                    {name}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </CardBody>
                </Modal>
                <Card>
                <CardHeader>SKUs for Selected Goals</CardHeader>
                    <CardBody>
                            {this.state.selectedGoals.map(({_id, name, skus_list})=> (
                                <div style={{paddingBottom: '1.5em'}}>
                                    <Label><h6>{name}</h6></Label>
                                    {skus_list.map(({_id, sku})=> (
                                        <ListGroup>
                                            <ListGroupItem  md={2} draggable="true" onDragStart={(e) => this.props.handleDragStart(e, sku._id, sku.name)}>
                                                {sku.name}
                                            </ListGroupItem>
                                        </ListGroup>
                                ))}
                                </div>
                         ))}
                    </CardBody>
                </Card>
      </div>
    )
  }
}

ScheduleSidePanel.propTypes = {
  getGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  goals: state.goals,
  auth: state.auth
});

export default connect(mapStateToProps, { getGoals })(ScheduleSidePanel);