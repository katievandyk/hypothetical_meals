import React  from 'react'
import { InputGroup, InputGroupAddon, Button, Col, Row, Modal, ModalHeader, Card, CardHeader, CardBody, ListGroup, ListGroupItem, Input, Label } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllGoals, searchSchedulebyKW } from '../../actions/goalsActions';
import { getLines } from '../../actions/linesActions';
import { getSchedule, getGoalSKUs, enableGoal, disableGoal, setScheduleLoading } from '../../actions/scheduleActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AutoScheduler from './AutoScheduler';

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
  }

  searchKW = () => {
    if(this.state.keywords.length > 0){
      this.props.searchSchedulebyKW(this.state.keywords);
    }
    else{
      this.props.getAllGoals();
    }
  }

  componentDidMount() {
    this.props.getSchedule();
    this.props.getAllGoals();
    this.props.getGoalSKUs();
    this.props.getLines();
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

  getColor = (goal_id, sku_id) => {
    const items = this.props.items;
    const item = items.filter(i => i.goal === goal_id && i.sku === sku_id);
    if(item.length > 0){
      if(item[0].className === 'green')
        return 'success';
      if(item[0].className === 'red')
        return 'danger';
      if(item[0].className === 'orange')
        return 'warning';
      if(item[0].className === 'inReview')
        return 'primary';
    }
    else {
      return 'default';
    }
  }

  getLineString = (sku_lines, lines) => {
    var line_str = "";
    sku_lines.forEach(function(s_line, i){
      var [sel_line] = lines.filter(line => line._id === s_line._id);
      if(sel_line){
        line_str = line_str + sel_line.shortname;
      }
      if(i !== sku_lines.length - 1)
        line_str = line_str + ", "
    })
    return line_str;
  }

  onSKUClick = (sku_id, goal_id, e) => {
    this.props.selectedItem(sku_id, goal_id);
  }

  render() {
    const goals = this.props.goals.all_goals;
    const { schedule } = this.props.schedule;
    const goal_skus = this.props.schedule.goal_skus;
    const lines = this.props.lines.lines;
    return (
      <div>
      {(this.props.auth.isAdmin || this.props.auth.user.plant)?
              ( <div>
                <div style={{textAlign:'center', paddingBottom:'1.5em'}}>
                <AutoScheduler></AutoScheduler>
                </div>
                <Card>
                    <CardHeader>
                        <Row>&nbsp; &nbsp;
                            Enabled Goals
                            <Col style={{textAlign: 'right'}}/>
                            {/*<FontAwesomeIcon icon = "edit"/>*/}
                        </Row>
                    </CardHeader>
                    <CardBody>
                      {goal_skus.map(({goal}) =>
                        <div key={goal._id}>{goal.name}</div>
                      )}
                    </CardBody>
                </Card> &nbsp;
                </div>
                ) : (<div></div>)}
                {/*<Modal isOpen={this.state.modal} toggle={this.modal_toggle} >
                    <ModalHeader>Set Active Manufacturing Lines</ModalHeader>
                    <CardBody>
                        <div style={{fontSize:'0.8em', paddingBottom: '1em'}}>Change which goals are active by clicking them in this list. Goals which are active are displayed in blue. Use the search bar to view specific goals.
                          </div>
                        <Label>Goals Search <em>(by name or by user)</em></Label>
                        <InputGroup>
                          <Input placeholder="Keyword Search" name="keywords" onChange={this.onChange}/>
                          <InputGroupAddon addonType="append"><Button onClick={this.searchKW}><FontAwesomeIcon icon = "search"/></Button></InputGroupAddon>
                        </InputGroup>
                        <Label style={{paddingTop: '1em'}}>List of Goals <em>(Active Goals are Blue)</em></Label>
                        <ListGroup>
                            {goals.map(({_id, name})=> (
                                <ListGroupItem key={_id} action color={(schedule.enabled_goals && schedule.enabled_goals.some(goal => goal._id === _id))?("info"):("")} tag="button" onClick={() => this.toggleActive(_id)} md={2} >
                                    {name}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </CardBody>
                </Modal>*/}
                <Card>
                <CardHeader>SKU Activities for Goals</CardHeader>
                    <CardBody>
                            {goal_skus.map(({goal, skus}) =>
                                <div key={goal._id} style={{paddingBottom: '1.5em'}}>
                                        <Label><h6>{goal.name}</h6></Label>
                                        {skus.map(({name, manufacturing_lines, duration, _id}) =>
                                        <ListGroupItem key={_id} md={2}
                                          draggable={this.checkDraggable(goal._id, _id)}
                                          color= {(!this.checkDraggable(goal._id, _id)) ? this.getColor(goal._id, _id) : "default"}
                                          onDragStart={(e) => this.props.handleDragStart(e, _id, goal._id, name, duration)}
                                          onClick={this.onSKUClick.bind(this, _id, goal._id)}>
                                            <div id="schedule_sku_name">{name}</div>
                                              <div style={{fontSize: '0.8em'}}> Lines: {manufacturing_lines ? (this.getLineString(manufacturing_lines, lines)):("")}</div>
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
  selectedItem: PropTypes.func,
  getAllGoals: PropTypes.func.isRequired,
  getLines: PropTypes.func.isRequired,
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
  auth: state.auth,
  lines: state.lines
});

export default connect(mapStateToProps, { getLines, getAllGoals, enableGoal, disableGoal, getSchedule, getGoalSKUs, searchSchedulebyKW, setScheduleLoading })(ScheduleSidePanel);
