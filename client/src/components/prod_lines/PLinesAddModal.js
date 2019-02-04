import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addPLine, getPLines } from '../../actions/plineActions';

class PLinesAddModal extends React.Component {
  state = {
    modal: false,
    name: '',
    validate: {}
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChange = e => {
    this.validateName(e);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const newPLine = {
      name: this.state.name
    };

    this.props.addPLine(newPLine);
    this.props.getPLines(1, this.props.plines.pagelimit);
    this.toggle();
  }

  validateName(e) {
  const { validate } = this.state
    if (e.target.value.length > 0) {
      validate.nameState = 'has-success'
    } else {
      validate.nameState = 'has-danger'
    }
    this.setState({ validate })
  }

  render() {
    return (
      <div style={{'display': 'inline-block'}}>
      <Button color="success" onClick={this.toggle}>
        Add Product Line
      </Button>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}> Add Product Line to Database </ModalHeader>
        <ModalBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
                <Input
                  valid={ this.state.validate.nameState === 'has-success' }
                  invalid={ this.state.validate.nameState === 'has-danger' }
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Add Name of SKU"
                  onChange={this.onChange}>
                </Input>
                <FormFeedback valid>
                </FormFeedback>
                <FormFeedback invalid>
                  Please input a value.
                </FormFeedback>
            </FormGroup>
            <Button color="dark" style={{ marginTop: '2rem' }} type="submit" block>
                  Add Product Line
                </Button>
          </Form>
        </ModalBody>
      </Modal>
      </div>
    );
  }
}

PLinesAddModal.propTypes = {
  getPLines: PropTypes.func.isRequired,
  addPLine: PropTypes.func.isRequired,
  plines: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  plines: state.plines
});
export default connect(mapStateToProps, {addPLine, getPLines})(PLinesAddModal);
