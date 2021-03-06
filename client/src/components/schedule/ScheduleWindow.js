import React  from 'react'
import Timeline from 'react-visjs-timeline'
import { Modal, ModalHeader, ModalBody, Button, Row, Col} from 'reactstrap'
import ScheduleSidePanel from './ScheduleSidePanel'
import CreateScheduleReport from './CreateScheduleReport'
import { getLines } from '../../actions/linesActions';
import { getSchedule, genWarning, updateActivity, deleteActivity, addActivity, getActivities } from '../../actions/scheduleActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../styles.css'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

  const data = {
    items: [],
    groups: []
   }

class ScheduleWindow extends React.Component {
  constructor(props) {
    super(props)
    this.getOptions = this.getOptions.bind(this)
    this.calculateEndDate = this.calculateEndDate.bind(this)
    this.maintainZoom = this.maintainZoom.bind(this)
    this.zoomOut = this.zoomOut.bind(this)
    this.zoomIn = this.zoomIn.bind(this)
    this.toggle = this.toggle.bind(this)
    this.state = {
        modal: false,
        windowStart: new Date(),
        windowEnd: new Date(1000*60*60*24*3 + (new Date()).valueOf())
    }
  }

  componentDidMount() {
    this.props.getLines()
    this.props.getSchedule()
    this.props.getActivities()
    this.props.genWarning({
        start: this.state.windowStart,
        end: this.state.windowEnd
    })
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  getOptions() {
     const  options = {
            stack: false,
            start: this.state.windowStart,
            end: this.state.windowEnd,
            zoomMin: 1000 * 60 * 60 * 24,
            zoomMax: 1000 * 60 * 60 * 24 * 31 * 12 * 10,
            editable: {
                add: this.props.auth.isAdmin || this.props.auth.user.plant,
                overrideItems: false,
                updateTime: this.props.auth.isAdmin || this.props.auth.user.plant,
                updateGroup: this.props.auth.isAdmin || this.props.auth.user.plant,
                remove: this.props.auth.isAdmin || this.props.auth.user.plant
            },
            orientation: 'top',
            horizontalScroll: true,
            visibleFrameTemplate: function(item) {
              return '<div class="vis-onUpdateTime-tooltip" ><div><b>Start:</b>' + item.start + ' </div><div><b>End:</b> ' + item.end +'</div><div><b>Deadline:</b>' + moment(item.deadline).toLocaleString() + '</div><div>'
            },
            hiddenDates: [{
                start: '2017-03-04 18:00:00',
                end: '2017-03-05 08:00:00',
                repeat: 'daily'
            }],
            onAdd: function(item, callback) {
             const lines = [];
             if(this.props.schedule.goal_skus.find(elem => elem.goal._id === item.goal)) this.props.schedule.goal_skus.find(elem => elem.goal._id === item.goal).skus.find(elem => elem._id === item.sku).manufacturing_lines.forEach(l => lines.push(l._id));
             if(data.items.find(i => ( ((i.start <= item.end && item.start <= i.end) || (item.start <= i.end && i.start <= item.end)) && (i.id !== item.id)  && (i.id !== item.id) && (i.group === item.group)))) {
                    alert("Move item to a non-overlapping location.")
                    callback(null)
              }
              else if(lines.indexOf(item.group) === -1) {
                    alert("Move item to a valid manufacturing line.")
                    callback(null)
              }
              else if(!this.props.auth.isAdmin && this.props.auth.user.plant && this.props.auth.user.lines.filter(line => line._id === item.group).length === 0) {
                alert("You don't have access to this manufacturing line.")
                callback(null)
              }
              else {
                const startDate =this.adjustStartDate(moment(item.start));
                item.end = this.calculateEndDate(moment(startDate), item.duration)
                const endDate = this.adjustEndDate(moment(item.end));

                this.calculateDuration(startDate, endDate)
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
                this.addWarnings();
                this.maintainZoom();
              }
            }.bind(this),
            onMove: function(item, callback) {
              const lines = [];
              const goal = this.props.schedule.goal_skus.find(elem => elem.goal && elem.goal._id === item.goal).goal
              this.props.schedule.goal_skus.find(elem => elem.goal && elem.goal._id === item.goal).skus.find(elem => elem._id === item.sku).manufacturing_lines.forEach(l => lines.push(l._id));
              if(data.items.find(i => ( ((i.start <= item.end && item.start <= i.end) || (item.start <= i.end && i.start <= item.end)) && (i.id !== item.id)  && (i.id !== item.id) && (i.group === item.group)))) {
                    alert("Move item to a non-overlapping location.")
                    callback(null)
              }
              else if(lines.indexOf(item.group) === -1) {
                    alert("Move item to a valid manufacturing line.")
                    callback(null)
              }
              else if(!this.props.auth.isAdmin && this.props.auth.user.plant && this.props.auth.user.lines.filter(line => line._id === item.group).length === 0) {
                alert("You don't have access to this manufacturing line.")
                callback(null)
              }
              else {
                const act = this.props.schedule.activities.find(({_id}) => (item.id === _id))
                var newDuration = this.calculateDuration(moment(item.start), moment(item.end))
                if(newDuration < 0) {
                  alert("Cannot create negative duration")
                  newDuration=item.duration
                }
                const startDate = this.adjustStartDate(moment(item.start));
                const endDate = this.calculateEndDate(startDate, newDuration)
                const updatedAct = {
                    name: act.name,
                    start: startDate,
                    end: endDate,
                    orphan: act.orphan,
                    duration: newDuration,
                    durationModified: (newDuration !== act.duration) || act.durationModified,
                    _id: act._id,
                    sku: act.sku._id,
                    line: item.group,
                    goal_id: act.goal_id._id,
                }
                this.props.updateActivity(updatedAct, act._id)
                this.addWarnings();
                this.maintainZoom();
                callback(item)
              }
            }.bind(this),
            onRemove: function(item, callback) {
                const act = this.props.schedule.activities.find(({_id}) => (item.id === _id))
                this.props.deleteActivity(act._id)
                data.items = data.items.filter(({id}) => id !== item.id)
                callback(item)
                this.maintainZoom();
            }.bind(this)
          }
       return options;
  }

  maintainZoom = () => {
      const timeline = this.timeline.$el
      const times = timeline.getWindow();
      this.setState({
            windowStart: times.start,
            windowEnd: times.end
     })
  }

  addWarnings = () => {
      const timeline = this.timeline.$el
      const times = timeline.getWindow();
      const obj = {
        start: times.start,
        end: times.end
      }
      this.props.genWarning(obj)
      this.maintainZoom()
  }

  calculateEndDate = (startDate, duration) => {
    var daystoAdd = Math.floor(duration/10)
    var hours = startDate.hour() + (duration % 10)
    if(startDate.hour() + (duration % 10) > 18) {
        daystoAdd++;
        hours = startDate.hour() + (duration % 10) - 10;
    }
    var endDate = moment(startDate);
    endDate.add(daystoAdd, 'd')

    var ds = moment("03-10-2019", "MM-DD-YYYY");
    var ds2 = moment("11-03-2019","MM-DD-YYYY");
    if(startDate.isBefore(ds) && endDate.isAfter(ds) && endDate.isBefore(ds2)) {
      hours++;
      if (hours > 18) {
        endDate.add(1,'d')
        hours = 9
      }
    }
    else if(startDate.isAfter(ds) && startDate.isBefore(ds2) && endDate.isAfter(ds2)) {
      hours--;
      if (hours < 8) {
        endDate.subtract(1, 'd')
        hours = 17
      }
    }
    endDate.set({ hour: hours })
    return endDate
  }

  calculateDuration = (startDate, endDate) => {
    // TODO need to set default start/end date hours if they fall onto hidden dates
    var hours = moment.duration(endDate.diff(startDate)).asHours();
    var days;
    if(startDate.year() !== endDate.year()) {
      days = Math.floor(moment.duration(endDate.diff(startDate)).asDays());
    }
    else {
      days = endDate.dayOfYear() - startDate.dayOfYear();
    }
    var duration = hours - days*14;
    return duration;
  }

  adjustStartDate = (startDate) => {
    if(startDate.get('hour') < 8) {
      startDate.hour(8)
      startDate.minute(0)
      startDate.second(0)
    }
    else if(startDate.get('hour') >= 18) {
      startDate.add(1, 'd')
      startDate.hour(8)
      startDate.minute(0)
      startDate.second(0)
    }
    return startDate
  }

  adjustEndDate = (endDate) => {
    if(endDate.get('hour') < 8) {
      endDate.hour(18)
      endDate.minute(0)
      endDate.second(0)
      endDate.subtract(1,'d')
    }
    else if(endDate.get('hour') >= 18) {
      endDate.hour(18)
      endDate.minute(0)
      endDate.second(0)
    }
    return endDate
  }

  zoomOut = () => {
      const timeline = this.timeline.$el
      timeline.zoomOut(1)
  }

  zoomIn = () => {
      const timeline = this.timeline.$el
      timeline.zoomIn(1)
   }

  selectedItem = (_id, goal_id) => {
    const [item] = data.items.filter(function(item){
      return (item.sku === _id && item.goal === goal_id)
    });
    if(item){
      this.setState({windowStart: item.start, windowEnd: item.end});
    }
  }

  render() {
    const { lines } = this.props.lines;
    data.groups = lines.map(line =>{
        const contains_line = this.props.auth.user.lines.filter(user_line => user_line._id === line._id);
        var group = {};
        group.id = line._id;
        group.content = line.shortname;
        if(!this.props.auth.isAdmin && contains_line.length === 0 && this.props.auth.user.plant){
          group.style = "background-color: pink";
          group.className = 'disabled-mline';
        }
        return group;
    })
    var activities = this.props.schedule.activities;
    const autoschedule = this.props.schedule.autoschedule;
    for(var i = 0; i < Object.entries(autoschedule).length; i++){
      if(Object.entries(autoschedule)[i][0] !== 'unscheduled'){
        for(var j = 0; j < Object.entries(autoschedule)[i][1].length; j++){
          var line_activity = Object.entries(autoschedule)[i][1][j];
          line_activity.inReview = true;
          line_activity.line_id = Object.entries(autoschedule)[i][0];
          activities = activities.concat(line_activity);
        }
      }
    }
    data.items = activities.map(activity =>{
        if(activity.inReview){
          var className = 'inReview';
          var content = activity.sku_id.name + ' - Pending Approval';
          const startDate = moment(activity.start);
          const endDate = moment(activity.end);
          const id = activity.sku_id._id + activity.goal_id._id;
          const item = {
                       id: id,
                       content: content,
                       type: 'range',
                       editable: {
                         remove: false,
                         updateGroup: false,
                         updateTime: false
                       },
                       start: startDate,
                       end: endDate,
                       className: className,
                       sku: activity.sku_id._id,
                       goal: activity.goal_id._id,
                       group: activity.line_id,
                       duration: activity.duration,
                       deadline: activity.goal_id.deadline
                   };
         return item;
        }
        else{
          var className = 'green'
          var content = activity.name;
          const startDate = moment(activity.start)
          const endDate = moment(activity.end)
          if(activity.durationModified) {
             className = 'orange'
             content = activity.name + ' - Range Changed'
          }
          if(moment(activity.goal_id.deadline) <= moment(endDate)) {
             className = 'red'
             content = activity.name + ' - Past Due'
          }
          if(activity.orphan) {
             className= 'gray'
             content = activity.name + ' - Orphan'
          }
          const item = {
                       id: activity._id,
                       content: content,
                       type: 'range',
                       editable: {
                         remove: this.props.auth.isAdmin || (this.props.auth.user.plant && this.props.auth.user.lines.filter(line => line._id === activity.line._id).length > 0),
                         updateGroup: (!activity.orphan && (this.props.auth.isAdmin || (this.props.auth.user.plant && this.props.auth.user.lines.filter(line => line._id === activity.line._id).length > 0))),
                         updateTime: (!activity.orphan && (this.props.auth.isAdmin|| (this.props.auth.user.plant && this.props.auth.user.lines.filter(line => line._id === activity.line._id).length > 0)))
                       },
                       start: startDate,
                       end: endDate,
                       className: className,
                       sku: activity.sku._id,
                       goal: activity.goal_id._id,
                       group: activity.line._id,
                       duration: activity.duration,
                       deadline: activity.goal_id.deadline
                   };
         return item;
        }
    })
    return (
      <div>
        <Row style={{paddingBottom: '1.5em'}}>
            <Col style={{'textAlign': 'right'}}> </Col>
            <CreateScheduleReport/>
        </Row>
        <Row>
           <Col md={3}>
                <ScheduleSidePanel items={data.items} handleDragStart={this.handleDragStart} selectedItem={this.selectedItem}/>
           </Col>
            <Col>
            <Timeline
              {...data}
              options = {this.getOptions()}
              ref={el => (this.timeline = el)}
              container = {document.getElementById('zoombar')}
              rangechangedHandler={this.addWarnings}
            />
            <div className={(this.state.modal) ? "hidden" : ""}>
                <div className="menu" style={{left: '40%'}}>
                    <Button onClick={this.zoomOut}><FontAwesomeIcon icon="search-minus"/></Button>&nbsp;
                    <Button onClick={this.zoomIn}><FontAwesomeIcon icon="search-plus"/></Button>&nbsp;
                    <Button onClick={this.toggle}><FontAwesomeIcon icon="question-circle"/></Button>
                </div>
            </div>
            </Col>
            </Row>
        <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>Help</ModalHeader>
          <ModalBody>
            <h4>Adding Items</h4>
            <p><b>Enable and disable goals</b> by clicking the edit icon on the top-left panel.</p>
            <p><b>Add a SKU</b> to the schedule by clicking and dragging from the available options in the bottom-left panel.</p>
            <p><b>Click</b> an item in the left panel to view it in the schedule.</p>
            <p></p><p></p>
            <h4>Navigating the Schedule</h4>
            To <b>zoom</b>, icons at the bottom of the timeline or click and pinch. To <b>move left and right</b> in time, click and drag.
            <p></p><p></p>
            <h4>Color Meanings</h4>
             <p>A <font color="red"><b>red</b></font> activity means that it has been scheduled <b>past its due date</b>.</p>
             <p>A <font color="gray"><b>gray</b></font> activity means that its <b>goal has been disabled</b>.</p>
             <p>An <font color="orange"><b>orange</b></font> activity means that its <b>range has been changed</b> by an admin.</p>
             <p>A <font color="green"><b>green</b></font> activity is <b>properly scheduled</b>.</p>
          </ModalBody>
        </Modal>
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
  genWarning: PropTypes.func.isRequired,
  lines: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    lines: state.lines,
    auth: state.auth,
    schedule: state.schedule
});

export default connect(mapStateToProps, { getLines, addActivity, updateActivity, deleteActivity, getActivities, getSchedule, genWarning })(ScheduleWindow);
