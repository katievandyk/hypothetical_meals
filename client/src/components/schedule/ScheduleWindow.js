import React  from 'react'
import Timeline from 'react-visjs-timeline'
import { Row, Col, Button } from 'reactstrap'
import ScheduleSidePanel from './ScheduleSidePanel'

import { getLines } from '../../actions/linesActions';
import { getSchedule, addActivity } from '../../actions/scheduleActions';
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
    this.state = {
      selectedIds: [],
      items: []
    }
  }

  componentDidMount() {
    this.props.getLines()
    this.props.getSchedule()
  }

  getOptions() {
     const  options = {
            stack: false,
            start: new Date(),
            end: new Date(1000*60*60*24 + (new Date()).valueOf()),
             editable: {
                add: true,         // add new items by double tapping
                updateTime: true,
                updateGroup: true, // drag items from one group to another
                remove: true       // delete an item by tapping the delete button top right
              },
            orientation: 'top',
            horizontalScroll: true,
            onAdd: function(item, callback) {
              if(data.items.find(i => ( ((i.start <= item.end && item.start <= i.end) || (item.start <= i.end && i.start <= item.end)) && (i.id !== item.id)  && (i.id !== item.id) && (i.group === item.group)))) {
                    alert("Move item to a non-overlapping location.")
                    callback(null)
              }
              else {
                const date = moment(item.start);
                date.add(item.duration, 'h');
                item.end = date;
                const activity = {
                    name: item.content,
                    sku_id: item.id,
                    line_id: item.group,
                    start: item.start,
                    duration: item.duration
                }
                this.props.addActivity(activity)
                callback(item)
              }
            }.bind(this),
            onMove: function(item, callback) {
              if(data.items.find(i => ( ((i.start <= item.end && item.start <= i.end) || (item.start <= i.end && i.start <= item.end)) && (i.id !== item.id)  && (i.id !== item.id) && (i.group === item.group)))) {
                    alert("Move item to a non-overlapping location.")
                    callback(null)
              }
              else {
                const index = data.items.findIndex(i => i.id === item.id)
                if(index > -1) data.items[index] = item;
                callback(item)
              }
            },
            onRemove: function(item, callback) {
                var index = data.items.indexOf(i => i.id === item.id)
                data.items.splice(index)
                callback(item)
            }
          }
       return options;
  }

  render() {
    const { lines } = this.props.lines;
    data.groups = lines.map(line =>{
        var group = {};
        group.id = line._id;
        group.content = line.name;
        return group;
    })

    return (
      <div>
        <Row style={{paddingBottom: '1.5em'}}>
            <Col style={{'textAlign': 'right'}}> </Col>
            <Button>Manufacturing Schedule Report </Button>
        </Row>
        <Row>
           <Col md={3}>
                <ScheduleSidePanel handleDragStart={this.handleDragStart}/>
           </Col>
            <Col>
            <Timeline
              {...data}
              options = {this.getOptions()}
            />
            </Col>
            </Row>
      </div>
    )
  }

   handleDragStart = (event, _id, name, duration) => {
    event.dataTransfer.effectAllowed = 'move';
    var item = {
      id: _id,
      type:'range',
      content: name,
      className: 'green',
      duration: String(duration)
    };
    event.dataTransfer.setData("text", JSON.stringify(item));
  }

}

ScheduleWindow.propTypes = {
  getLines: PropTypes.func.isRequired,
  getSchedule: PropTypes.func.isRequired,
  addActivity: PropTypes.func.isRequired,
  lines: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    lines: state.lines,
    schedule: state.schedule
});

export default connect(mapStateToProps, { getLines, addActivity, getSchedule })(ScheduleWindow);
