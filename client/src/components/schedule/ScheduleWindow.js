import React  from 'react'
import Timeline from 'react-visjs-timeline'
import { Row, Col, Button } from 'reactstrap'
import ScheduleSidePanel from './ScheduleSidePanel'

import { getLines } from '../../actions/linesActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

  const data = {
      groups: [],
      items: [],
      options: {
        stack: false,
        start: new Date(),
        end: new Date(1000*60*60*24 + (new Date()).valueOf()),
        editable: true,
        orientation: 'top',
        horizontalScroll: true,
        onAdd: function(item, callback) {
          if(data.items.find(i => ( ((i.start <= item.end && item.start <= i.end) || (item.start <= i.end && i.start <= item.end)) && (i.id !== item.id)  && (i.id !== item.id) && (i.group === item.group)))) {
                alert("Move item to a non-overlapping location.")
                callback(null)
          }
          else {
            data.items.push(item)
            callback(item)
          }
        },
        onMove: function(item, callback) {
          console.log(data.items)
          if(data.items.find(i => ( ((i.start <= item.end && item.start <= i.end) || (item.start <= i.end && i.start <= item.end)) && (i.id !== item.id)  && (i.id !== item.id) && (i.group === item.group)))) {
                alert("Move item to a non-overlapping location.")
                callback(null)
          }
          else {
            const index = data.items.findIndex(i => i.id === item.id)
            if(index > -1) data.items[index] = item;
          }
        },
        onRemove: function(item, callback) {
            var index = data.items.indexOf(i => i.id === item.id)
            data.items.splice(index)
            callback(item)
        }
      }
   }

class ScheduleWindow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIds: [],
      items: []
    }
  }

  componentDidMount() {
    this.props.getLines()
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
            />
            </Col>
            </Row>
      </div>
    )
  }

   handleDragStart = (event, _id, name) => {
    event.dataTransfer.effectAllowed = 'move';
    var item = {
      id: _id,
      type:'range',
      content: name,
    };
    event.dataTransfer.setData("text", JSON.stringify(item));
  }

}

ScheduleWindow.propTypes = {
  getLines: PropTypes.func.isRequired,
  lines: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    lines: state.lines
});

export default connect(mapStateToProps, { getLines })(ScheduleWindow);


/** && (i.id !== item.id) && (i.group === item.group)

|| (item.start <= i.end && i.start <= item.end)


**/