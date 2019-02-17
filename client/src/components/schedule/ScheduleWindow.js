import React  from 'react'
import Timeline from 'react-visjs-timeline'
import { Card, CardHeader, CardFooter, CardBody, Row, Col, ListGroup, ListGroupItem } from 'reactstrap'

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
    }
  }

  render() {
    return (
      <div>
        <Row>
            <Col md={3}>
                <Card>
                <CardHeader>Manufacturing Lines</CardHeader>
                <CardBody>
                    <ListGroup>
                            <ListGroupItem color="info" md={2} draggable="true" onDragStart={this.handleDragStart} onDragEnd={this.handleObjectItemDragEnd}>
                                item 3 - range
                            </ListGroupItem>
                    </ListGroup>
                </CardBody>
                </Card>
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

   handleDragStart(event) {
    event.dataTransfer.effectAllowed = 'move';
    var itemType = event.target.innerHTML.split('-')[1].trim();
    var item = {
      id: new Date(),
      type: itemType,
      content: event.target.innerHTML.split('-')[0].trim()
    };

    groupsExample.items.push(item)

    var isFixedTimes = (event.target.innerHTML.split('-')[2] && event.target.innerHTML.split('-')[2].trim() === 'fixed times')
    if (isFixedTimes) {
      item.start = new Date();
      item.end = new Date(1000*60*10 + (new Date()).valueOf());
    }
    event.dataTransfer.setData("text", JSON.stringify(item));
  }

  handleObjectItemDragStart(event) {
    event.dataTransfer.effectAllowed = 'move';
    var objectItem = {
      content: 'objectItemData',
      target: 'item'
    };
    event.dataTransfer.setData("text", JSON.stringify(objectItem));
  }
}

export default ScheduleWindow