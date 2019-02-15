import React from 'react';
import {
  Col, Row, Input,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Table, Form, FormGroup, Label
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLines, updateLine, deleteLine } from '../../actions/linesActions';

class LinesEntry extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        edit_modal: false,
        edit_id: '',
        edit_name: '',
        edit_shortname: '',
        edit_comment: '',
        validName: '',
        validShortName: '',
        validComment: ''
      };
    }

  componentDidMount() {
    this.props.getLines()
  }

  toggle = () => {
      this.setState({
        edit_modal: !this.state.edit_modal,
      });
  }

  onDeleteClick = id => {
    this.props.deleteLine(id)
  }

  onEditClick = (_id, name, shortName, comment) => {
    this.setState({
      edit_id: _id,
      edit_modal: true,
      edit_name: name,
      edit_shortname: shortName,
      edit_comment: comment,
      validName: 'success',
      validShortName: 'success',
      validComment: 'success'
    });
  };

  render() {
    const{ lines } = this.props.lines
    return (
        <div>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Short Name</th>
                  <th>Comment</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {lines.map(({ _id, name, shortname, comment}) => (
                    <tr key={_id}>
                      <td>
                        {name}
                      </td>
                      <td>
                        {shortname}
                      </td>
                      <td>
                        {comment}
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={e => this.onEditClick(_id, name, shortname, comment)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="edit"/>
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={this.onDeleteClick.bind(this, _id)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="trash"/>
                        </Button>
                      </td>
                    </tr>
              ))}
              </tbody>
            </Table>
                <Modal size="lg" isOpen={this.state.edit_modal} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader>Create Manufacturing Line</ModalHeader>
                  <ModalBody>
                       <Form>
                         <FormGroup>
                            <Row>
                            <Col md={6}>
                                <Label>Name</Label>
                                <Input valid={this.state.validName === 'success'} invalid={this.state.validName === 'failure'} value={this.state.edit_name} onChange={this.onNameChange}/>
                            </Col>
                            <Col md={2}>
                                <Label>Short Name</Label>
                                <Input type="zipcode" valid={this.state.validShortName === 'success'} invalid={this.state.validShortName === 'failure'} value={this.state.edit_shortname} onChange={this.onShortNameChange}/>
                            </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                             <Label>Comments</Label>
                             <Input type="textarea" valid={this.state.validComment === 'success'} placeholder='Add any comments on the manufacturing line...' value={this.state.edit_comment} onChange={this.onCommentChange}/>
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

LinesEntry.propTypes = {
  getLines: PropTypes.func.isRequired,
  lines: PropTypes.object.isRequired,
  updateLine: PropTypes.func.isRequired,
  deleteLine: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    lines: state.lines
});

export default connect(mapStateToProps, { getLines, updateLine, deleteLine })(LinesEntry);
