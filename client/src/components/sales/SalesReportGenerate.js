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

class SalesReportGenerate extends React.Component {
  state = {
    modal: false,
    showAllPLines: true,
    showAllCustomers: true,
    selected_plines:[],
    not_selected_plines:[],
    selected_customers: []
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
                                <Label>Customer Search <em>(by name or by number)</em></Label>
                                <InputGroup>
                                  <Input type="email" placeholder="Keyword Search" name="keywords" onChange={this.onChange}/>
                                  <InputGroupAddon addonType="append"><Button onClick={this.searchKW}><FontAwesomeIcon icon = "search"/></Button></InputGroupAddon>
                                </InputGroup>
                        </div>
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