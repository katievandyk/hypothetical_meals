import React from 'react';
import {
  ModalBody, ModalFooter, ModalHeader,
  Label,
  Button,
  Spinner,
  Table,
  Col, Row, Tooltip
} from 'reactstrap';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment'
import { getSKUProjection }  from '../../actions/goalsActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SKUProjectionModal extends React.Component {
  constructor(props){
      super(props)
      this.tt_toggle = this.tt_toggle.bind(this);
      this.state = {
        startDate: null,
        endDate: null,
        reportGenerated: false,
        ttOpen: false,
      };
  };

  generateReport = () => {
    if(this.state.startDate === null || this.state.endDate === null) {
        alert("Please enter a start and end date.")
    }
    else {
        const obj = {
                     start_month: this.state.startDate.month() + 1,
                     start_day: this.state.startDate.date(),
                     end_month: this.state.endDate.month() + 1,
                     end_day: this.state.endDate.date()
                    }
        this.props.getSKUProjection(this.props.sku._id, obj)
        this.setState({
            reportGenerated: true
        });
    }
  }

  reportToggle = () => {
    this.setState({
        reportGenerated: false
    });
    this.props.toggle()
  }

  tt_toggle() {
    this.setState({
      ttOpen: !this.state.ttOpen
    });
  }

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
                      isOutsideRange={() => false}
                      numberOfMonths={2}
                      displayFormat="MMM D"
                      endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                      endDateId="end_date_id" // PropTypes.string.isRequired,
                      onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                      focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                      onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired
                       />&nbsp;
                      <Button size="lg" color="success" onClick={this.generateReport}>Generate</Button>
                     </Col>
                 </Row>
                 {!this.state.reportGenerated &&
                 <Row>
                    <Col style={{'textAlign': 'center', 'paddingTop': '100px'}}>No projection generated.</Col>
                 </Row>}
                 {this.props.goals.loading &&
                    <div style={{'textAlign':'center'}}>
                      <Spinner type="grow" color="success" />
                      <Spinner type="grow" color="success" />
                      <Spinner type="grow" color="success" />
                    </div>
                 }
                 {this.state.reportGenerated && !this.props.goals.loading && this.props.goals.sku_projection && this.props.goals.sku_projection.length > 0 &&
                   <Col>
                    <Table responsive size="sm">
                        <thead>
                            <tr>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.goals.sku_projection.map((obj) =>(
                                (obj.sales > 0 &&
                                      <tr>
                                        <td> {moment(obj.start).format('MMM DD YYYY')} </td>
                                        <td> {moment(obj.end).format('MMM DD YYYY')} </td>
                                        <td> ${obj.sales}</td>
                                      </tr>
                                 )
                             ))}
                            {this.props.goals.sku_projection.map((obj) =>(
                                 (obj.summary &&
                                      <tr>
                                        <td><b>Average</b></td>
                                        <td></td>
                                        <td>
                                            <b>{obj.display}</b>&nbsp;&nbsp;
                                            <Button id="tt" onClick={this.props.copyQuantity(obj.avg_sales)} color="success" size="sm"><FontAwesomeIcon icon = "clipboard"/></Button>
                                            <Tooltip placement="right" isOpen={this.state.ttOpen} target="tt" toggle={this.tt_toggle}>Copy to Quantity</Tooltip>
                                        </td>
                                      </tr>
                                )
                             ))}
                        </tbody>
                     </Table>
                     </Col>
                 }
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.reportToggle}>
                Close
              </Button>
            </ModalFooter>
      </div>
    );
  }
 }

    SKUProjectionModal.propTypes = {
      getSKUProjection: PropTypes.func.isRequired,
      goals: PropTypes.object.isRequired
    };

    const mapStateToProps = state => ({
      goals: state.goals
    });

    export default connect(mapStateToProps, {getSKUProjection})(SKUProjectionModal);
