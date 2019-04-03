import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

import {Form, FormGroup, Label, Input, FormFeedback, Button, Modal, ModalBody, ModalHeader} from 'reactstrap';
class RegisterComponent extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      username: "",
      password: "",
      password2: "",
      modal: false,
      validate: {}
    };
  }

onChange = e => {
    this.validate(e);
    this.setState({ [e.target.id]: e.target.value });
  };

  validate = e => {
    const field_type = e.target.name;
    const { validate } = this.state
    if (e.target.value.length > 0) {
      if(field_type === 'name'){
        validate[field_type] = 'has-success';
      }
      else if(field_type === 'username'){
        validate[field_type] = 'has-success';
        for(var i = 0; i < this.props.auth.users.length; i++){
          if(this.props.auth.users[i].username === e.target.value){
            validate[field_type] = 'user-exists';
          }
        }
      }
      else if(field_type === 'password'){
        if (e.target.value.length >= 6) {
          validate[field_type] = 'has-success';
        }
        else {
          validate[field_type] = 'not-valid'
        }
      }
      else if(field_type === 'password2'){
        if (e.target.value.length >= 6) {
          validate[field_type] = 'has-success';
        }
        else if(e.target.value !== this.state.password){
          validate[field_type] = 'need-match'
        }
        else {
          validate[field_type] = 'not-valid'
        }
      }
    } else {
      validate[e.target.name] = 'is-empty';
    }
    this.setState({ validate });
  }

  allValidated = () => {
    const validate_kv = Object.entries(this.state.validate);
    for(var i = 0; i < validate_kv.length; i++){
      if(validate_kv[i][1] !== 'has-success'){
        return false;
      }
    }
    return true;
  }

onSubmit = e => {
    e.preventDefault();
const newUser = {
      name: this.state.name,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2
    };
var allRequiredFields = true;
var newValidate = this.state.validate;
if(newValidate.name !== 'has-success'){
  newValidate.name = 'is-empty';
  allRequiredFields = false;
}
if(newValidate.username !== 'has-success'){
  newValidate.username = 'is-empty';
  allRequiredFields = false;
}
if(newValidate.password !== 'has-success'){
  newValidate.password = 'is-empty';
  allRequiredFields = false;
}
if(newValidate.password2 !== 'has-success'){
  newValidate.password2 = 'is-empty';
  allRequiredFields = false;
}

if(allRequiredFields){
  this.props.registerUser(newUser);
  this.toggle();
}
else{
  this.setState({
    validate: newValidate
  })
}
  };

toggle = () => {
  this.setState({
    modal: !this.state.modal,
    name: "",
    username: "",
    password: "",
    password2: "",
    validate: {}
  })
}
render() {
    const { errors } = this.state;
return (
      <div>
        <div>
          <Button onClick={this.toggle}>Register New User</Button>
        </div>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>Register New User</ModalHeader>
          <ModalBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input onChange={this.onChange}
                valid={ this.state.validate.name === 'has-success' }
                invalid={ this.state.validate.name === 'is-empty' }
              value={this.state.name}
              name="name"
              id="name"
              type="text"></Input>
              <FormFeedback>
                Please input a name.
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input onChange={this.onChange}
                valid={this.state.validate.username === 'has-success' }
                invalid={this.state.validate.username === 'is-empty' || this.state.validate.username === 'user-exists'}
              value={this.state.username}
              id="username"
              name="username"
              type="username"></Input>
            {this.state.validate.username === 'is-empty' ? (
                <FormFeedback>
                  Please input a username.
                </FormFeedback>
              ):(
                <FormFeedback>
                  This username already belongs to another user.
                </FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input onChange={this.onChange}
                valid={this.state.validate.password === 'has-success' }
                invalid={this.state.validate.password === 'is-empty' || this.state.validate.password === 'not-valid'}
              value={this.state.password}
              name="password"
              id="password"
              type="password"
              ></Input>
            {this.state.validate.password === 'is-empty' ? (
                  <FormFeedback>
                    Please input a password.
                  </FormFeedback>
                ):(
                  <FormFeedback>
                    Password required to be at least 6 characters.
                  </FormFeedback>
                )}
            </FormGroup>
            <FormGroup>
              <Label for="password2">Confirm Password</Label>
              <Input onChange={this.onChange}
                valid={this.state.validate.password2 === 'has-success' }
                invalid={this.state.validate.password2 === 'is-empty' ||
                  this.state.validate.password2 === 'not-valid' ||
                this.state.validate.password2 === 'need-match'}
              value={this.state.password2}
              id="password2"
              name="password2"
              type="password">
              </Input>
              {this.state.validate.password2 === 'is-empty' ? (
                  <FormFeedback>
                    Please confirm your password.
                  </FormFeedback>
                ):(
                  this.state.validate.password2 === 'not-valid' ? (
                    <FormFeedback>
                      Password required to be at least 6 characters.
                    </FormFeedback>
                  ):(
                    <FormFeedback>
                      Passwords need to match.
                    </FormFeedback>
                  )

                )}
            </FormGroup>
            <Button disabled={!this.allValidated()} type="submit"> Sign Up </Button>
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
