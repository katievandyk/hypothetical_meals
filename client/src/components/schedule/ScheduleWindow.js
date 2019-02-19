import React  from 'react'
import Timeline from 'react-visjs-timeline'
import { Row, Col, Button } from 'reactstrap'
import ScheduleSidePanel from './ScheduleSidePanel'

import { getLines } from '../../actions/linesActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const groupsExample = {
  groups: [],
  items: [],
  options: {
    groupOrder: 'content', // groupOrder can be a property name or a sorting function
  },
}

 var numberOfGroups = 3;
  for (var i = 0; i < numberOfGroups; i++) {
    groupsExample.groups.push({
      id: i,
      content: 'Line&nbsp;' + i
    })
  }

  // create items
  var numberOfItems = 10;
  var itemsPerGroup = Math.round(numberOfItems/numberOfGroups);

  for (var truck = 0; truck < numberOfGroups; truck++) {
    var date = new Date();
    for (var order = 0; order < itemsPerGroup; order++) {
      date.setHours(date.getHours() +  4 * (Math.random() < 0.2));
      var start = new Date(date);

      date.setHours(date.getHours() + 2 + Math.floor(Math.random()*4));
      var end = new Date(date);

      groupsExample.items.push({
        id: order + itemsPerGroup * truck,
        group: truck,
        start: start,
        end: end,
        content: 'item ' + order
      });
    }
  }

  // specify options
  var options = {
    stack: true,
    start: new Date(),
    end: new Date(1000*60*60*24 + (new Date()).valueOf()),
    editable: true,
    orientation: 'top',
    onDropObjectOnItem: function(objectData, item, callback) {
      if (!item) { return; }
      alert('dropped object with content: "' + objectData.content + '" to item: "' + item.content + '"');
    }
  };


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
              {...groupsExample}
              options={options}
              selection={this.state.selectedIds}
            />
            </Col>
            </Row>
      </div>
    )
  }

   handleDragStart(event, name) {
    event.dataTransfer.effectAllowed = 'move';
    var item = {
      id: new Date(),
      type:'range',
      content: name
    };

    groupsExample.items.push(item)

    event.dataTransfer.setData("text", JSON.stringify(item));
  }

  handleObjectItemDragStart(event, name) {
    event.dataTransfer.effectAllowed = 'move';
    var objectItem = {
      content: 'objectItemData',
      target: 'item'
    };
    event.dataTransfer.setData("text", JSON.stringify(objectItem));
  }
}

ScheduleWindow.propTypes = {
  getLines: PropTypes.func.isRequired,
  lines: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    lines: state.lines
});

export default connect(mapStateToProps, { getLines })(ScheduleWindow);



/**


              groups = {lines.map(line =>{
                                                 var group = {};
                                                 group.id = line._id;
                                                 group.content = line.name;
                                                 return group;
                                              })}
              items = {groupsExample.items}


              **/