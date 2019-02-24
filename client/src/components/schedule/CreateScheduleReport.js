import React, { Component } from 'react';

import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Label
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Select from 'react-select';
import { getLines } from '../../actions/linesActions';
import {Redirect} from 'react-router';
import { genScheduleReport } from '../../actions/scheduleActions';

class CreateScheduleReport extends Component {
  state ={
    modal:false,
    line_id: '',
    validate:'',
    validate_dates:'',
    view_modal: false,
    naviage: false
  }

  componentDidMount() {
    this.props.getLines();
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      line_id: '',
      validate: '',
      validate_dates:'',
      startDate: null,
      endDate: null
    })
  }

  viewtoggle = () => {
    this.setState({
      view_modal: !this.state.view_modal
    })
  }

  genOptions = (lines) => {
    var newOptions = [];
    lines.forEach(function(line){
      var newOption = {value: line._id, label: line.shortname};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  classNameValue = () => {
    if(this.state.validate=== 'not-selected'){
      return "isInvalid";
    }
    else if(this.state.validate === 'has-success'){
      return "isValid";
    }
    else
      return "";
  }

  onChange = (e) => {
    this.setState({
      line_id: e.value,
      validate: 'has-success'
    })
  }

  onGenReportClick = () =>{
    var allRequiredFields = true;
    if(!this.state.startDate || !this.state.endDate){
      this.setState({
        validate_dates: false
      })
      allRequiredFields = false;
    }
    if(this.state.validate===''){
      this.setState({
        validate: 'not-selected'
      })
      allRequiredFields = false;
    }
    if(allRequiredFields){
      var startString = this.state.startDate.format('YYYY-MM-DD') + "T08:00:00.000Z";
      var endString = this.state.endDate.format('YYYY-MM-DD') + "T18:00:00.000Z";
      const newObj = {line_id: this.state.line_id, start: startString, end: endString}
      this.props.genScheduleReport(newObj);
      this.toggle();
      this.viewtoggle();
    }
  }

  redirectReports = () => {
    this.setState({
      navigate: true
    })
  }

  render(){
    if(this.state.navigate){
      return(<Redirect to="/manufacturing-schedule-report" push={true} />);
    }
      return (
        <div>
        <div style={{paddingRight:'10px'}}><Button color="success" onClick={this.toggle}>Create Manufacturing Schedule Report</Button>{' '}</div>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}> Create Manufacturing Schedule Report </ModalHeader>
          <ModalBody>
          <Form>
            <FormGroup>
              <Label for="line">Manufacturing Line</Label>
              <Select
                className={this.classNameValue()}
                classNamePrefix="react-select"
                options={this.genOptions(this.props.lines.lines)}
                onChange={this.onChange}
                placeholder="Select Manufacturing Line"/>
              <div style={{display:'block'}} className={(this.state.validate === 'not-selected')? ("invalid-feedback"):("hidden")}>
                Please select a valid manufacturing line from the dropdown.
              </div>
            </FormGroup>
            <FormGroup className="isInvalid">
              <Label for="date_range">Date Range</Label>
              <div>
              <DateRangePicker
              startDate={this.state.startDate}
              startDateId="start_date_id"
              endDate={this.state.endDate} // momentPropTypes.momentObj or null,
              endDateId="end_date_id" // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired
              /></div>
              <div style={{display:'block'}} className={(this.state.validate_dates === 'not-selected')? ("invalid-feedback"):("hidden")}>
                Please enter valid dates.
              </div>
            </FormGroup>

          </Form>
          </ModalBody>
          <ModalFooter><Button onClick={this.onGenReportClick}>Generate Manufacturing Schedule Report</Button></ModalFooter>
        </Modal>
        <Modal isOpen={this.state.view_modal && this.props.schedule.error_msgs.length === 0 } toggle={this.viewtoggle}>
          <ModalHeader toggle={this.viewtoggle}> Report Generated </ModalHeader>
          <ModalBody style={{textAlign:'center'}}>
              Manufacturing Schedule Report Generated! <br></br>You can view or
              export it on the Manufacturing Schedule Report page
          </ModalBody>
          <ModalFooter><Button onClick={this.redirectReports}>View Manufacturing Schedule Report</Button></ModalFooter>
        </Modal>
        </div>
      );
  }
}

CreateScheduleReport.propTypes = {
  schedule: PropTypes.object.isRequired,
  lines: PropTypes.object.isRequired,
  getLines: PropTypes.func.isRequired,
  genScheduleReport: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  schedule: state.schedule,
  lines: state.lines
});

export default connect(mapStateToProps, {getLines, genScheduleReport})(CreateScheduleReport);
