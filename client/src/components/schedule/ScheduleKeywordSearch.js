import React from 'react';
import {
  InputGroup, InputGroupAddon, Input, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setScheduleLoading, searchSchedulebyKW, sortSchedule } from '../../actions/scheduleActions';

class ScheduleKeywordSearch extends React.Component {
  state = {
    keywords: ''
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    if(e.target.value.length === 0){
      const newObj = {};
      if('goals' in this.props.schedule.goals){
        newObj.goals = this.props.schedule.obj.goals
      }
      this.props.sortSchedule(this.props.schedule.sortby, this.props.schedule.sortdir, 1, this.props.schedule.pagelimit, newObj);
    };
  }

  searchKW = () => {
    var newObj = this.props.schedule.obj;
    if(this.state.keywords.length > 0){
      this.props.searchSchedulebyKW(this.state.keywords);
    }
    else{
      newObj = {};
    }
    this.props.sortSchedule(this.props.schedule.sortby, this.props.schedule.sortdir, 1, this.props.schedule.pagelimit, this.props.schdeule.obj);
  }
  render() {
    return (
      <div>
      <InputGroup>
        <Input placeholder="Keyword Search" name="keywords" onChange={this.onChange}/>
        <InputGroupAddon addonType="append"><Button onClick={this.searchKW}><FontAwesomeIcon icon = "search"/></Button></InputGroupAddon>
      </InputGroup>
      </div>
    );
  }
}
ScheduleKeywordSearch.propTypes = {
  setScheduleLoading: PropTypes.func.isRequired,
  searchSchedulebyKW: PropTypes.func.isRequired,
  schedule: PropTypes.object.isRequired
};

const mapStateToProps = state => ( {
  schedule: state.schedule
});

export default connect(mapStateToProps, {searchSchedulebyKW, setScheduleLoading, sortSchedule})(ScheduleKeywordSearch);