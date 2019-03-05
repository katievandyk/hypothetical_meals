import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeAdmin } from "../../actions/authActions";
import {Alert} from 'reactstrap';
import classnames from "classnames";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {Form, FormGroup, Label, Input, Container,
Row, Col, Button, Table} from 'reactstrap';
class UsersEntry extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      errors: {},
      userCreated_alert: false
    };
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
/*onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
  this.setState({
    userCreated_alert: !this.state.errors.username
  });
    e.preventDefault();
const adminUser = {
      username: this.state.username,
    };
this.props.makeAdmin(adminUser, this.props.history);
  };
  */

onEditClick = (_id, name, e) => {
  console.log(_id, name);
}

onDeleteClick = (_id, e) => {
  console.log(_id);
}

render() {
    const { errors } = this.state;
    console.log(this.props.auth);
    const users = [{_id: "333", name: "hi"}, {_id: "344", name: "test"}];
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
                  <th>Admin?</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody is="transition-group" >
                <TransitionGroup className="ingredients-table" component={null}>
                  {users.map(({_id, name }) => (
                    <CSSTransition key={_id} timeout={500} classNames="fade">
                      <tr>
                        <td> {name} </td>
                        <td> Y/N </td>
                        <td>
                            <Button size="sm" color="link"
                              onClick={this.onEditClick.bind(this,
                                _id, name
                              )}
                              style={{'color':'black'}}>
                              <FontAwesomeIcon icon = "edit"/>
                            </Button>
                          </td>
                          <td >
                            <Button size="sm" sm="2"color="link"
                              onClick={this.onDeleteClick.bind(this, _id)}
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
      </div>
    );
  }
}
UsersEntry.propTypes = {
  makeAdmin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { makeAdmin })(UsersEntry);
