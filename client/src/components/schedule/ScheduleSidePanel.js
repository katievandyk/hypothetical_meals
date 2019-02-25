import React  from 'react'
import { InputGroupAddon, Button, Col, Row, Modal, ModalHeader, Card, CardHeader, CardBody, ListGroup, ListGroupItem, Input, Label } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ScheduleKeywordSearch from '../../components/schedule/ScheduleKeywordSearch';
import { getAllGoals, searchSchedulebyKW } from '../../actions/goalsActions';
import { getSchedule, getGoalSKUs, enableGoal, disableGoal, setScheduleLoading } from '../../actions/scheduleActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ScheduleSidePanel extends React.Component {
  constructor(props) {
    super(props)

    this.toggleActive.bind(this);
    this.state = {
      sku_ranges: [],
      keywords: ''
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    if(e.target.value.length === 0){

    };
  }

  searchKW = () => {
    var newObj = this.props.schedule.obj;
    if(this.state.keywords.length > 0){
      this.props.searchSchedulebyKW(this.state.keywords);
    }
    else{
      this.props.getAllGoals();
    }
  }

  componentDidMount() {
    this.props.getSchedule()
    this.props.getAllGoals();
    this.props.getGoalSKUs()
  }

  modal_toggle = () => {
      this.setState({
        modal: !this.state.modal,
      });
  }

  toggleActive = (id) => {
    const index = this.props.schedule.schedule.enabled_goals.findIndex(i => i._id === id)
    if (index < 0) {
      this.props.enableGoal(id, this.props.schedule.schedule._id)
    } else {
      this.props.disableGoal(id, this.props.schedule.schedule._id)
    }
  }

  checkDraggable = (goal_id, sku_id ) => {
    const items = this.props.items;
    return !items.some(i => i.goal === goal_id && i.sku === sku_id)
  }

  render() {
    const { goals } = this.props.goals;
    const { schedule } = this.props.schedule;
    const goal_skus = this.props.schedule.goal_skus;
    return (
      <div>
      {this.props.auth.isAdmin ?
              ( <div>
                <Card>
                    <CardHeader onClick={this.modal_toggle}>
                        <Row>&nbsp; &nbsp;
                            Active Goals
                            <Col style={{textAlign: 'right'}}/>
                            <FontAwesomeIcon icon = "edit"/>
                        </Row>
                    </CardHeader>
                </Card> &nbsp;
                </div>
                ) : (<div></div>)}
                <Modal isOpen={this.state.modal} toggle={this.modal_toggle} >
                    <ModalHeader>Set Active Manufacturing Lines</ModalHeader>
                    <CardBody>
                        <Label>Goals Search</Label>
                        <Input placeholder="Keyword Search" name="keywords" onChange={this.onChange}/>
                        <InputGroupAddon addonType="append"><Button onClick={this.searchKW}><FontAwesomeIcon icon = "search"/></Button></InputGroupAddon>
                        <ListGroup>
                            {goals.map(({_id, name})=> (
                                <ListGroupItem key={_id} action active={schedule.enabled_goals.some(goal => goal._id === _id)} tag="button" onClick={() => this.toggleActive(_id)} md={2} >
                                    {name}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </CardBody>
                </Modal>
                <Card>
                <CardHeader>SKUs for Selected Goals</CardHeader>
                    <CardBody>
                            {goal_skus.map(({goal, skus}) =>
                                <div key={goal._id} style={{paddingBottom: '1.5em'}}>
                                        <Label><h6>{goal.name}</h6></Label>
                                        {skus.map(({name, duration, _id}) =>
                                        <ListGroupItem key={_id} md={2} draggable={this.checkDraggable(goal._id, _id)} color= {(!this.checkDraggable(goal._id, _id)) ? "success" : "default"} onDragStart={(e) => this.props.handleDragStart(e, _id, goal._id, name, duration)}>
                                            {name}
                                        </ListGroupItem>
                                        )}
                                 </div>
                         )}
                    </CardBody>
                </Card>
      </div>
    )
  }
}

ScheduleSidePanel.propTypes = {
  getAllGoals: PropTypes.func.isRequired,
  getGoalSKUs: PropTypes.func.isRequired,
  getSchedule: PropTypes.func.isRequired,
  setScheduleLoading: PropTypes.func.isRequired,
  searchSchedulebyKW: PropTypes.func.isRequired,
  schedule: PropTypes.object.isRequired,
  enableGoal: PropTypes.func.isRequired,
  disableGoal: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  goals: state.goals,
  schedule: state.schedule,
  auth: state.auth
});

export default connect(mapStateToProps, { getAllGoals, enableGoal, disableGoal, getSchedule, getGoalSKUs, searchSchedulebyKW, setScheduleLoading })(ScheduleSidePanel);
