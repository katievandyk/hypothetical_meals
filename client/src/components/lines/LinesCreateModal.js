import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLines, addLine } from '../../actions/linesActions';

import {
  Col, Row, Input,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Label
} from 'reactstrap';

class LinesCreateModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      name: '',
      shortname: '',
      comment: '',
      validName: '',
      validShortName: '',
      validComment: ''
    };

    this.toggle = this.toggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }

   componentDidMount() {
        this.props.getLines()
   }

   onSubmit = e => {
     if(this.state.validName !== 'success') alert("Please enter a unique name for your goal.")
     else if(this.state.validShortName !== 'success') alert("Please enter a valid short name.")
     else {
         const newLine = {
           name: this.state.name,
           shortname: this.state.shortname,
           comment: this.state.comment
         };
         this.props.addLine(newLine);
         this.toggle();
     }
   }

   onNameChange = e => {
        this.setState({ name: e.target.value })
        var valid = '';
        if (e.target.value.length > 0 && e.target.value.length <= 32) {
          valid = 'success'
        } else {
          valid = 'failure'
        }
        this.setState({ validName: valid })
   }

   onShortNameChange = e => {
        var lines  = this.props.lines.lines
        this.setState({ shortname: e.target.value })
        var valid = '';
        if (e.target.value.length > 0 && e.target.value.length <= 5 && lines.find(elem => elem.shortname === e.target.value) == null) {
          valid = 'success'
        } else {
          valid = 'failure'
        }
        this.setState({ validShortName: valid })
   }

   onCommentChange = e => {
        this.setState({ comment: e.target.value })
        var valid = '';
        if (e.target.value.length > 0) {
          valid = 'success'
        }
        this.setState({ validComment: valid })
   }


  toggle() {
    this.setState({
      modal: !this.state.modal,
      name: '',
      shortname: '',
      comment: '',
      validName: '',
      validShortName: '',
      validComment: ''
    });
  }


  render() {
    return (
      <div>
        <Button className={(this.props.auth.isAdmin || this.props.auth.user.product) ? "" : "hidden"} onClick={this.toggle} color="success" style={{'display': 'inline-block'}}>Create Line</Button>
        <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader>Create Manufacturing Line</ModalHeader>
          <ModalBody>
               <Form>
                 <FormGroup>
                    <Row>
                    <Col md={6}>
                        <Label>Name</Label>
                        <Input valid={this.state.validName === 'success'} invalid={this.state.validName === 'failure'} value={this.state.name} onChange={this.onNameChange}/>
                    </Col>
                    <Col md={2}>
                        <Label>Short Name</Label>
                        <Input type="zipcode" valid={this.state.validShortName === 'success'} invalid={this.state.validShortName === 'failure'} value={this.state.shortname} onChange={this.onShortNameChange}/>
                    </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                     <Label>Comments</Label>
                     <Input type="textarea" valid={this.state.validComment === 'success'} placeholder='Add any comments on the manufacturing line...' value={this.state.comment} onChange={this.onCommentChange}/>
                 </FormGroup>
               </Form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.onSubmit} color="success">Save</Button> &nbsp;
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
  }

    LinesCreateModal.propTypes = {
      addLine: PropTypes.func.isRequired,
      lines: PropTypes.object.isRequired,
      auth: PropTypes.object.isRequired
    };

    const mapStateToProps = state => ({
      lines: state.lines,
      auth: state.auth
    });


    export default connect(mapStateToProps, { addLine, getLines })(LinesCreateModal);
