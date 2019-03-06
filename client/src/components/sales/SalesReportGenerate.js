import React from 'react';
import {
  Row, Col,
  Button,
  Modal,
  ModalHeader,
  CustomInput,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPLines } from '../../actions/plineActions';

class SalesReportGenerate extends React.Component {
  state = {
    modal: false,
    showAllPLines: false,
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
      <Modal size='lg' isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader>Generate a report.</ModalHeader>
        <ModalBody>
                <Form>
                    <FormGroup>
                        <Label><h5>1. Select product lines.</h5></Label>
                          <div>
                                <Row>
                                    <Col md={2}>
                                      <CustomInput id={0} type="checkbox" label={'Select All'}
                                       defaultChecked={true}/>
                                    </Col>
                                    <Col md={4} style={{paddingLeft: '0em'}}>
                                      <Button onClick={this.showAll} color="link" size="sm">
                                        {this.state.showAllPLines ? ('(Hide All)'):('(Edit Selection/View All)')}
                                      </Button>
                                     </Col>
                                </Row>
                          {this.state.showAllPLines &&
                             <div>
                               {this.state.selected_plines.map((pline) => (
                                 <CustomInput key={pline._id} type="checkbox" id={pline._id} label={pline.name}
                                 defaultChecked={true}/>
                               ))}
                             </div>}
                          </div>
                    </FormGroup>
                    <FormGroup>
                        <Label><h5>2. Select customers.</h5></Label>
                    </FormGroup>
                </Form>
        </ModalBody>
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