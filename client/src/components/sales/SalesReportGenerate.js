import React from 'react';
import {
  Row, Col,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  CustomInput,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input, InputGroupAddon, InputGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPLines } from '../../actions/plineActions';
import { getSalesSKUs } from '../../actions/salesActions';
import { getCustomers } from '../../actions/salesActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

class SalesReportGenerate extends React.Component {

  constructor(props){
      super(props)
      this.modifyPlines = this.modifyPlines.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.generateReport = this.generateReport.bind(this);
      this.state = {
        modal: false,
        showAllPLines: false,
        allCustomersChecked: true,
        selected_plines:[],
        selected_customer: '',
      };
  };

  componentDidMount() {
    this.props.getPLines(1, 10);
    this.props.getCustomers();
  }

  toggle = () => {
    const { plines } = this.props.plines;
    var plines_options = Object.values(plines).flat();
    this.setState({
      modal: !this.state.modal,
      selected_plines: plines_options
    });
  }

  showAll = () => {
    this.setState({
      showAllPLines: !this.state.showAllPLines
    });
  }

  toggleCustomers = () => {
    this.setState({
      allCustomersChecked: !this.state.allCustomersChecked
    });
  }

  onSubmit = () => {
    var pline_ids = []
    this.state.selected_plines.forEach(pline => pline_ids.push(pline._id))
    this.props.getSalesSKUs(pline_ids, this.generateReport);
  }

  generateReport = (sku_ids) => {
    this.props.generateReport(sku_ids, this.state.allCustomersChecked, this.state.selected_customer)
    this.toggle();
  }

  modifyPlines = (e, pline) => {
     var new_selected_plines = [];
     if(this.state.selected_plines.length > 0){
       new_selected_plines = this.state.selected_plines;
     }
     if(e.target.checked){
       new_selected_plines = new_selected_plines.concat(pline);
     }
     else{
       new_selected_plines = new_selected_plines.filter(({_id}) => _id !== pline._id);
     }
     this.setState({
       selected_plines: new_selected_plines
     });
  }

  genOptions = (customers) => {
    var newOptions = [];
    customers.forEach(function(customer){
      var newOption = {value: customer._id, label: customer.name+": " + customer.number}; // TODO add customer number
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  onChange = (e) => {
    var newCustomers = [];
    this.setState({
      allCustomersChecked: false,
      selected_customer: e.value
    });
  }

  render() {
    return (
      <div style={{'display': 'inline-block'}}>
      <Button color="success" onClick={this.toggle}>
        Generate Summary Report
      </Button>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader>Generate a report.</ModalHeader>
        <ModalBody>
                <Form>
                    <FormGroup>
                        <Label><h5>1. Select product lines.</h5></Label>
                          <div style={{paddingBottom: '1.5em'}}>
                                <Row>
                                    <Col md={3}>
                                      <CustomInput id={0} type="checkbox" label={'Select All'}
                                       defaultChecked={true}/>
                                    </Col>
                                    <Col md={6} style={{paddingLeft: '0em'}}>
                                      <Button onClick={this.showAll} color="link" size="sm">
                                        {this.state.showAllPLines ? ('(Hide All)'):('(Edit Selection/View All)')}
                                      </Button>
                                     </Col>
                                </Row>
                          {this.state.showAllPLines &&
                             <div style={{marginLeft: '20px'}}>
                               {this.props.plines.plines.map((pline) => (
                                 <CustomInput key={pline._id} type="checkbox" id={pline._id} label={pline.name}
                                 defaultChecked={true} onClick={e => this.modifyPlines(e, pline)}/>
                               ))}
                             </div>}
                          </div>
                    </FormGroup>
                    <FormGroup>
                        <Label><h5>2. Select customers.</h5></Label>
                        <div style={{paddingBottom: '1.5em'}}>
                        <Row style={{marginBottom: '10px'}}>
                            <Col md={6}>
                                  <CustomInput id={100} checked={this.state.allCustomersChecked} type="radio" name="cust" onChange={e => this.setState({ allCustomersChecked: true })} label='Select all'/>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '10px'}}>
                            <Col md={6}>
                                  <CustomInput id={200} type="radio" name="cust" checked={!this.state.allCustomersChecked} onChange={e => this.setState({ allCustomersChecked: false })} label='Select a specific customer:'/>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={1}/>
                            <Col>
                            <Select isMulti={false} options={this.genOptions(this.props.sales.summary_customers)} onChange={this.onChange} />
                            </Col>
                        </Row>
                        </div>
                    </FormGroup>
                </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.onSubmit}>Generate Report</Button>{' '}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      </div>
    );
  }
 }

SalesReportGenerate.propTypes = {
  getPLines: PropTypes.func.isRequired,
  getSalesSKUs: PropTypes.func.isRequired,
  getCustomers: PropTypes.func.isRequired,
  sales: PropTypes.object.isRequired,
  plines: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  plines: state.plines,
  sales: state.sales
});

export default connect(mapStateToProps, { getPLines, getSalesSKUs, getCustomers })(SalesReportGenerate);