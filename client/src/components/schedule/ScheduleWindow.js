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
        onDropObjectOnItem: function(objectData, item, callback) {
          if (!item) { return; }
          alert('dropped object with content: "' + objectData.content + '" to item: "' + item.content + '"');
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
              selection={this.state.selectedIds}
            />
            </Col>
            </Row>
      </div>
    )
  }

   handleDragStart = (event, _id, name) => {
    event.dataTransfer.effectAllowed = 'move';
    var item = {
      id: new Date(),
      type:'range',
      content: name,
    };
    data.items.push(item)
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
