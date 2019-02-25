import React  from 'react'
import Timeline from 'react-visjs-timeline'
import { Row, Col} from 'reactstrap'
import ScheduleSidePanel from './ScheduleSidePanel'
import CreateScheduleReport from './CreateScheduleReport'
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
    this.calculateEndDate = this.calculateEndDate.bind(this)
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
            zoomMin: 1000 * 60 * 60 * 24,
            zoomMax: 1000 * 60 * 60 * 24 * 31 * 3,
            editable: this.props.auth.isAdmin,
            orientation: 'top',
            horizontalScroll: true,
            hiddenDates: [{
                start: '2017-03-04 18:00:00',
                end: '2017-03-05 08:00:00',
                repeat: 'daily'
            }],
            tooltipOnItemUpdateTime: {
                  template: function(item) {
                    return '<div><b>Start:</b>' + item.start + ' <br /><b>End:</b>: ' + item.end +'<br /><b>Deadline:</b>' + item.deadline + '/<div>'
                  }
              },
            onAdd: function(item, callback) {
             const lines = [];
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
                item.end = this.calculateEndDate(moment(item.start), item.duration)
                const startDate = moment(item.start);
                startDate.subtract(5, 'h');
                const endDate = moment(item.end);
                endDate.subtract(5, 'h');
                const activity = {
                    name: item.content,
                    sku_id: item.sku,
                    line_id: item.group,
                    start: startDate,
                    end: endDate,
                    duration: item.duration,
                    goal_id: item.goal
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
                const act = this.props.schedule.activities.find(({_id}) => (item.id === _id))
                // find differences in duration
                const newDuration = this.calculateDuration(moment(item.start), moment(item.end))
                // properly format start and end dates
                item.end = this.calculateEndDate(moment(item.start), newDuration)
                const startDate = moment(item.start);
                startDate.subtract(5, 'h');
                const endDate = moment(item.end);
                endDate.subtract(5, 'h');
                const updatedAct = {
                    name: act.name,
                    start: startDate,
                    end: endDate,
                    orphan: act.orphan,
                    duration: newDuration,
                    durationModified: (newDuration !== act.duration),
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
            }.bind(this)
          }
       return options;
  }

  calculateEndDate = (startDate, duration) => {
    var daystoAdd = Math.floor(duration/10)
    var hours = startDate.hour() + (duration % 10);
    if(hours > 18) {
        daystoAdd++;
        hours = hours - 10;
    }
    var endDate = startDate;
    endDate.add(daystoAdd, 'd')
    endDate.set({ hour: parseInt(hours) })
    const res = moment(endDate).add(5, 'h')
    return res
  }

  calculateDuration = (startDate, endDate) => {
    // TODO need to set default start/end date hours if they fall onto hidden dates
    var hours = moment.duration(endDate.diff(startDate)).asHours();
    var days = Math.floor(moment.duration(endDate.diff(startDate)).asDays());
    var duration = hours - days*14;
    return duration;
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
    var className = ''
    data.items = activities.map(activity =>{
         var content = activity.name
         const startDate = moment(activity.start).add(5, 'h');
         const endDate = moment(activity.end).add(5, 'h');
         if(activity.orphan) {
            className= 'gray'
            content = activity.name + ' -Orphan'
         }
         else if(activity.durationModified) {
            className = 'orange'
            content = activity.name + ' -Range Changed'
         }
         else if(moment(activity.goal_id.deadline) <= moment(endDate)) {
            className = 'red'
            content = activity.name + ' -Past Due'
         }
         else className = 'green'
         const item = {
                      id: activity._id,
                      content: content,
                      type: 'range',
                      start: startDate,
                      end: endDate,
                      className: className,
                      sku: activity.sku._id,
                      goal: activity.goal_id._id,
                      group: activity.line._id,
                      duration: activity.duration,
                      deadline: activity.goal_id.deadline,
                  };
        return item;
    })
    return (
      <div>
        <Row style={{paddingBottom: '1.5em'}}>
            <Col style={{'textAlign': 'right'}}> </Col>
            <CreateScheduleReport/>
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
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    lines: state.lines,
    auth: state.auth,
    schedule: state.schedule
});

export default connect(mapStateToProps, { getLines, addActivity, updateActivity, deleteActivity, getActivities, getSchedule })(ScheduleWindow);
