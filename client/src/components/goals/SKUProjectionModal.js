import React from 'react';
import {
  ModalBody, ModalFooter,
  Label,
  Button,
  CustomInput,
} from 'reactstrap';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment'

class SKUProjectionModal extends React.Component {
  constructor(props){
      super(props)
      this.state = {
        startDate: null,
        endDate: null
      };
  };

  genOptionsDD = (customers) => {
    var newOptions = [];
    customers.forEach(function(customer){
      var newOption = {value: customer._id, label: customer.name+": " + customer.number};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  render() {
    return (
      <div>
            <ModalBody>
                <Label><h5>Select Timespan</h5></Label>
                <div style={{paddingBottom: '1.5em'}}>
                      <DateRangePicker
                      startDate={this.state.startDate}
                      startDateId="start_date_id"
                      isOutsideRange={() => false}
                      endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                      endDateId="end_date_id" // PropTypes.string.isRequired,
                      onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                      focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                      onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired
                       />
                 </div>
            </ModalBody>
            <ModalFooter>
              <Button color="success">Save</Button>{' '}
              <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
            </ModalFooter>
      </div>
    );
  }
 }

export default SKUProjectionModal;
