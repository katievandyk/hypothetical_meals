import React from 'react';
import {
  Row, Col,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label,
  Button,
  CustomInput,
} from 'reactstrap';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import { connect } from 'react-redux';
import { getSKUDrilldown } from '../../actions/salesActions';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SKUDrilldownEntry from '../../components/sales/SKUDrilldownEntry';
import { exportDrilldown } from '../../actions/exportActions';
import moment from 'moment'

class SKUDrilldownModal extends React.Component {
  constructor(props){
      super(props)
      this.state = {
        validateCustomers: '',
        settings_modal: false,
        allCustomersCheckedDD: true,
        selected_customerDD: '',
        startDate: null,
        endDate: null
      };
  };

  componentDidMount() {
      var today = new Date();
      var past = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      this.setState({
        allCustomersCheckedDD: this.props.all_customers,
        selected_customerDD: this.props.sel_customer
      });
      if(this.props.all_customers){
           this.props.getSKUDrilldown(this.props.curr_sku._id, {start_date: moment(past).format('MM-DD-YYYY'), end_date: moment(today).format('MM-DD-YYYY')});
      }
      else{
        this.props.getSKUDrilldown(this.props.curr_sku._id, {start_date: moment(past).format('MM-DD-YYYY'), end_date: moment(today).format('MM-DD-YYYY'), customer: this.props.sel_customer});
      }
  }

  settings_toggle = () => {
    this.setState({
      settings_modal: !this.state.settings_modal,
      startDate: null,
      endDate: null
    });
  }

  export = () => {
    this.props.exportDrilldown(this.props.sales.drilldown_sku_id, this.props.sales.drilldown_body);
  }

  genOptionsDD = (customers) => {
    var newOptions = [];
    customers.forEach(function(customer){
      var newOption = {value: customer._id, label: customer.name+": " + customer.number};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  onChangeCustomers = (e) => {
    var newVal = this.state.validate;
    if(this.state.selected_customerDD === ''){
        newVal = 'isInvalid'
    }
    else {
        newVal = 'isValid'
    }
    this.setState({
      allCustomersCheckedDD: false,
      selected_customerDD: e.value,
      validateCustomers: newVal
    });
  }

  onSubmitSettings = () =>{
    if(this.state.validateCustomers === 'isInvalid') {
        alert("Please select a valid customer.")
    }
    else {
        var newObj = {}
        if(this.state.startDate === null || this.state.endDate === null) {
          var today = new Date();
          var past = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
          newObj =  {start_date: moment(past).format('MM-DD-YYYY'), end_date: moment(today).format('MM-DD-YYYY')}
        }
        else {
          var startString = this.state.startDate.format('MM-DD-YYYY');
          var endString = this.state.endDate.format('MM-DD-YYYY');
          newObj = {start_date: startString, end_date: endString}
        }
      if(!this.state.allCustomersCheckedDD) newObj['customer'] = this.state.selected_customerDD
      this.props.getSKUDrilldown(this.props.curr_sku._id, newObj);
      this.settings_toggle();
    }
  }

  render() {
    return (
      <div>
        <ModalBody>
          <Row style={{marginBottom: '20px'}}>
              <Col  style={{'textAlign': 'right'}}>
                  <Button onClick={this.settings_toggle}>Settings</Button>&nbsp;
                  <Button onClick={this.export} color="success">Export</Button>
              </Col>
          </Row>
            <SKUDrilldownEntry sku_drilldown={this.props.sales.sku_drilldown} loading={this.props.sales.loading}/>

        </ModalBody>
        <Modal isOpen={this.state.settings_modal} toggle={this.settings_toggle} size='md'>
            <ModalHeader>Settings</ModalHeader>
            <ModalBody>
                <Label><h6>1. Modify Customer Selection</h6></Label>
                <div style={{paddingBottom: '1.5em'}}>
                    <Row style={{marginBottom: '10px'}}>
                        <Col md={6}>
                            <CustomInput id={100} checked={this.state.allCustomersCheckedDD} type="radio" name="cust" onChange={e => this.setState({ allCustomersCheckedDD: true, validateCustomers: '' })} label='Select all'/>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '10px'}}>
                        <Col md={6}>
                            <CustomInput id={200} type="radio" name="cust" checked={!this.state.allCustomersCheckedDD} onChange={e => this.onChangeCustomers(e)} label='Select a specific customer:'/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={1}/>
                        <Col>
                        <Select
                            className={this.state.validateCustomers}
                            classNamePrefix="react-select"
                            options={this.genOptionsDD(this.props.sales.summary_customers)}
                            onChange={this.onChangeCustomers}/>
                        </Col>
                   </Row>
                </div>
                <Label><h6>2. Modify timespan (defaults to past year)</h6></Label>
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
              <Button color="success" onClick={this.onSubmitSettings}>Generate Report</Button>{' '}
              <Button color="secondary" onClick={this.settings_toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
      </div>
    );
  }
 }

 SKUDrilldownModal.propTypes = {
   getSKUDrilldown: PropTypes.func.isRequired,
   exportDrilldown: PropTypes.func.isRequired,
   sales: PropTypes.object.isRequired
 };

 const mapStateToProps = (state) => ({
   sales: state.sales
 });

export default connect(mapStateToProps, { getSKUDrilldown, exportDrilldown })(SKUDrilldownModal);
