import React from 'react';
import {
  Table, Button, Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input
 } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getPLines, deletePLine, updatePLine} from '../../actions/plineActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles.css'

class PLinesEntry extends React.Component {
  state = {
    modal: false,
    edit_id: '',
    edit_name: '',
    validate: {}
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      validate: {}
    });
  }

  componentDidMount() {
    this.props.getPLines(1,10);
  }

  onDeleteClick = id => {
    this.props.deletePLine(id);
  };

  onEditClick = (id, name) => {
    this.setState({
      modal: true,
      edit_id: id,
      edit_name: name
    });
  };

  onChange = e => {
    this.validateName(e);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  validateName(e) {
  const { validate } = this.state
    if (e.target.value.length > 0) {
      validate.nameState = 'has-success'
    } else {
      validate.nameState = 'has-danger'
    }
    this.setState({ validate })
  }

  onEditSubmit = e => {
    e.preventDefault();

    const editedPLine = {
      id: this.state.edit_id,
      name: this.state.edit_name
    };

    this.props.updatePLine(editedPLine, this.props.plines.page, this.props.plines.pagelimit);
    this.toggle();
  };

  render() {
    const { plines } = this.props.plines;
    const loading = this.props.plines.loading;

    if(loading){
      return (
        <div style={{'textAlign':'center'}}>
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
        </div>

      );
    }
    return (
      <div>
        <Table responsive size="sm">
          <thead>
            <tr>
              <th>Name</th>
                {this.props.auth.isAdmin &&
                  <th>Edit</th>
                }
                {this.props.auth.isAdmin &&
                  <th>Delete</th>
                }
            </tr>
          </thead>
          <tbody is="transition-group" >
            <TransitionGroup className="ingredients-table" component={null}>
              {plines.map(({_id, name }) => (
                <CSSTransition key={_id} timeout={500} classNames="fade">
                  <tr>
                    <td> {name} </td>
                    {this.props.auth.isAdmin &&
                      <td>
                        <Button size="sm" color="link"
                          onClick={this.onEditClick.bind(this,
                            _id, name
                          )}
                          style={{'color':'black'}}>
                          <FontAwesomeIcon icon = "edit"/>
                        </Button>
                      </td> }
                    {this.props.auth.isAdmin &&
                      <td >
                        <Button size="sm" sm="2"color="link"
                          onClick={this.onDeleteClick.bind(this, _id)}
                          style={{'color':'black'}}>
                          <FontAwesomeIcon icon="trash"/>
                        </Button>
                      </td>
                    }
                  </tr>
                </CSSTransition>
            ))}
            </TransitionGroup>
          </tbody>
        </Table>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}> Edit Product Line </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onEditSubmit}>
              <FormGroup>
                <Label for="edit_name">Name</Label>
                  <Input
                    valid={ this.state.validate.nameState === 'has-success' }
                    invalid={ this.state.validate.nameState === 'has-danger' }
                    type="text"
                    name="edit_name"
                    id="edit_name"
                    onChange={this.onChange}
                    defaultValue={this.state.edit_name}>
                  </Input>
                  <FormFeedback valid>
                  </FormFeedback>
                  <FormFeedback>
                    Please input a value.
                  </FormFeedback>
              </FormGroup>
              <div><p style={{'fontSize':'0.8em', marginBottom: '0px'}} className={this.state.validate.nameState === 'has-danger' ? (''):('hidden')}>There are fields with errors. Please go back and fix these fields to submit.</p>
              <Button color="dark" className={this.state.validate.nameState === 'has-danger'?('disabled'): ('')} type="submit" block>
                    Submit Product Line Edit
                  </Button></div>
            </Form>
          </ModalBody>
        </Modal>
        </div>

    );
  }
}

PLinesEntry.propTypes = {
  getPLines: PropTypes.func.isRequired,
  deletePLine: PropTypes.func.isRequired,
  updatePLine: PropTypes.func.isRequired,
  plines: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  plines: state.plines,
  auth: state.auth
});

export default connect(mapStateToProps, { getPLines, deletePLine, updatePLine })(PLinesEntry);
