import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

import {Form, FormGroup, Label, Input, Button, Modal, ModalBody, ModalHeader} from 'reactstrap';
class RegisterComponent extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      username: "",
      password: "",
      password2: "",
      errors: {},
      modal: false,
    };
  }

componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
    e.preventDefault();
const newUser = {
      name: this.state.name,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2
    };
this.props.registerUser(newUser);
if(Object.keys(this.state.errors).length === 0){
  this.setState({submitted:true})
  this.toggle();
}
  };

toggle = () => {
  if(Object.keys(this.state.errors).length === 0 && this.state.submitted){
    this.setState({
      name: "",
      username: "",
      password: "",
      password2: ""
    })
  }
  this.setState({
    modal: !this.state.modal
  })
}
render() {
    const { errors } = this.state;
return (
      <div>
        <div>
          <Button onClick={this.toggle}>Register New User</Button>
        </div>
        <Modal isOpen={this.state.modal || Object.keys(errors).length > 0} toggle={this.toggle}>
          <ModalHeader>Register New User</ModalHeader>
          <ModalBody>
          <Form noValidate onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input onChange={this.onChange}
              value={this.state.name}
              error={errors.name}
              id="name"
              type="text"
              className={classnames("", {
                invalid: errors.name
              })}></Input>
              <span style={{'color': 'red'}}>
                {errors.name}
              </span>
            </FormGroup>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input onChange={this.onChange}
              value={this.state.username}
              error={errors.username}
              id="username"
              type="username"
              className={classnames("", {
                invalid: errors.username
              })}></Input>
              <span style={{'color': 'red'}}>
                {errors.username}
              </span>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input onChange={this.onChange}
              value={this.state.password}
              error={errors.password}
              id="password"
              type="password"
              className={classnames("", {
                invalid: errors.password
              })}></Input>
              <span style={{'color': 'red'}}>
                {errors.password}
              </span>
            </FormGroup>
            <FormGroup>
              <Label for="password2">Confirm Password</Label>
              <Input onChange={this.onChange}
              value={this.state.password2}
              error={errors.password2}
              id="password2"
              type="password"
              className={classnames("", {
                invalid: errors.password2
              })}>
              </Input>
              <span style={{'color': 'red'}}>
                {errors.password2}
              </span>
            </FormGroup>
            <Button type="submit"> Sign Up </Button>
          </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
RegisterComponent.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { registerUser }
)(RegisterComponent);
