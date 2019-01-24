import React, { Component } from "react";
import { Link, History, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

import {Form, FormGroup, Label, Input, Container,
Row, Col, Button} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class LoginComponent extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      email: "",
      password: "",
      errors: {}
    };
  }

componentDidMount() {
  // If logged in and user navigates to Login page, should redirect them to dashboard
  if (this.props.auth.isAuthenticated) {
    this.setState({isLoggedIn: true})
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
      <div className="container">
      <Container>
        <Row>
          <Col></Col>
          <Col>
        <Form noValidate onSubmit={this.onSubmit}>
          <h4>
            <b>Login</b> below
          </h4>
          <p className="grey-text text-darken-1">
            Don't have an account?    <Link to="/register">Register</Link>
          </p>
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
      </div>
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
