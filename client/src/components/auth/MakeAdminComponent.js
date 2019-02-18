import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeAdmin } from "../../actions/authActions";
import classnames from "classnames";

import {Form, FormGroup, Label, Input, Container,
Row, Col, Button} from 'reactstrap';
class MakeAdminComponent extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
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
const adminUser = {
      username: this.state.username,
    };
this.props.makeAdmin(adminUser, this.props.history);
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
              Give<b> Admin</b> status below
            </h4>
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
            <Button type="submit"> Make Admin </Button>
          </Form>
          </Col>
          <Col></Col>
          </Row>
          </Container>
      </div>
    );
  }
}
MakeAdminComponent.propTypes = {
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
  { makeAdmin }
)(withRouter(MakeAdminComponent));
