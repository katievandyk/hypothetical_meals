import React  from 'react'
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, Input, Label } from 'reactstrap'

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
    this.props.getGoals(this.props.auth.user_email);
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
                <CardHeader>Manufacturing Lines</CardHeader>
                    <CardBody>
                        <Label>Goals Search</Label>
                        <Input placeholder="Enter goal or creator..."/> &nbsp;
                        <ListGroup>
                            {goals.map(({_id, name})=> (
                                <ListGroupItem action active={this.state.selectedGoals.some(goal => goal._id === _id)} tag="button" onClick={() => this.toggleActive(_id)} md={2} >
                                    {name}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </CardBody>
                </Card> &nbsp;
                <Card>
                <CardHeader>SKUs for Selected Goals</CardHeader>
                    <CardBody>
                            {this.state.selectedGoals.map(({_id, name, skus_list})=> (
                                <div style={{paddingBottom: '1.5em'}}>
                                    <Label><h6>{name}</h6></Label>
                                    {skus_list.map(({_id, sku})=> (
                                        <ListGroup>
                                            <ListGroupItem  md={2} draggable="true" onDragStart={(e) => this.props.handleDragStart(e, sku.name)}>
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