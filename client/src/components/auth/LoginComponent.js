import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

import {Form, FormGroup, Label, Input, Container,
Row, Col, Button} from 'reactstrap';

class LoginComponent extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      isAdmin: false,
      email: "",
      password: "",
      errors: {}
    };
  }

componentDidMount() {
  // If logged in and user navigates to Login page, should redirect them to dashboard
  if (this.props.auth.isAuthenticated) {
    this.setState({isLoggedIn: true});
    if(this.props.auth.isAdmin) {
      this.setState({isAdmin: true});
    }
  }
}
componentWillReceiveProps(nextProps) {
  if (nextProps.auth.isAuthenticated) {
    this.setState({isLoggedIn: true})
  }
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
const userData = {
      email: this.state.email,
      password: this.state.password
    };
this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };
render() {
    const { errors } = this.state;
    if(this.state.isLoggedIn) {
      return (<Redirect to={"/ingredients"} />);
    }
return (
      <Container>
        <Row>
          <Col></Col>
          <Col>
        <Form noValidate onSubmit={this.onSubmit}>
          <h4>
            <b>Login</b> below
          </h4>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input onChange={this.onChange}
            value={this.state.email}
            error={errors.email}
            id="email"
            type="email"
            className={classnames("", {
              invalid: errors.email || errors.emailnotfound
            })}></Input>
            <span style={{'color': 'red'}}>
              {errors.email}
              {errors.emailnotfound}
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
              invalid: errors.password || errors.passwordincorrect
            })}>
            </Input>
            <span style={{'color': 'red'}}>
              {errors.password}
              {errors.passwordincorrect}
            </span>
          </FormGroup>
          <Button type="submit"> Login </Button>
        </Form>
        </Col>
        <Col></Col>
        </Row>
        </Container>
    );
  }
}
LoginComponent.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loginUser }
)(LoginComponent);
