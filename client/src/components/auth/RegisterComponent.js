import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

import {Form, FormGroup, Label, Input, Container,
Row, Col, Button} from 'reactstrap';
class RegisterComponent extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
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
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
this.props.registerUser(newUser, this.props.history);
  };
render() {
    const { errors } = this.state;
return (
      <div className="container">
        <Container>
          <Row>
            <Col></Col>
            <Col>
          <Form noValidate onSubmit={this.onSubmit}>
            <h4>
              <b>Register</b> below
            </h4>
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
              <Label for="email">Email</Label>
              <Input onChange={this.onChange}
              value={this.state.email}
              error={errors.email}
              id="email"
              type="email"
              className={classnames("", {
                invalid: errors.email
              })}></Input>
              <span style={{'color': 'red'}}>
                {errors.email}
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
          </Col>
          <Col></Col>
          </Row>
          </Container>
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
)(withRouter(RegisterComponent));
