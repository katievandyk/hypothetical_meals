import React  from 'react'
import Timeline from 'react-visjs-timeline'
import { Row, Col, Button } from 'reactstrap'
import ScheduleSidePanel from './ScheduleSidePanel'

import { getLines } from '../../actions/linesActions';
import { getSchedule, updateActivity, deleteActivity, addActivity, getActivities } from '../../actions/scheduleActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../styles.css'
import moment from 'moment'


  const data = {
    items: [],
    groups: []
   }

class ScheduleWindow extends React.Component {
  constructor(props) {
    super(props)
    this.getOptions = this.getOptions.bind(this)
  }

  componentDidMount() {
    this.props.getLines()
    this.props.getSchedule()
    this.props.getActivities()
  }

  getOptions() {
     const  options = {
            stack: false,
            start: new Date(),
            end: new Date(1000*60*60*24 + (new Date()).valueOf()),
            hiddenDates: [{
                start: '2017-03-04 18:00:00',
                end: '2017-03-05 08:00:00',
                repeat: 'daily'
            }],
            zoomMin: 1000 * 60 * 60 * 24,
            zoomMax: 1000 * 60 * 60 * 24 * 31 * 3,
             editable: {
                add: true,         // add new items by double tapping
                updateTime: true,
                updateGroup: true, // drag items from one group to another
                remove: true       // delete an item by tapping the delete button top right
              },
            orientation: 'top',
            horizontalScroll: true,
            onAdd: function(item, callback) {
             const lines = [];
             const goal = this.props.schedule.goal_skus.find(elem => elem.goal._id === item.goal).goal
             this.props.schedule.goal_skus.find(elem => elem.goal._id === item.goal).skus.find(elem => elem._id === item.sku).manufacturing_lines.forEach(l => lines.push(l._id));
             if(data.items.find(i => ( ((i.start <= item.end && item.start <= i.end) || (item.start <= i.end && i.start <= item.end)) && (i.id !== item.id)  && (i.id !== item.id) && (i.group === item.group)))) {
                    alert("Move item to a non-overlapping location.")
                    callback(null)
              }
              else if(lines.indexOf(item.group) === -1) {
                    alert("Move item to a valid manufacturing line.")
                    callback(null)
              }
              else {
                const startDate = moment(item.start);
                startDate.subtract(5, 'h');
                const endDate = moment(item.start);
                endDate.add(item.duration, 'h');
                item.end = endDate;
                const activity = {
                    name: item.content,
                    sku_id: item.sku,
                    line_id: item.group,
                    start: startDate,
                    duration: item.duration,
                    sku_goal_id: item.goal
                }
                this.props.addActivity(activity, (id) => {
                    item.id = id
                    this.props.getActivities()
                    callback(item)
                });
              }
            }.bind(this),
            onMove: function(item, callback) {
             const lines = [];
             const goal = this.props.schedule.goal_skus.find(elem => elem.goal._id === item.goal).goal
              this.props.schedule.goal_skus.find(elem => elem.goal._id === item.goal).skus.find(elem => elem._id === item.sku).manufacturing_lines.forEach(l => lines.push(l._id));
              if(data.items.find(i => ( ((i.start <= item.end && item.start <= i.end) || (item.start <= i.end && i.start <= item.end)) && (i.id !== item.id)  && (i.id !== item.id) && (i.group === item.group)))) {
                    alert("Move item to a non-overlapping location.")
                    callback(null)
              }
              else if(lines.indexOf(item.group) === -1) {
                    alert("Move item to a valid manufacturing line.")
                    callback(null)
              }
              else if(goal.deadline > item.end) {
                    item.className = 'red'
              }
              else {
                const startDate = moment(item.start);
                startDate.subtract(5, 'h');
                const endDate = moment(item.start);
                endDate.add(item.duration, 'h');
                item.end = endDate;
                const act = this.props.schedule.activities.find(({_id}) => (item.id === _id))
                const updatedAct = {
                    name: act.name,
                    start: startDate,
                    duration: act.duration,
                    _id: act._id,
                    sku: act.sku._id,
                    line: item.group,
                    goal_id: act.goal_id._id
                }
                this.props.updateActivity(updatedAct, act._id)
                callback(item)
              }
            }.bind(this),
            onRemove: function(item, callback) {
                const act = this.props.schedule.activities.find(({_id}) => (item.id === _id))
                this.props.deleteActivity(act._id)
                data.items = data.items.filter(({id}) => id !== item.id)
                callback(item)
            }.bind(this),
          }
       return options;
  }

  exportReport = () => {
    const timeline = this.timeline.$el
    const times = timeline.getWindow();
    alert(times.start)
    alert(times.end)
  }

  addDeadlines = () => {
    const timeline = this.timeline.$el
    timeline.addCustomTime(this.props.schedule.goal_skus[0].deadline);
  }

  render() {
    const { lines } = this.props.lines;
    data.groups = lines.map(line =>{
        var group = {};
        group.id = line._id;
        group.content = line.name;
        return group;
    })
    const activities = this.props.schedule.activities;
    var className = 'green'
    data.items = activities.map(activity =>{
         const startDate = moment(activity.start).add(5, 'h');
         const endDate = moment(activity.start).add(5, 'h');
         endDate.add(activity.duration, 'h');
         if(moment(activity.goal_id.deadline) <= moment(endDate)) {
            className = 'red'
         }
         const item = {
                      id: activity._id,
                      content: activity.name,
                      type: 'range',
                      start: startDate,
                      end: endDate,
                      className: className,
                      sku: activity.sku._id,
                      goal: activity.goal_id._id,
                      group: activity.line._id,
                      duration: activity.duration
                  };
        return item;
    })
    return (
      <div>
        <Row style={{paddingBottom: '1.5em'}}>
            <Col style={{'textAlign': 'right'}}> </Col>
            <Button onClick={this.exportReport}>Manufacturing Schedule Report </Button>
        </Row>
        <Row>
           <Col md={3}>
                <ScheduleSidePanel items={data.items} handleDragStart={this.handleDragStart}/>
           </Col>
            <Col>
            <Timeline
              {...data}
              options = {this.getOptions()}
              ref={el => (this.timeline = el)}
            />
            </Col>
            </Row>
      </div>
    )
  }

   handleDragStart = (event, _id, goal_id, name, duration) => {
    event.dataTransfer.effectAllowed = 'move';
    var item = {
      id: goal_id + _id,
      type:'range',
      content: name,
      className: 'green',
      sku: _id,
      goal: goal_id,
      duration: String(duration)
    };
    event.dataTransfer.setData("text", JSON.stringify(item));
  }

}

ScheduleWindow.propTypes = {
  getLines: PropTypes.func.isRequired,
  getSchedule: PropTypes.func.isRequired,
  getActivities: PropTypes.func.isRequired,
  addActivity: PropTypes.func.isRequired,
  updateActivity: PropTypes.func.isRequired,
  lines: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    lines: state.lines,
    schedule: state.schedule
});

export default connect(mapStateToProps, { getLines, addActivity, updateActivity, deleteActivity, getActivities, getSchedule })(ScheduleWindow);
