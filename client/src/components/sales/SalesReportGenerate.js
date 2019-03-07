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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

class SalesReportGenerate extends React.Component {
  constructor(props){
      super(props)
      this.state = {
        modal: false,
        showAllPLines: false,
        showAllCustomers: true,
        allCustomersChecked: true,
        selected_plines:[],
        not_selected_plines:[],
        selected_customers: []
      };
  };

  componentDidMount() {
    this.props.getPLines(1, 10);
  }

  toggle = () => {
    const { plines } = this.props.plines;
    this.setState({
      modal: !this.state.modal,
      selected_plines: plines
    });
  }

  showAll = () => {
    this.setState({
      showAllPLines: !this.state.showAllPLines
    });
  }

  toggleCustomers = () => {
    alert("HI")
    this.setState({
      allCustomersChecked: !this.state.allCustomersChecked
    });
  }

  genOptions = (customers) => {
    var newOptions = [];
    customers.forEach(function(customer){
      var newOption = {value: customer._id, label: customer.name+": " }; // TODO add customer number
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  onChange = (e) => {
    var newCustomers = [];
    e.forEach(function(option){
      newCustomers = [...newCustomers, option.value];
    });
    this.setState({
      allCustomersChecked: false
    });
   // TODO API CALL
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
                               {this.state.selected_plines.map((pline) => (
                                 <CustomInput key={pline._id} type="checkbox" id={pline._id} label={pline.name}
                                 defaultChecked={true}/>
                               ))}
                             </div>}
                          </div>
                    </FormGroup>
                    <FormGroup>
                        <Label><h5>2. Select customers.</h5></Label>
                        <div style={{paddingBottom: '1.5em'}}>
                        <Row style={{marginBottom: '10px'}}>
                            <Col md={6}>
                                  <CustomInput id={100} checked={this.state.allCustomersChecked} type="radio" name="cust" defaultChecked onChange={e => this.setState({ allCustomersChecked: true })} label='Select all'/>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '10px'}}>
                            <Col md={6}>
                                  <CustomInput id={200} type="radio" name="cust" checked={!this.state.allCustomersChecked} onChange={e => this.setState({ allCustomersChecked: false })} label='Select specific customers:'/>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={1}/>
                            <Col>
                            <Select isMulti={true} options={this.genOptions(this.state.selected_plines)} onChange={this.onChange} />
                            </Col>
                        </Row>
                        </div>
                    </FormGroup>
                </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.toggle}>Generate Report</Button>{' '}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      </div>
    );
  }
 }

const mapStateToProps = state => ({
  getPLines: PropTypes.func.isRequired,
  plines: state.plines,
});

export default connect(mapStateToProps, {getPLines})(SalesReportGenerate);