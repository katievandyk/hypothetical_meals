import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeAdmin, revokeAdmin, deleteUser, getAllUsers } from "../../actions/authActions";
import {Alert} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Container,
Row, Col, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
class UsersEntry extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      errors: {},
      userCreated_alert: false,
      revoke_modal: false,
      grant_modal: false,
      edit_user: {}
    };
  }

componentDidMount() {
  this.props.getAllUsers();
}

componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  toggle = () => {
    this.setState({
      userCreated_alert: !this.userCreated_alert
    })
  }

revoke_toggle = () => {
  this.setState({
    revoke_modal: !this.state.revoke_modal
  })
}

grant_toggle = () => {
  this.setState({
    grant_modal: !this.state.grant_modal
  })
}

onEditClick = (_id, name, username, isAdmin, e) => {
  const newObj = {_id: _id, name: name, username: username, isAdmin: isAdmin};
  if(isAdmin){
    this.setState({
      revoke_modal: true,
      grant_modal: false,
      edit_user: newObj
    });
  }
  else {
    this.setState({
      revoke_modal: false,
      grant_modal: true,
      edit_user: newObj
    });
  }
}

onDeleteClick = (username, e) => {
  this.props.deleteUser({username:username});
}

revoke = (username, e) => {
  this.props.revokeAdmin({username: username});
  this.revoke_toggle();
}

grant = (username, e) => {
  this.props.makeAdmin({username: username});
  this.grant_toggle();
}


render() {
    const { errors } = this.state;
    const users = this.props.auth.users;
    console.log(this.props.auth.user);
return (
      <div className="container">
        <Container>
        <Row>
          <Col>
          </Col>
          <Col>
            <Alert toggle={this.toggle} isOpen={this.state.userCreated_alert && !errors.username}> Admin User {this.state.username} created! </Alert>
          </Col>
          <Col></Col>
        </Row>
          <Row>
            <Table responsive size="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Admin?</th>
                  <th>Change Status</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody is="transition-group" >
                <TransitionGroup className="ingredients-table" component={null}>
                  {users.map(({_id, name, username, isAdmin }) => (
                    <CSSTransition key={_id} timeout={500} classNames="fade">
                      <tr>
                        <td> {name} </td>
                        <td> {username} </td>
                        <td> {isAdmin?("Y"):("N")} </td>
                        <td>
                            <Button size="sm" color="link" disabled={this.props.auth.user.id === _id}
                              onClick={this.onEditClick.bind(this,
                                _id, name, username, isAdmin
                              )}
                              style={{'color':'black'}}>
                              <FontAwesomeIcon icon = "user-cog"/>
                            </Button>
                          </td>
                          <td >
                            <Button size="sm" sm="2"color="link" disabled={this.props.auth.user.id === _id}
                              onClick={this.onDeleteClick.bind(this, username)}
                              style={{'color':'black'}}>
                              <FontAwesomeIcon icon="trash"/>
                            </Button>
                          </td>
                      </tr>
                    </CSSTransition>
                ))}
                </TransitionGroup>
              </tbody>
            </Table>
          </Row>
          </Container>
          <Modal isOpen={this.state.revoke_modal} toggle={this.revoke_toggle}>
          <ModalHeader toggle={this.revoke_toggle}>
          Revoke Admin Status for {this.state.edit_user.name}</ModalHeader>
        <ModalBody>
          Are you sure you want to <b>Revoke Admin Status</b> for {this.state.edit_user.name} (Username: {this.state.edit_user.username})?

        </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={this.revoke.bind(this, this.state.edit_user.username)}>Yes - Revoke</Button>
        <Button onClick={this.revoke_toggle}>Cancel</Button>
      </ModalFooter></Modal>
      <Modal isOpen={this.state.grant_modal} toggle={this.grant_toggle}>
        <ModalHeader toggle={this.grant_toggle}>
        Grant Admin Status to {this.state.edit_user.name}</ModalHeader>
      <ModalBody>
        Are you sure you want to <b>Grant Admin Status</b> to {this.state.edit_user.name} (Username: {this.state.edit_user.username})?
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={this.grant.bind(this, this.state.edit_user.username)}>Yes - Grant</Button>
        <Button onClick={this.grant_toggle}>Cancel</Button></ModalFooter></Modal>
      </div>
    );
  }
}
UsersEntry.propTypes = {
  makeAdmin: PropTypes.func.isRequired,
  revokeAdmin: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { makeAdmin, revokeAdmin, getAllUsers, deleteUser })(withRouter(UsersEntry));
