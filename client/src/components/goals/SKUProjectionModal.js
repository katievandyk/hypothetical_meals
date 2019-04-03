import React from 'react';
import {
  ModalBody, ModalFooter, ModalHeader,
  Label,
  Button,
  CustomInput,
  Col, Row
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

  render() {
    return (
      <div>
            <ModalHeader>
            Projection Tool for {this.props.sku.name}
            </ModalHeader>
            <ModalBody style={{ minHeight: '400px'}}>
                <Label><h5>Select Timespan</h5></Label>
                <Row style={{paddingBottom: '1.5em'}}>
                    <Col>
                      <DateRangePicker
                      renderMonthText= {(month) =>  moment(month).format('MMMM')} // (month) => PropTypes.string,
                      startDate={this.state.startDate}
                      startDateId="start_date_id"
                      isOutsideRange={(day) => day > moment().add(1, 'year') || day < moment().add(-1, 'day')}
                      numberOfMonths={2}
                      displayFormat="MMM D"
                      endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                      endDateId="end_date_id" // PropTypes.string.isRequired,
                      onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                      focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                      onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired
                       />&nbsp;
                      <Button size="lg" color="success">Generate</Button>
                     </Col>
                 </Row>
                 <Row>
                    <Col style={{'textAlign': 'center', 'paddingTop': '100px'}}>No projection generated.</Col>
                 </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.props.toggle}>Close</Button>
            </ModalFooter>
      </div>
    );
  }
 }

export default SKUProjectionModal;
